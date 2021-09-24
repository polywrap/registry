import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "ethers";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deterministic } = hre.deployments;
  const useProxy = !hre.network.live;

  await (
    await deterministic("PolywrapRegistryL2", {
      contract: "PolywrapRegistry",
      from: deployer,
      args: [deployer],
      log: true
    })
  ).deploy();

  return !useProxy;
};
export default func;
func.id = "deploy_registry_l2";
func.tags = ["PolywrapRegistryL2", "l2"];
