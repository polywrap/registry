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
    await deterministic("PolywrapRegistrar", {
      from: deployer,
      args: [deployer, registryL2.address],
      log: true,
      salt: deploymentSalt,
    })
  ).deploy();

  return !isLocalNetwork;
};
export default func;
func.id = "deploy_registrar";
func.tags = ["Registrar", "l2"];
