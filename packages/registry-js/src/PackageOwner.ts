import { BigNumber, Signer } from "ethers";
import {
  BytesLike,
  formatBytes32String,
  solidityKeccak256,
} from "ethers/lib/utils";
import { computeMerkleProof } from "@polywrap/registry-core-js";
import { EnsDomain } from "@polywrap/registry-core-js";
import { RegistryContracts } from "./RegistryContracts";
import {
  PackageOwnershipManager,
  PolywrapRegistrar,
  PolywrapRegistry,
  VerificationTreeManager,
  VersionVerificationManager,
  VotingMachine,
} from "./typechain";

export type BlockchainsWithRegistry = "l2-chain-name" | "ethereum" | "xdai";

export class PackageOwner {
  constructor(signer: Signer, registryContracts: RegistryContracts) {
    this.signer = signer;
    this.registryContracts = registryContracts.connect(signer);
  }

  signer: Signer;
  private registryContracts: RegistryContracts;

  async updateOwnership(domain: EnsDomain) {
    const tx = await this.registryContracts.packageOwnershipManagerL1.updateOwnership(
      EnsDomain.RegistryBytes32,
      domain.node
    );

    await tx.wait(+process.env.NUM_OF_CONFIRMATIONS_TO_WAIT!);
  }

  async relayOwnership(domain: EnsDomain, chainName: BlockchainsWithRegistry) {
    const tx = await this.registryContracts.packageOwnershipManagerL1.relayOwnership(
      formatBytes32String(chainName),
      EnsDomain.RegistryBytes32,
      domain.node
    );

    await tx.wait(+process.env.NUM_OF_CONFIRMATIONS_TO_WAIT!);
  }

  async proposeVersion(
    domain: EnsDomain,
    major: number,
    minor: number,
    patch: number,
    packageLocation: string
  ) {
    const proposeTx = await this.registryContracts.registrar.proposeVersion(
      domain.packageId,
      major,
      minor,
      patch,
      packageLocation
    );

    await proposeTx.wait(+process.env.NUM_OF_CONFIRMATIONS_TO_WAIT!);
  }

  async getVerificationRoot(): Promise<BytesLike> {
    return await this.registryContracts.versionVerificationManagerL2.verificationRoot();
  }

  async getLeafCountForRoot(verificationRoot: BytesLike): Promise<number> {
    const rootCalculatedEvents = await this.registryContracts.verificationTreeManager.queryFilter(
      this.registryContracts.verificationTreeManager.filters.VerificationRootCalculated(
        verificationRoot
      ),
      0,
      "latest"
    );

    return rootCalculatedEvents[0].args.verifiedVersionCount.toNumber();
  }

  async publishVersion(
    domain: EnsDomain,
    packageLocation: string,
    major: number,
    minor: number,
    patch: number
  ) {
    const verificationRoot = await this.getVerificationRoot();
    const leafCountForRoot = await this.getLeafCountForRoot(verificationRoot);

    const verifiedVersionEvents = await this.registryContracts.verificationTreeManager.queryFilter(
      this.registryContracts.verificationTreeManager.filters.VersionVerified(),
      0,
      "latest"
    );

    const leaves: string[] = [];
    let currentVerifiedVersionIndex: BigNumber;
    const currentPatchNodeId = this.calculatePatchNodeId(
      domain,
      major,
      minor,
      patch
    );

    for (const event of verifiedVersionEvents) {
      const {
        patchNodeId,
        packageLocationHash,
        verifiedVersionIndex,
      } = event.args;
      const verifiedVersionId = solidityKeccak256(
        ["bytes32", "bytes32"],
        [patchNodeId, packageLocationHash]
      );

      leaves.push(verifiedVersionId);

      if (patchNodeId === currentPatchNodeId) {
        currentVerifiedVersionIndex = verifiedVersionIndex;
      }

      if (leaves.length === leafCountForRoot) {
        break;
      }
    }

    const [proof, sides] = computeMerkleProof(
      leaves,
      currentVerifiedVersionIndex!.toNumber()
    );
    const publishTx = await this.registryContracts.versionVerificationManagerL2.publishVersion(
      domain.packageId,
      currentPatchNodeId,
      major,
      minor,
      patch,
      packageLocation,
      proof,
      sides
    );

    const receipt = await publishTx.wait(
      +process.env.NUM_OF_CONFIRMATIONS_TO_WAIT!
    );
  }

  async getPackageLocation(nodeId: BytesLike): Promise<string> {
    return await this.registryContracts.registryL2.getPackageLocation(nodeId);
  }

  async resolveToPackageLocation(
    domain: EnsDomain,
    major: number,
    minor: number,
    patch: number
  ): Promise<string> {
    const patchNodeId = this.calculatePatchNodeId(domain, major, minor, patch);
    return await this.registryContracts.registryL2.getPackageLocation(patchNodeId);
  }

  async getNodeInfo(
    nodeId: BytesLike
  ): Promise<{
    leaf: boolean;
    latestSubVersion: BigNumber;
    created: boolean;
    location: string;
  }> {
    return await this.registryContracts.registryL2.versionNodes(nodeId);
  }

  async getVersionNodeInfo(
    domain: EnsDomain,
    major: number,
    minor: number,
    patch: number
  ): Promise<{
    leaf: boolean;
    latestSubVersion: BigNumber;
    created: boolean;
    location: string;
  }> {
    const patchNodeId = this.calculatePatchNodeId(domain, major, minor, patch);
    return await this.getNodeInfo(patchNodeId);
  }

  async waitForVotingEnd(
    domain: EnsDomain,
    major: number,
    minor: number,
    patch: number,
    packageLocation: string
  ): Promise<{
    patchNodeId: BytesLike;
    verified: boolean;
    packageLocationHash: string;
  }> {
    const patchNodeId = this.calculatePatchNodeId(domain, major, minor, patch);
    const packageLocationHash = solidityKeccak256(
      ["string"],
      [packageLocation]
    );

    return new Promise((resolve, reject) => {
      const listener = (
        decidedPatchNodeId: BytesLike,
        verified: boolean,
        decidedPackageLocationHash: BytesLike
      ) => {
        if (
          decidedPatchNodeId !== patchNodeId ||
          decidedPackageLocationHash != packageLocationHash
        ) {
          return;
        }

        this.registryContracts.votingMachine.off("VersionDecided", listener);

        resolve({
          patchNodeId,
          verified,
          packageLocationHash,
        });
      };

      this.registryContracts.votingMachine.on("VersionDecided", listener);
    });
  }

  calculatePatchNodeId(
    domain: EnsDomain,
    major: number,
    minor: number,
    patch: number
  ): BytesLike {
    const majorNodeId = solidityKeccak256(
      ["bytes32", "uint256"],
      [domain.packageId, major]
    );
    const minorNodeId = solidityKeccak256(
      ["bytes32", "uint256"],
      [majorNodeId, minor]
    );
    const patchNodeId = solidityKeccak256(
      ["bytes32", "uint256"],
      [minorNodeId, patch]
    );

    return patchNodeId;
  }
}
