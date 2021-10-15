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

  const registryL2 = await hre.deployments.get("PolywrapRegistryL2");

  await(
    await deterministic("PackageOwnershipManagerL2", {
      contract: "PackageOwnershipManager",
      from: deployer,
      args: [deployer, registryL2.address, [], []],
      log: true,
      salt: deploymentSalt,
    })
  ).deploy();

  return !isLocalNetwork;
};
export default func;
func.id = "deploy_package_ownership_manager_l2";
func.tags = ["PackageOwnershipManagerL2", "l2"];
