import { ethers } from "ethers";
import { BytesLike, formatBytes32String, hexZeroPad, solidityKeccak256 } from "ethers/lib/utils";
import { EnsDomain } from "./ens/EnsDomain";
import * as PackageOwnershipManagerL1 from "../../../deployments/localhost/PackageOwnershipManagerL1.json"
import * as PolywrapRegistrar from "../../../deployments/localhost/PolywrapRegistrar.json"
import * as VotingMachine from "../../../deployments/localhost/VotingMachine.json"
import * as VerificationTreeManager from "../../../deployments/localhost/VerificationTreeManager.json"
import * as VersionVerificationManagerL2 from "../../../deployments/localhost/VersionVerificationManagerL2.json"
import { PackageOwnershipManager__factory, Registrar__factory, VersionVerificationManager__factory, VerificationTreeManager__factory, VotingMachine__factory } from "../../../typechain";

export type BlockchainsWithRegistry = "l2-chain-name" | "ethereum" | "xdai";

export class PackageOwner {
  constructor(provider: ethers.providers.Provider, privateKey: string) {
    this.signer = new ethers.Wallet(privateKey, provider);
  }

  signer: ethers.Wallet;

  async updateOwnership(domain: EnsDomain) {

    let packageOwnershipManagerL1 = PackageOwnershipManager__factory.connect(PackageOwnershipManagerL1.address, this.signer);

    const tx = await packageOwnershipManagerL1.updateOwnership(EnsDomain.RegistryBytes32, domain.node);

    await tx.wait();
  }

  async relayOwnership(domain: EnsDomain, chainName: BlockchainsWithRegistry) {
    let packageOwnershipManagerL1 = PackageOwnershipManager__factory.connect(PackageOwnershipManagerL1.address, this.signer);

    const tx = await packageOwnershipManagerL1.relayOwnership(formatBytes32String(chainName), EnsDomain.RegistryBytes32, domain.node);

    await tx.wait();
  }

  async proposeVersion(domain: EnsDomain, packageLocation: string, major: number, minor: number, patch: number) {
    let registrar = Registrar__factory.connect(PolywrapRegistrar.address, this.signer);

    const proposeTx = await registrar.proposeVersion(
      domain.packageId,
      major, minor, patch,
      packageLocation
    );

    await proposeTx.wait();

    const majorNodeId = solidityKeccak256(["bytes32", "uint256"], [domain.packageId, major]);
    const minorNodeId = solidityKeccak256(["bytes32", "uint256"], [majorNodeId, minor]);
    const patchNodeId = solidityKeccak256(["bytes32", "uint256"], [minorNodeId, patch]);

    const packageLocationHash = solidityKeccak256(["string"], [packageLocation]);


    console.log('patchNodeId', patchNodeId);
    console.log('packageLocationHash', packageLocationHash);
  }

  async getVerificationRoot(): Promise<BytesLike> {
    let versionVerificationManagerL2 = VersionVerificationManager__factory.connect(VersionVerificationManagerL2.address, this.signer);

    return await versionVerificationManagerL2.verificationRoot();
  }

  async getLeafCountForRoot(verificationRoot: BytesLike): Promise<number> {
    let verificationTreeManager = VerificationTreeManager__factory.connect(VerificationTreeManager.address, this.signer);

    const topicId = ethers.utils.id('VerificationRootCalculated(bytes32,uint256)');
    const rootCalculatedEvents = await verificationTreeManager.queryFilter(
      {
        topics: [
          topicId,
          hexZeroPad(verificationRoot, 32)
        ]
      },
      0,
      'latest'
    );

    //@ts-ignore
    return rootCalculatedEvents[0].args.verifiedVersionCount;
  }

  async publishVersion(domain: EnsDomain, packageLocation: string, major: number, minor: number, patch: number) {
    let verificationTreeManager = VerificationTreeManager__factory.connect(VerificationTreeManager.address, this.signer);

    const verificationRoot = await this.getVerificationRoot();
    const leafCountForRoot = await this.getLeafCountForRoot(verificationRoot);

    const topicId = ethers.utils.id('VersionVerified(bytes32,bytes32,uint256');
    const verifiedVersionEvents = await verificationTreeManager.queryFilter(
      {
        topics: [topicId]
      },
      0,
      'latest'
    );

    const leaves: BytesLike[] = [];

    for (const event of verifiedVersionEvents) {
      //@ts-ignore
      const { patchNodeId, packageLocationHash, verifiedVersionCount } = event.args;
    }
  }

  async waitForVotingEnd(domain: EnsDomain, packageLocation: string, major: number, minor: number, patch: number) {
    let votingMachine = VotingMachine__factory.connect(VotingMachine.address, this.signer);

    const majorNodeId = solidityKeccak256(["bytes32", "uint256"], [domain.packageId, major]);
    const minorNodeId = solidityKeccak256(["bytes32", "uint256"], [majorNodeId, minor]);
    const patchNodeId = solidityKeccak256(["bytes32", "uint256"], [minorNodeId, patch]);

    const packageLocationHash = solidityKeccak256(["string"], [packageLocation]);

    return new Promise(async (resolve, reject) => {
      await votingMachine.on(
        'VersionDecided',
        (
          decidedPatchNodeId: BytesLike,
          verified: boolean,
          decidedPackageLocationHash: BytesLike
        ) => {
          if (decidedPatchNodeId !== patchNodeId || decidedPackageLocationHash != packageLocationHash) {
            return;
          }

          resolve({
            patchNodeId,
            verified,
            packageLocationHash
          });
        });
    });
  }
}