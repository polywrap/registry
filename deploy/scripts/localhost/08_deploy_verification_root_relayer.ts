import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;

  const versionVerificationManagerL2 = await hre.deployments.get('VersionVerificationManagerL2');

  await deploy(
    'VerificationRootRelayer',
    {
      from: deployer,
      args: [
        versionVerificationManagerL2.address,
        5
      ],
      log: true,
    }
  );

  return !useProxy;
};
export default func;
func.id = 'deploy_verification_root_relayer';
func.tags = ['VerificationRootRelayer'];