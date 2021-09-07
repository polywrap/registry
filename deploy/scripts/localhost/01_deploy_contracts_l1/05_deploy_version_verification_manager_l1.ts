import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;

  const registryL1 = await hre.deployments.get('PolywrapRegistryL1');

  await deploy(
    'VersionVerificationManagerL1',
    {
      contract: 'VersionVerificationManager',
      from: deployer,
      args: [
        registryL1.address,
      ],
      log: true,
    }
  );

  return !useProxy;
};
export default func;
func.id = 'deploy_version_verification_manager_l1';
func.tags = ['VersionVerificationManagerL1'];