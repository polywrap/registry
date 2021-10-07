import { BigNumber, ContractReceipt, Signer } from "ethers";
import {
  BytesLike,
  formatBytes32String,
  solidityKeccak256,
} from "ethers/lib/utils";
import { computeMerkleProof } from "@polywrap/registry-core-js";
import { EnsDomain } from "@polywrap/registry-core-js";
import { RegistryContracts } from "./RegistryContracts";
import {
  LatestVersionInfo,
  NodeInfo,
  ProposedVersion,
  ProposedVersionVotingInfo,
} from "./types";

export type BlockchainsWithRegistry = "l2-chain-name" | "ethereum" | "xdai";

export const PolywrapOwnerReverts = [
  "Domain registry is not supported",
] as const;
export type PolywrapOwnerRevert = typeof PolywrapOwnerReverts[number];

export const DomainPolywrapOwnerReverts = ["Resolver not set"] as const;
export type DomainPolywrapOwnerRevert = typeof DomainPolywrapOwnerReverts[number];

export const UpdateOwnershipReverts = [
  ...PolywrapOwnerReverts,
  "Domain registry is not allowed for local updates",
] as const;
export type UpdateOwnershipRevert = typeof UpdateOwnershipReverts[number];

export const RelayOwnershipReverts = [
  ...PolywrapOwnerReverts,
  "Outgoing relay not supported for domain registry and blockchain",
] as const;
export type RelayOwnershipRevert = typeof RelayOwnershipReverts[number];

export const ProposeVersionReverts = ["Version is already proposed"] as const;
export type ProposeVersionRevert = typeof ProposeVersionReverts[number];

export const PublishVersionReverts = [
  "Invalid proof",
  "Supplied patchNodeId does not match the calculated patchNodeId",
] as const;
export type PublishVersionRevert = typeof PublishVersionReverts[number];

export const PackageLocationReverts = ["Invalid Node"] as const;
export type PackageLocationRevert = typeof PackageLocationReverts[number];

export class PackageOwner {
  constructor(signer: Signer, registryContracts: RegistryContracts) {
    this.signer = signer;
    this.registryContracts = registryContracts.connect(signer);
  }

  signer: Signer;
  private registryContracts: RegistryContracts;

  async getPolywrapOwner(domain: EnsDomain): Promise<string> {
    return await this.registryContracts.packageOwnershipManagerL1.getPolywrapOwner(
      domain.registryBytes32,
      domain.node
    );
  }

  async getDomainPolywrapOwner(domain: EnsDomain): Promise<string> {
    return await this.registryContracts.ensLinkL1.getPolywrapOwner(domain.node);
  }

  async updateOwnership(domain: EnsDomain): Promise<ContractReceipt> {
    const tx = await this.registryContracts.packageOwnershipManagerL1.updateOwnership(
      EnsDomain.RegistryBytes32,
      domain.node
    );
    return await tx.wait();
  }

  async relayOwnership(
    domain: EnsDomain,
    chainName: BlockchainsWithRegistry
  ): Promise<ContractReceipt> {
    const tx = await this.registryContracts.packageOwnershipManagerL1.relayOwnership(
      formatBytes32String(chainName),
      EnsDomain.RegistryBytes32,
      domain.node
    );
    return await tx.wait();
  }

  async proposeVersion(
    domain: EnsDomain,
    major: number,
    minor: number,
    patch: number,
    packageLocation: string
  ): Promise<ContractReceipt> {
    const proposeTx = await this.registryContracts.registrar.proposeVersion(
      domain.packageId,
      major,
      minor,
      patch,
      packageLocation
    );
    return await proposeTx.wait();
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
  ): Promise<ContractReceipt> {
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

    return await publishTx.wait();
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
    return await this.registryContracts.registryL2.getPackageLocation(
      patchNodeId
    );
  }

  async getNodeInfo(nodeId: BytesLike): Promise<NodeInfo> {
    return await this.registryContracts.registryL2.versionNodes(nodeId);
  }

  async getLatestVersionInfo(packageId: string): Promise<LatestVersionInfo> {
    return await this.registryContracts.registryL1.getLatestVersionInfo(
      packageId
    );
  }

  async getVersionNodeInfo(
    domain: EnsDomain,
    major: number,
    minor: number,
    patch: number
  ): Promise<NodeInfo> {
    const patchNodeId = this.calculatePatchNodeId(domain, major, minor, patch);
    const nodeInfo = await this.getNodeInfo(patchNodeId);
    return nodeInfo;
  }

  async getProposedVersion(patchNodeId: BytesLike): Promise<ProposedVersion> {
    return await this.registryContracts.votingMachine.proposedVersions(
      patchNodeId
    );
  }

  async getAuthorizedVerifierCount(): Promise<number> {
    const result = await this.registryContracts.votingMachine.authorizedVerifierCount();
    return result.toNumber();
  }

  async getProposedVersionVotingInfo(
    patchNodeId: BytesLike
  ): Promise<ProposedVersionVotingInfo> {
    const result = await this.registryContracts.votingMachine.getProposedVersionVotingInfo(
      patchNodeId
    );
    return (result as unknown) as ProposedVersionVotingInfo;
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
