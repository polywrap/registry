import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from 'hardhat-deploy/types';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { Contract } from "ethers";

const getContract = async (
  name: string,
  hre: HardhatRuntimeEnvironment,
  deployer: string,
  signer: SignerWithAddress
): Promise<Contract> => {
  const deployment = await hre.deployments.get(name);

  let contract = await ethers.getContractAt(deployment.abi, deployer);
  contract = contract.connect(signer);

  return contract;
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;
  const signer = await ethers.getSigner(deployer);

  const registryL2 = await getContract('PolywrapRegistryL2', hre, deployer, signer);
  const registrar = await getContract('PolywrapRegistrar', hre, deployer, signer);
  const votingMachine = await getContract('VotingMachine', hre, deployer, signer);
  const verificationRootBridgeLinkL2 = await getContract('VerificationRootBridgeLinkL2', hre, deployer, signer);
  const verificationTreeManager = await getContract('VerificationTreeManager', hre, deployer, signer);
  const versionVerificationManager = await getContract('VersionVerificationManagerL2', hre, deployer, signer);
  const verificationRootRelayer = await getContract('VerificationRootRelayer', hre, deployer, signer);
  const packageOwnershipManagerL2 = await getContract('PackageOwnershipManagerL2', hre, deployer, signer);

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

  return !useProxy;
};
export default func;
func.id = 'connect_contracts';
func.tags = ['ConnectContracts'];