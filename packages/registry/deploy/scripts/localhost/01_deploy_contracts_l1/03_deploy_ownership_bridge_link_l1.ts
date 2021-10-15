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

  const packageOwnershipManagerL1 = await hre.deployments.get(
    "PackageOwnershipManagerL1"
  );

  await(
    await deterministic("OwnershipBridgeLinkL1", {
      contract: "OwnershipBridgeLinkMock",
      from: deployer,
      args: [
        deployer,
        ethers.constants.AddressZero,
        packageOwnershipManagerL1.address,
        formatBytes32String("l2-chain-name"),
        formatBytes32String("2"),
        1,
      ],
      log: true,
      salt: deploymentSalt,
    })
  ).deploy();

  return !isLocalNetwork;
};
export default func;
func.id = "deploy_ownership_bridge_link_l1";
func.tags = ["OwnershipBridgeLinkL1", "l1"];
