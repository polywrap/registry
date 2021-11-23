import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { formatBytes32String } from "ethers/lib/utils";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;

  await deploy("VerificationRootBridgeLinkL2", {
    contract: "VerificationRootBridgeLinkMock",
    from: deployer,
    args: [ethers.constants.AddressZero, formatBytes32String("1"), 1],
    log: true,
  });

  return !useProxy;
};
export default func;
func.id = "deploy_verification_root_bridge_link_l2";
func.tags = ["VerificationRootBridgeLinkL2", "l2"];
