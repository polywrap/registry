import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { EnsDomain } from "../../../../test/helpers/ens/EnsDomain";
import { formatBytes32String } from "ethers/lib/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;
  const signer = await ethers.getSigner(deployer);

  const registryL2 = await ethers.getContract('PolywrapRegistryL2');
  const registrar = await ethers.getContract('PolywrapRegistrar');
  const votingMachine = await ethers.getContract('VotingMachine');
  const verificationRootBridgeLinkL1 = await ethers.getContract('VerificationRootBridgeLinkL1');
  const verificationRootBridgeLinkL2 = await ethers.getContract('VerificationRootBridgeLinkL2');
  const verificationTreeManager = await ethers.getContract('VerificationTreeManager');
  const versionVerificationManager = await ethers.getContract('VersionVerificationManagerL2');
  const verificationRootRelayer = await ethers.getContract('VerificationRootRelayer');
  const packageOwnershipManagerL2 = await ethers.getContract('PackageOwnershipManagerL2');
  const ownershipBridgeLinkL1 = await ethers.getContract('OwnershipBridgeLinkL1');
  const ownershipBridgeLinkL2 = await ethers.getContract('OwnershipBridgeLinkL2');

  await registrar.updateVotingMachine(votingMachine.address);
  await registryL2.updateOwnershipUpdater(packageOwnershipManagerL2.address);
  await votingMachine.updateVersionVerifiedListener(verificationTreeManager.address);

  await verificationRootBridgeLinkL2.updateVersionVerificationManager(versionVerificationManager.address);
  await registryL2.updateOwnershipUpdater(packageOwnershipManagerL2.address);
  await registryL2.updateVersionPublisher(versionVerificationManager.address);
  await verificationTreeManager.updateVerificationRootRelayer(verificationRootRelayer.address);
  await verificationRootBridgeLinkL2.updateVerificationRootRelayer(verificationRootRelayer.address);
  await versionVerificationManager.updateVerificationRootUpdater(verificationRootRelayer.address);
  await verificationRootRelayer.updateBridgeLink(verificationRootBridgeLinkL2.address);
  await verificationRootRelayer.updateVerificationTreeManager(verificationTreeManager.address);
  await packageOwnershipManagerL2.updateIncomingBridgeLink(
    EnsDomain.RegistryBytes32,
    formatBytes32String("l1-chain-name"),
    ownershipBridgeLinkL2.address
  );
  await ownershipBridgeLinkL1.updateBridgeLink(ownershipBridgeLinkL2.address);
  await ownershipBridgeLinkL2.updateBridgeLink(ownershipBridgeLinkL1.address);
  await verificationRootBridgeLinkL1.updateBridgeLink(verificationRootBridgeLinkL2.address);
  await verificationRootBridgeLinkL2.updateBridgeLink(verificationRootBridgeLinkL1.address);

  return !useProxy;
};
export default func;
func.id = 'connect_contracts';
func.tags = ['ConnectContracts'];