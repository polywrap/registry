import { BigNumber, Signer } from "ethers";
import {
  BytesLike,
  formatBytes32String,
  solidityKeccak256,
} from "ethers/lib/utils";
import { computeMerkleProof } from "@polywrap/registry-core-js";
import { EnsDomain } from "@polywrap/registry-core-js";
import { RegistryContracts } from "./RegistryContracts";
import { ProposedVersion } from "./ProposedVersion";

export type BlockchainsWithRegistry =
  | "l2-chain-name"
  | "ethereum"
  | "xdai"
  | "rinkeby";

export class PackageOwner {
  constructor(signer: Signer, registryContracts: RegistryContracts) {
    this.signer = signer;
    this.registryContracts = registryContracts.connect(signer);
  }

  signer: Signer;
  private registryContracts: RegistryContracts;

  async getPolywrapOwner(domain: EnsDomain): Promise<string> {
    return await this.registryContracts.registry.getPackageOwner(
      domain.packageId
    );
  }

  async getDomainPolywrapOwner(domain: EnsDomain): Promise<string | undefined> {
    return await this.registryContracts.ensLink?.getPolywrapOwner(domain.node);
  }

  async updateOwnership(domain: EnsDomain): Promise<void> {
    const tx = await this.registryContracts.packageOwnershipManager.updateOwnership(
      EnsDomain.RegistryBytes32,
      domain.node
    );

    await tx.wait();
  }

  async relayOwnership(
    domain: EnsDomain,
    chainName: BlockchainsWithRegistry
  ): Promise<void> {
    const tx = await this.registryContracts.packageOwnershipManager.relayOwnership(
      formatBytes32String(chainName),
      EnsDomain.RegistryBytes32,
      domain.node
    );

    await tx.wait();
  }

  async proposeVersion(
    domain: EnsDomain,
    major: number,
    minor: number,
    patch: number,
    packageLocation: string
  ): Promise<void> {
    if (!this.registryContracts.registrar) {
      throw "There is no Registrar contract on this chain";
    }

    const proposeTx = await this.registryContracts.registrar.proposeVersion(
      domain.packageId,
      major,
      minor,
      patch,
      packageLocation
    );

    await proposeTx.wait();
  }

  async getVerificationRoot(): Promise<BytesLike> {
    return await this.registryContracts.versionVerificationManager.verificationRoot();
  }

  async getLeafCountForRoot(verificationRoot: BytesLike): Promise<number> {
    if (!this.registryContracts.verificationTreeManager) {
      throw "There is no VerificationTreeManager contract on this chain";
    }

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
  ): Promise<void> {
    if (!this.registryContracts.verificationTreeManager) {
      throw "There is no VerificationTreeManager contract on this chain";
    }

    const verificationRoot = await this.getVerificationRoot();
    const leafCountForRoot = await this.getLeafCountForRoot(verificationRoot);

    const verifiedVersionEvents = await this.registryContracts.verificationTreeManager.queryFilter(
      this.registryContracts.verificationTreeManager.filters.VersionVerified(),
      0,
      "latest"
    );

    const leaves: string[] = [];
    let currentVerifiedVersionIndex: BigNumber | undefined;
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

    if (currentVerifiedVersionIndex === undefined) {
      throw "currentVerifiedVersionIndex is undefined";
    }

    const [proof, sides] = computeMerkleProof(
      leaves,
      currentVerifiedVersionIndex.toNumber()
    );
    const publishTx = await this.registryContracts.versionVerificationManager.publishVersion(
      domain.packageId,
      currentPatchNodeId,
      major,
      minor,
      patch,
      packageLocation,
      proof,
      sides
    );

    await publishTx.wait();
  }

  async getPackageLocation(nodeId: BytesLike): Promise<string> {
    return await this.registryContracts.registry.getPackageLocation(nodeId);
  }

  async resolveToPackageLocation(
    domain: EnsDomain,
    major: number,
    minor: number,
    patch: number
  ): Promise<string> {
    const patchNodeId = this.calculatePatchNodeId(domain, major, minor, patch);
    return await this.registryContracts.registry.getPackageLocation(
      patchNodeId
    );
  }

  async getNodeInfo(
    nodeId: BytesLike
  ): Promise<{
    leaf: boolean;
    latestSubVersion: BigNumber;
    created: boolean;
    location: string;
  }> {
    return await this.registryContracts.registry.versionNodes(nodeId);
  }

  async getLatestVersionInfo(
    packageId: string
  ): Promise<{
    majorVersion: BigNumber;
    minorVersion: BigNumber;
    patchVersion: BigNumber;
    location: string;
  }> {
    return await this.registryContracts.registry.getLatestVersionInfo(
      packageId
    );
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

    return new Promise((resolve) => {
      if (!this.registryContracts.votingMachine) {
        throw "There is no VotingMachine contract on this chain";
      }

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
        if (!this.registryContracts.votingMachine) {
          throw "There is no VotingMachine contract on this chain";
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

  async _waitForVotingEnd(
    patchNodeId: BytesLike,
    packageLocation: string
  ): Promise<{
    patchNodeId: BytesLike;
    verified: boolean;
    packageLocationHash: string;
  }> {
    const packageLocationHash = solidityKeccak256(
      ["string"],
      [packageLocation]
    );

    return new Promise((resolve) => {
      if (!this.registryContracts.votingMachine) {
        throw "There is no VotingMachine contract on this chain";
      }

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

        if (!this.registryContracts.votingMachine) {
          throw "There is no VotingMachine contract on this chain";
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

  async getProposedVersion(patchNodeId: BytesLike): Promise<ProposedVersion> {
    if (!this.registryContracts.votingMachine) {
      throw "There is no VotingMachine contract on this chain";
    }

    const resp = await this.registryContracts.votingMachine.proposedVersions(
      patchNodeId
    );
    return resp as ProposedVersion;
  }

  async getAuthorizedVerifierCount(): Promise<number> {
    if (!this.registryContracts.votingMachine) {
      throw "There is no VotingMachine contract on this chain";
    }

    const resp = await this.registryContracts.votingMachine.authorizedVerifierCount();
    return resp.toNumber();
  }

  async getProposedVersionVotingInfo(
    patchNodeId: BytesLike
  ): Promise<{
    verifierCount: BigNumber;
    approvingVerifierCount: BigNumber;
    rejectingVerifierCount: BigNumber;
  }> {
    if (!this.registryContracts.votingMachine) {
      throw "There is no VotingMachine contract on this chain";
    }

    const resp = await this.registryContracts.votingMachine.getProposedVersionVotingInfo(
      patchNodeId
    );

    return resp;
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
