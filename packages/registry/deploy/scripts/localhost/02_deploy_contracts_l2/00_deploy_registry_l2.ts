import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deterministic } = hre.deployments;
  const useProxy = !hre.network.live;
  const isLocalNetwork = !hre.network.live;

  await (
    await deterministic("PolywrapRegistryL2", {
      contract: "PolywrapRegistry",
      from: deployer,
      args: [deployer],
      log: true,
      salt: isLocalNetwork
        ? ethers.utils.formatBytes32String("l2")
        : process.env.DEPLOYMENT_SALT,
    })
  ).deploy();

  return !useProxy;
};
export default func;
func.id = "deploy_registry_l2";
func.tags = ["PolywrapRegistryL2", "l2"];
