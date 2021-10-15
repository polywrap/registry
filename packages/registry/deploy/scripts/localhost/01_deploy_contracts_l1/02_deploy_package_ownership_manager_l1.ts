import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { formatBytes32String } from "ethers/lib/utils";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deterministic } = hre.deployments;
  const isLocalNetwork = !hre.network.live;
  const deploymentSalt = isLocalNetwork
    ? ethers.utils.formatBytes32String("l1")
    : process.env.DEPLOYMENT_SALT;

  const registryL1 = await hre.deployments.get("PolywrapRegistryL1");
  const ensLinkL1 = await hre.deployments.get("EnsLinkL1");

  await(
    await deterministic("PackageOwnershipManagerL1", {
      contract: "PackageOwnershipManager",
      from: deployer,
      args: [
        deployer,
        registryL1.address,
        [formatBytes32String("ens")],
        [ensLinkL1.address],
      ],
      log: true,
      salt: deploymentSalt,
    })
  ).deploy();

  return !isLocalNetwork;
};
export default func;
func.id = "deploy_package_ownership_manager_l1";
func.tags = ["PackageOwnershipManagerL1", "l1"];
