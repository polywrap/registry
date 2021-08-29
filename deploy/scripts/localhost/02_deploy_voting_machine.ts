import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;

  const registrar = await hre.deployments.get('PolywrapRegistrar');

  await deploy(
    'VotingMachine',
    {
      from: deployer,
      args: [registrar.address],
      log: true,
    }
  );

  return !useProxy;
};
export default func;
func.id = 'deploy_voting_machine';
func.tags = ['VotingMachine'];