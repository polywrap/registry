import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from "hardhat";
import { EnsDomain } from "../../../../test/helpers/ens/EnsDomain";
import { formatBytes32String } from "ethers/lib/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;
  const signer = await ethers.getSigner(deployer);

  const registryL1 = await ethers.getContract('PolywrapRegistryL1');
  const versionVerificationManagerL1 = await ethers.getContract('VersionVerificationManagerL1');
  const packageOwnershipManagerL1 = await ethers.getContract('PackageOwnershipManagerL1');
  const verificationRootBridgeLinkL1 = await ethers.getContract('VerificationRootBridgeLinkL1');
  const ownershipBridgeLinkL1 = await ethers.getContract('OwnershipBridgeLinkL1');

  await verificationRootBridgeLinkL1.updateVersionVerificationManager(versionVerificationManagerL1.address);

  await registryL1.updateOwnershipUpdater(packageOwnershipManagerL1.address);
  await registryL1.updateVersionPublisher(versionVerificationManagerL1.address);
  await versionVerificationManagerL1.updateVerificationRootUpdater(verificationRootBridgeLinkL1.address);
  await packageOwnershipManagerL1.updateOutgoingBridgeLink(EnsDomain.RegistryBytes32, formatBytes32String("l2-chain-name"), ownershipBridgeLinkL1.address);
  await packageOwnershipManagerL1.updateLocalDomainRegistryPermission(EnsDomain.RegistryBytes32, true);

  return !useProxy;
};
export default func;
func.id = 'connect_contracts';
func.tags = ['ConnectContracts'];
