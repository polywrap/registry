import { BigNumber, ethers, Wallet } from "ethers";
import {
  BytesLike,
  formatBytes32String,
  hexZeroPad,
  solidityKeccak256,
} from "ethers/lib/utils";
import { computeMerkleProof } from "./merkle-tree/computeMerkleProof";
import { EnsDomain } from "./ens";
import {
  PackageOwnershipManager,
  PolywrapRegistrar,
  VerificationTreeManager,
  VersionVerificationManager,
  VotingMachine,
} from "registry/typechain";

export type BlockchainsWithRegistry = "l2-chain-name" | "ethereum" | "xdai";

interface PackageOwnerDependencies {
  packageOwnerSigner: Wallet;
  versionVerificationManagerL2: VersionVerificationManager;
  packageOwnershipManagerL1: PackageOwnershipManager;
  registrar: PolywrapRegistrar;
  verificationTreeManager: VerificationTreeManager;
  votingMachine: VotingMachine;
}

export class PackageOwner {
  constructor(deps: PackageOwnerDependencies) {
    this.signer = deps.packageOwnerSigner;
    this.versionVerificationManagerL2 = deps.versionVerificationManagerL2;
    this.packageOwnershipManagerL1 = deps.packageOwnershipManagerL1;
    this.registrar = deps.registrar;
    this.verificationTreeManager = deps.verificationTreeManager;
    this.votingMachine = deps.votingMachine;
  }

  public signer: ethers.Wallet;
  private versionVerificationManagerL2: VersionVerificationManager;
  private packageOwnershipManagerL1: PackageOwnershipManager;
  private registrar: PolywrapRegistrar;
  private verificationTreeManager: VerificationTreeManager;
  private votingMachine: VotingMachine;

  async updateOwnership(domain: EnsDomain) {
    const tx = await this.packageOwnershipManagerL1.updateOwnership(
      EnsDomain.RegistryBytes32,
      domain.node
    );

    await tx.wait(+process.env.NUM_OF_CONFIRMATIONS_TO_WAIT!);
  }

  async relayOwnership(domain: EnsDomain, chainName: BlockchainsWithRegistry) {
    const tx = await this.packageOwnershipManagerL1.relayOwnership(
      formatBytes32String(chainName),
      EnsDomain.RegistryBytes32,
      domain.node
    );

    await tx.wait(+process.env.NUM_OF_CONFIRMATIONS_TO_WAIT!);
  }

  async proposeVersion(
    domain: EnsDomain,
    packageLocation: string,
    major: number,
    minor: number,
    patch: number
  ) {
    const proposeTx = await this.registrar.proposeVersion(
      domain.packageId,
      major,
      minor,
      patch,
      packageLocation
    );

    await proposeTx.wait(+process.env.NUM_OF_CONFIRMATIONS_TO_WAIT!);
  }

  async getVerificationRoot(): Promise<BytesLike> {
    return await this.versionVerificationManagerL2.verificationRoot();
  }

  async getLeafCountForRoot(verificationRoot: BytesLike): Promise<number> {
    const topicId = ethers.utils.id(
      "VerificationRootCalculated(bytes32,uint256)"
    );
    const rootCalculatedEvents = await this.verificationTreeManager.queryFilter(
      {
        topics: [topicId, hexZeroPad(verificationRoot, 32)],
      },
      0,
      "latest"
    );

    //@ts-ignore
    return rootCalculatedEvents[0].args.verifiedVersionCount;
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

    const verifiedVersionEvents =
      await this.verificationTreeManager.queryFilter(
        this.verificationTreeManager.filters.VersionVerified(),
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
      //@ts-ignore
      const { patchNodeId, packageLocationHash, verifiedVersionIndex } =
        event.args;
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
    const publishTx = await this.versionVerificationManagerL2.publishVersion(
      domain.packageId,
      currentPatchNodeId,
      major,
      minor,
      patch,
      packageLocation,
      proof,
      sides
    );

    await publishTx.wait(+process.env.NUM_OF_CONFIRMATIONS_TO_WAIT!);
  }

  async waitForVotingEnd(
    domain: EnsDomain,
    packageLocation: string,
    major: number,
    minor: number,
    patch: number
  ) {
    const patchNodeId = this.calculatePatchNodeId(domain, major, minor, patch);
    const packageLocationHash = solidityKeccak256(
      ["string"],
      [packageLocation]
    );

    return new Promise(async (resolve, reject) => {
      await this.votingMachine.on(
        "VersionDecided",
        (
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

          resolve({
            patchNodeId,
            verified,
            packageLocationHash,
          });
        }
      );
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
