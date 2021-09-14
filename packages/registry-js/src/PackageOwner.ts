import { BigNumber, ethers, Wallet } from "ethers";
import { BytesLike, formatBytes32String, hexZeroPad, solidityKeccak256 } from "ethers/lib/utils";
import { EnsDomain } from "./ens/EnsDomain";
import * as VotingMachine from "./deployments/localhost/VotingMachine.json"
import { computeMerkleProof } from "./merkle-tree/computeMerkleProof";
import { VotingMachine as VotingMachineContract, PackageOwnershipManager, PolywrapRegistrar, Registrar__factory, VerificationTreeManager, VerificationTreeManager__factory, VersionVerificationManager, VotingMachine__factory, Registry, PolywrapRegistry } from "./typechain";

export type BlockchainsWithRegistry = "l2-chain-name" | "ethereum" | "xdai";

interface PackageOwnerDependencies {
  packageOwnerSigner: Wallet;
  versionVerificationManagerL2: VersionVerificationManager;
  packageOwnershipManagerL1: PackageOwnershipManager;
  registrar: PolywrapRegistrar;
  verificationTreeManager: VerificationTreeManager;
  votingMachine: VotingMachineContract;
  registryL2: PolywrapRegistry;
}

export class PackageOwner {
  constructor(deps: PackageOwnerDependencies) {
    this.signer = deps.packageOwnerSigner;
    this.versionVerificationManagerL2 = deps.versionVerificationManagerL2;
    this.packageOwnershipManagerL1 = deps.packageOwnershipManagerL1;
    this.registrar = deps.registrar;
    this.verificationTreeManager = deps.verificationTreeManager;
    this.votingMachine = deps.votingMachine;
    this.registryL2 = deps.registryL2;
  }

  public signer: ethers.Wallet;
  private versionVerificationManagerL2: VersionVerificationManager;
  private packageOwnershipManagerL1: PackageOwnershipManager;
  private registrar: PolywrapRegistrar;
  private verificationTreeManager: VerificationTreeManager;
  private votingMachine: VotingMachineContract;
  private registryL2: PolywrapRegistry;

  async updateOwnership(domain: EnsDomain) {

    const tx = await this.packageOwnershipManagerL1.updateOwnership(EnsDomain.RegistryBytes32, domain.node);

    await tx.wait(+process.env.NUM_OF_CONFIRMATIONS_TO_WAIT!);
  }

  async relayOwnership(domain: EnsDomain, chainName: BlockchainsWithRegistry) {
    const tx = await this.packageOwnershipManagerL1.relayOwnership(formatBytes32String(chainName), EnsDomain.RegistryBytes32, domain.node);

    await tx.wait(+process.env.NUM_OF_CONFIRMATIONS_TO_WAIT!);
  }

  async proposeVersion(domain: EnsDomain, major: number, minor: number, patch: number, packageLocation: string) {
    const proposeTx = await this.registrar.proposeVersion(
      domain.packageId,
      major, minor, patch,
      packageLocation
    );

    await proposeTx.wait(+process.env.NUM_OF_CONFIRMATIONS_TO_WAIT!);

    const majorNodeId = solidityKeccak256(["bytes32", "uint256"], [domain.packageId, major]);
    const minorNodeId = solidityKeccak256(["bytes32", "uint256"], [majorNodeId, minor]);
    const patchNodeId = solidityKeccak256(["bytes32", "uint256"], [minorNodeId, patch]);

    const packageLocationHash = solidityKeccak256(["string"], [packageLocation]);


    console.log('patchNodeId', patchNodeId);
    console.log('packageLocationHash', packageLocationHash);
  }

  async getVerificationRoot(): Promise<BytesLike> {
    return await this.versionVerificationManagerL2.verificationRoot();
  }

  async getLeafCountForRoot(verificationRoot: BytesLike): Promise<number> {
    const filter = this.verificationTreeManager.filters.VerificationRootCalculated();

    const rootCalculatedEvents = await this.verificationTreeManager.queryFilter(
      filter,
      0,
      'latest'
    );

    //@ts-ignore
    return rootCalculatedEvents[0].args.verifiedVersionCount.toNumber();
  }

  async publishVersion(domain: EnsDomain, packageLocation: string, major: number, minor: number, patch: number) {
    const verificationRoot = await this.getVerificationRoot();
    const leafCountForRoot = await this.getLeafCountForRoot(verificationRoot);

    const verifiedVersionEvents = await this.verificationTreeManager.queryFilter(
      this.verificationTreeManager.filters.VersionVerified(),
      0,
      'latest'
    );

    const leaves: string[] = [];
    let currentVerifiedVersionIndex: BigNumber;
    const currentPatchNodeId = this.calculatePatchNodeId(domain, major, minor, patch);

    for (const event of verifiedVersionEvents) {
      //@ts-ignore
      const { patchNodeId, packageLocationHash, verifiedVersionIndex } = event.args;
      const verifiedVersionId = solidityKeccak256(["bytes32", "bytes32"], [patchNodeId, packageLocationHash]);

      leaves.push(verifiedVersionId);

      if (patchNodeId === currentPatchNodeId) {
        currentVerifiedVersionIndex = verifiedVersionIndex;
      }

      if (leaves.length === leafCountForRoot) {
        break;
      }
    }

    const [proof, sides] = computeMerkleProof(leaves, currentVerifiedVersionIndex!.toNumber());
    const publishTx = await this.versionVerificationManagerL2.publishVersion(
      domain.packageId,
      currentPatchNodeId,
      major, minor, patch,
      packageLocation,
      proof,
      sides,
    );

    const receipt = await publishTx.wait(+process.env.NUM_OF_CONFIRMATIONS_TO_WAIT!);
  }

  async getPackageLocation(nodeId: BytesLike): Promise<string> {
    return await this.registryL2.getPackageLocation(nodeId);
  }

  async resolveToPackageLocation(domain: EnsDomain,
    major: number,
    minor: number,
    patch: number
  ): Promise<string> {
    const patchNodeId = this.calculatePatchNodeId(domain, major, minor, patch);
    return await this.registryL2.getPackageLocation(patchNodeId);
  }

  async getNodeInfo(nodeId: BytesLike): Promise<{
    leaf: boolean;
    latestSubVersion: BigNumber;
    created: boolean;
    location: string;
  }> {
    return await this.registryL2.versionNodes(nodeId);
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
    patchNodeId: BytesLike,
    verified: boolean,
    packageLocationHash: string
  }> {
    let votingMachine = VotingMachine__factory.connect(VotingMachine.address, this.signer);

    const patchNodeId = this.calculatePatchNodeId(domain, major, minor, patch);
    const packageLocationHash = solidityKeccak256(["string"], [packageLocation]);

    return new Promise((resolve, reject) => {
      const listener = (
        decidedPatchNodeId: BytesLike,
        verified: boolean,
        decidedPackageLocationHash: BytesLike
      ) => {
        if (decidedPatchNodeId !== patchNodeId || decidedPackageLocationHash != packageLocationHash) {
          return;
        }

        votingMachine.off('VersionDecided', listener);

        resolve({
          patchNodeId,
          verified,
          packageLocationHash
        });
      };

      votingMachine.on('VersionDecided', listener);
    });
  }

  calculatePatchNodeId(domain: EnsDomain, major: number, minor: number, patch: number): BytesLike {
    const majorNodeId = solidityKeccak256(["bytes32", "uint256"], [domain.packageId, major]);
    const minorNodeId = solidityKeccak256(["bytes32", "uint256"], [majorNodeId, minor]);
    const patchNodeId = solidityKeccak256(["bytes32", "uint256"], [minorNodeId, patch]);

    return patchNodeId;
  }
}