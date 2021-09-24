import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { formatBytes32String } from "ethers/lib/utils";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deterministic } = hre.deployments;
  const useProxy = !hre.network.live;

  await(
    await deterministic("VerificationRootBridgeLinkL1", {
      contract: "VerificationRootBridgeLinkMock",
      from: deployer,
      args: [
        deployer,
        ethers.constants.AddressZero,
        formatBytes32String("2"),
        1,
      ],
      log: true,
    })
  ).deploy();

  return !useProxy;
};
export default func;
func.id = "deploy_verification_root_bridge_link_l1";
func.tags = ["VerificationRootBridgeLinkL1", "l1"];
