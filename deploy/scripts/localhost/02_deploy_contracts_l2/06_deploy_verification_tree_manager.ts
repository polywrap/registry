import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;

  const registryL2 = await hre.deployments.get('PolywrapRegistryL2');
  const votingMachine = await hre.deployments.get('VotingMachine');

  await deploy(
    'VerificationTreeManager',
    {
      from: deployer,
      args: [
        registryL2.address,
        votingMachine.address,
      ],
      log: true,
    }
  );

  return !useProxy;
};
export default func;
func.id = 'deploy_verification_tree_manager';
func.tags = ['VerificationTreeManager'];
