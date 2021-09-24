import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deterministic } = hre.deployments;
  const useProxy = !hre.network.live;

  const registrar = await hre.deployments.get("PolywrapRegistrar");

  await(
    await deterministic("VotingMachine", {
      from: deployer,
      args: [deployer, registrar.address],
      log: true,
    })
  ).deploy();

  return !useProxy;
};
export default func;
func.id = "deploy_voting_machine";
func.tags = ["VotingMachine", "l2"];
