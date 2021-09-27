import { BigNumber, Signer } from "ethers";
import {
  BytesLike,
  formatBytes32String,
  solidityKeccak256,
} from "ethers/lib/utils";
import { computeMerkleProof } from "@polywrap/registry-core-js";
import { EnsDomain } from "@polywrap/registry-core-js";
import { RegistryContracts } from "./RegistryContracts";
import { Logger } from "winston";
import { ErrorHandler, LogLevel } from "./errorHandler";
import { ProposedVersion } from "./ProposedVersion";

export type BlockchainsWithRegistry = "l2-chain-name" | "ethereum" | "xdai";

export class PackageOwner extends ErrorHandler {
  constructor(
    signer: Signer,
    registryContracts: RegistryContracts,
    logger: Logger
  ) {
    super();
    this.signer = signer;
    this.registryContracts = registryContracts.connect(signer);
    this.logger = logger;
  }

  logger: Logger;
  signer: Signer;
  private registryContracts: RegistryContracts;

  @PackageOwner.errorHandler(LogLevel.warn)
  async getPolywrapOwner(domain: EnsDomain): Promise<string> {
    return await this.registryContracts.packageOwnershipManagerL1.getPolywrapOwner(
      domain.registryBytes32,
      domain.node
    );
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async getDomainPolywrapOwner(domain: EnsDomain): Promise<string> {
    return await this.registryContracts.ensLinkL1.getPolywrapOwner(domain.node);
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async updateOwnership(domain: EnsDomain): Promise<void> {
    const tx = await this.registryContracts.packageOwnershipManagerL1.updateOwnership(
      EnsDomain.RegistryBytes32,
      domain.node
    );

    await tx.wait();
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async relayOwnership(
    domain: EnsDomain,
    chainName: BlockchainsWithRegistry
  ): Promise<void> {
    const tx = await this.registryContracts.packageOwnershipManagerL1.relayOwnership(
      formatBytes32String(chainName),
      EnsDomain.RegistryBytes32,
      domain.node
    );

    await tx.wait();
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async proposeVersion(
    domain: EnsDomain,
    major: number,
    minor: number,
    patch: number,
    packageLocation: string
  ): Promise<void> {
    const proposeTx = await this.registryContracts.registrar.proposeVersion(
      domain.packageId,
      major,
      minor,
      patch,
      packageLocation
    );

    await proposeTx.wait();
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async getVerificationRoot(): Promise<BytesLike> {
    return await this.registryContracts.versionVerificationManagerL2.verificationRoot();
  }

  @PackageOwner.errorHandler(LogLevel.warn)
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

  @PackageOwner.errorHandler(LogLevel.warn)
  async publishVersion(
    domain: EnsDomain,
    packageLocation: string,
    major: number,
    minor: number,
    patch: number
  ): Promise<void> {
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

    await publishTx.wait();
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async getPackageLocation(nodeId: BytesLike): Promise<string> {
    return await this.registryContracts.registryL2.getPackageLocation(nodeId);
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async resolveToPackageLocation(
    domain: EnsDomain,
    major: number,
    minor: number,
    patch: number
  ): Promise<string> {
    const patchNodeId = this.calculatePatchNodeId(domain, major, minor, patch);
    return await this.registryContracts.registryL2.getPackageLocation(
      patchNodeId
    );
  }

  @PackageOwner.errorHandler(LogLevel.warn)
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

  @PackageOwner.errorHandler(LogLevel.warn)
  async getLatestVersionInfo(
    packageId: string
  ): Promise<{
    majorVersion: BigNumber;
    minorVersion: BigNumber;
    patchVersion: BigNumber;
    location: string;
  }> {
    return await this.registryContracts.registryL1.getLatestVersionInfo(
      packageId
    );
  }

  @PackageOwner.errorHandler(LogLevel.warn)
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

  @PackageOwner.errorHandler(LogLevel.warn)
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

  async getProposedVersion(patchNodeId: BytesLike): Promise<ProposedVersion> {
    const resp = await this.registryContracts.votingMachine.proposedVersions(
      patchNodeId
    );
    return resp as ProposedVersion;
  }

  async getAuthorizedVerifierCount(): Promise<number> {
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
