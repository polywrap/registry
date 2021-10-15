import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deterministic } = hre.deployments;
  const isLocalNetwork = !hre.network.live;
  const deploymentSalt = isLocalNetwork
    ? ethers.utils.formatBytes32String("l2")
    : process.env.DEPLOYMENT_SALT;

  await(
    await deterministic("PolywrapRegistryL2", {
      contract: "PolywrapRegistry",
      from: deployer,
      args: [deployer],
      log: true,
      salt: deploymentSalt,
    })
  ).deploy();

  return !isLocalNetwork;
};
export default func;
func.id = "deploy_registry_l2";
func.tags = ["PolywrapRegistryL2", "l2"];
