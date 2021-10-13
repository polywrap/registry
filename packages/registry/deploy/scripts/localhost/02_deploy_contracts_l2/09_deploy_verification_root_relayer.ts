import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deterministic } = hre.deployments;
  const useProxy = !hre.network.live;
  const isLocalNetwork = !hre.network.live;

  const versionVerificationManagerL2 = await hre.deployments.get(
    "VersionVerificationManagerL2"
  );

  await (
    await deterministic("VerificationRootRelayer", {
      from: deployer,
      args: [deployer, versionVerificationManagerL2.address, 1],
      log: true,
      salt: isLocalNetwork
        ? ethers.utils.formatBytes32String("l2")
        : process.env.DEPLOYMENT_SALT,
    })
  ).deploy();

  return !useProxy;
};
export default func;
func.id = "deploy_verification_root_relayer";
func.tags = ["VerificationRootRelayer", "l2"];
