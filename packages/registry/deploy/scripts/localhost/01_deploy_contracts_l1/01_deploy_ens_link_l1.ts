import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deterministic } = hre.deployments;
  const isLocalNetwork = !hre.network.live;
  const deploymentSalt = isLocalNetwork
    ? ethers.utils.formatBytes32String("l1")
    : process.env.DEPLOYMENT_SALT;

  const ensRegistry = await hre.deployments.get("EnsRegistryL1");

  await(
    await deterministic("EnsLinkL1", {
      contract: "EnsLink",
      from: deployer,
      args: [ensRegistry.address],
      log: true,
      salt: deploymentSalt,
    })
  ).deploy();

  return !isLocalNetwork;
};
export default func;
func.id = "deploy_ens_link_l1";
func.tags = ["EnsLinkL1", "l1"];
