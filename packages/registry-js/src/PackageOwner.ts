import { BigNumber, ContractReceipt, Signer } from "ethers";
import {
  BytesLike,
  formatBytes32String,
  solidityKeccak256,
} from "ethers/lib/utils";
import { computeMerkleProof } from "@polywrap/registry-core-js";
import { EnsDomain } from "@polywrap/registry-core-js";
import { RegistryContracts } from "./RegistryContracts";
import { Logger } from "winston";
import { ProposedVersion } from "./helpers/ProposedVersion";
import { ErrorHandler } from "./errorHandler";
import { LogLevel } from "./logger";
import { ContractCallResult } from "./helpers/contractResultTypes";
import { ProposedVersionVotingInfo } from "./helpers/ProposedVersionVotingInfo";
import { VersionNodeInfo } from "./helpers/VersionNodeInfo";
import { LatestVersionInfo } from "./helpers/LatestVersionInfo";
import { NodeInfo } from "./helpers/NodeInfo";

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
  async getPolywrapOwner(
    domain: EnsDomain
  ): Promise<ContractCallResult<string>> {
    const result = await this.registryContracts.packageOwnershipManagerL1.getPolywrapOwner(
      domain.registryBytes32,
      domain.node
    );
    return {
      data: result,
      error: null,
    };
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async getDomainPolywrapOwner(
    domain: EnsDomain
  ): Promise<ContractCallResult<string>> {
    const result = await this.registryContracts.ensLinkL1.getPolywrapOwner(
      domain.node
    );
    return {
      data: result,
      error: null,
    };
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async updateOwnership(
    domain: EnsDomain
  ): Promise<ContractCallResult<ContractReceipt>> {
    const tx = await this.registryContracts.packageOwnershipManagerL1.updateOwnership(
      EnsDomain.RegistryBytes32,
      domain.node
    );
    const receipt = await tx.wait();
    return {
      data: receipt,
      error: null,
    };
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async relayOwnership(
    domain: EnsDomain,
    chainName: BlockchainsWithRegistry
  ): Promise<ContractCallResult<ContractReceipt>> {
    const tx = await this.registryContracts.packageOwnershipManagerL1.relayOwnership(
      formatBytes32String(chainName),
      EnsDomain.RegistryBytes32,
      domain.node
    );
    const receipt = await tx.wait();
    return {
      data: receipt,
      error: null,
    };
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async proposeVersion(
    domain: EnsDomain,
    major: number,
    minor: number,
    patch: number,
    packageLocation: string
  ): Promise<ContractCallResult<ContractReceipt>> {
    const proposeTx = await this.registryContracts.registrar.proposeVersion(
      domain.packageId,
      major,
      minor,
      patch,
      packageLocation
    );
    const receipt = await proposeTx.wait();
    return {
      data: receipt,
      error: null,
    };
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async getVerificationRoot(): Promise<ContractCallResult<BytesLike>> {
    const result = await this.registryContracts.versionVerificationManagerL2.verificationRoot();
    return {
      data: result,
      error: null,
    };
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async getLeafCountForRoot(
    verificationRoot: BytesLike
  ): Promise<ContractCallResult<number>> {
    const rootCalculatedEvents = await this.registryContracts.verificationTreeManager.queryFilter(
      this.registryContracts.verificationTreeManager.filters.VerificationRootCalculated(
        verificationRoot
      ),
      0,
      "latest"
    );
    const result = rootCalculatedEvents[0].args.verifiedVersionCount.toNumber();
    return {
      data: result,
      error: null,
    };
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async publishVersion(
    domain: EnsDomain,
    packageLocation: string,
    major: number,
    minor: number,
    patch: number
  ): Promise<ContractCallResult<ContractReceipt>> {
    const verificationRootResult = await this.getVerificationRoot();
    if (verificationRootResult.error) {
      return {
        data: null,
        error: verificationRootResult.error,
      };
    }
    const verificationRoot = verificationRootResult.data as BytesLike;

    const leafCountForRootResult = await this.getLeafCountForRoot(
      verificationRoot
    );
    if (leafCountForRootResult.error) {
      return {
        data: null,
        error: leafCountForRootResult.error,
      };
    }
    const leafCountForRoot = leafCountForRootResult.data as number;

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

    const receipt = await publishTx.wait();
    return {
      data: receipt,
      error: null,
    };
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async getPackageLocation(
    nodeId: BytesLike
  ): Promise<ContractCallResult<string>> {
    const result = await this.registryContracts.registryL2.getPackageLocation(
      nodeId
    );
    return {
      data: result,
      error: null,
    };
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async resolveToPackageLocation(
    domain: EnsDomain,
    major: number,
    minor: number,
    patch: number
  ): Promise<ContractCallResult<string>> {
    const patchNodeId = this.calculatePatchNodeId(domain, major, minor, patch);
    const result = await this.registryContracts.registryL2.getPackageLocation(
      patchNodeId
    );
    return {
      data: result,
      error: null,
    };
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async getNodeInfo(nodeId: BytesLike): Promise<ContractCallResult<NodeInfo>> {
    const result = await this.registryContracts.registryL2.versionNodes(nodeId);
    return {
      data: result,
      error: null,
    };
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async getLatestVersionInfo(
    packageId: string
  ): Promise<ContractCallResult<LatestVersionInfo>> {
    const result = await this.registryContracts.registryL1.getLatestVersionInfo(
      packageId
    );
    return {
      data: result,
      error: null,
    };
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async getVersionNodeInfo(
    domain: EnsDomain,
    major: number,
    minor: number,
    patch: number
  ): Promise<ContractCallResult<VersionNodeInfo>> {
    const patchNodeId = this.calculatePatchNodeId(domain, major, minor, patch);
    const { data, error } = await this.getNodeInfo(patchNodeId);
    if (error) return { data: null, error: error };
    return {
      data: data,
      error: null,
    };
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async getProposedVersion(
    patchNodeId: BytesLike
  ): Promise<ContractCallResult<ProposedVersion>> {
    const resp = await this.registryContracts.votingMachine.proposedVersions(
      patchNodeId
    );
    return {
      data: resp as ProposedVersion,
      error: null,
    };
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async getAuthorizedVerifierCount(): Promise<ContractCallResult<number>> {
    const resp = await this.registryContracts.votingMachine.authorizedVerifierCount();
    return {
      data: resp.toNumber(),
      error: null,
    };
  }

  @PackageOwner.errorHandler(LogLevel.warn)
  async getProposedVersionVotingInfo(
    patchNodeId: BytesLike
  ): Promise<ContractCallResult<ProposedVersionVotingInfo>> {
    const resp = await this.registryContracts.votingMachine.getProposedVersionVotingInfo(
      patchNodeId
    );

    return {
      data: (resp as unknown) as ProposedVersionVotingInfo,
      error: null,
    };
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
