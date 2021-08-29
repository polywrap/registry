import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from 'hardhat-deploy/types';
import { formatBytes32String } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { DeployResult } from "hardhat-deploy/dist/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;
  const deployerSigner = await ethers.getSigner(deployer);

  const deployContract = async (name: string, args: any[], deployer: string, deployerSigner: SignerWithAddress) => {
    const result = await deploy(name, {
      from: deployer,
      args: args,
      log: true,
    });

    let contract = await ethers.getContractAt(result.abi, deployer);
    contract = contract.connect(deployerSigner);

    return {
      result,
      address: result.address,
      contract: contract
    };
  };

  const registry = await deployContract(
    'PolywrapRegistry',
    [],
    deployer,
    deployerSigner
  );

  const registrar = await deployContract(
    'PolywrapRegistrar',
    [registry.address],
    deployer,
    deployerSigner
  );

  const votingMachine = await deployContract(
    'VotingMachine',
    [registrar.address],
    deployer,
    deployerSigner
  );

  const ensLink = await deployContract(
    'EnsLink',
    [registry.address],
    deployer,
    deployerSigner
  );

  const packageOwnershipManager = await deployContract(
    'PackageOwnershipManager',
    [
      registry.address,
      [formatBytes32String("ens")],
      [ensLink.address]
    ],
    deployer,
    deployerSigner
  );

  const verificationTreeManager = await deployContract(
    'VerificationTreeManager',
    [
      registry.address,
      votingMachine.address,
    ],
    deployer,
    deployerSigner
  );

  const versionVerificationManager = await deployContract(
    'VersionVerificationManager',
    [
      registry.address,
    ],
    deployer,
    deployerSigner
  );

  const verificationRootBridgeLink = await deployContract(
    'VerificationRootBridgeLinkMock',
    [
      ethers.constants.AddressZero,
      formatBytes32String("1"),
      1
    ],
    deployer,
    deployerSigner
  );

  const verificationRootRelayer = await deployContract(
    'VerificationRootRelayer',
    [
      versionVerificationManager.address,
      5
    ],
    deployer,
    deployerSigner
  );

  await registrar.contract.updateVotingMachine(votingMachine.address);
  await registry.contract.updateOwnershipUpdater(packageOwnershipManager.address);
  await votingMachine.contract.updateVersionVerifiedListener(verificationTreeManager.address);
  await verificationRootBridgeLink.contract.updateVersionVerificationManager(versionVerificationManager.address);
  await registry.contract.updateOwnershipUpdater(packageOwnershipManager.address);
  await registry.contract.updateVersionPublisher(versionVerificationManager.address);
  await verificationTreeManager.contract.updateVerificationRootRelayer(verificationRootRelayer.address);
  await verificationRootBridgeLink.contract.updateVerificationRootRelayer(verificationRootRelayer.address);
  await versionVerificationManager.contract.updateVerificationRootUpdater(verificationRootRelayer.address);
  // await verificationRootRelayer.contract.updateBridgeLink(verificationRootBridgeLink.address);
  await verificationRootRelayer.contract.updateVerificationTreeManager(verificationTreeManager.address);

  return !useProxy; // when live network, record the script as executed to prevent rexecution
};
export default func;
func.id = 'deploy_registry'; // id required to prevent reexecution
func.tags = ['Registry'];