import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deterministic } = hre.deployments;
  const useProxy = !hre.network.live;
  const isLocalNetwork = !hre.network.live;

  const registryL2 = await hre.deployments.get("PolywrapRegistryL2");
  const votingMachine = await hre.deployments.get("VotingMachine");

  await (
    await deterministic("VerificationTreeManager", {
      from: deployer,
      args: [deployer, registryL2.address, votingMachine.address],
      log: true,
      salt: isLocalNetwork
        ? ethers.utils.formatBytes32String("l2")
        : process.env.DEPLOYMENT_SALT,
    })
  ).deploy();

  return !useProxy;
};
export default func;
func.id = "deploy_verification_tree_manager";
func.tags = ["VerificationTreeManager", "l2"];
