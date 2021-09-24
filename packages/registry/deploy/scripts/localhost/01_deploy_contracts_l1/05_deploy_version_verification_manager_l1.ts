import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deterministic } = hre.deployments;
  const useProxy = !hre.network.live;

  const registryL1 = await hre.deployments.get("PolywrapRegistryL1");

  await(
    await deterministic("VersionVerificationManagerL1", {
      contract: "VersionVerificationManager",
      from: deployer,
      args: [deployer, registryL1.address],
      log: true,
    })
  ).deploy();

  return !useProxy;
};
export default func;
func.id = "deploy_version_verification_manager_l1";
func.tags = ["VersionVerificationManagerL1", "l1"];
