import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { formatBytes32String } from "ethers/lib/utils";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;

  const packageOwnershipManagerL2 = await hre.deployments.get(
    "PackageOwnershipManagerL2"
  );

  await deploy("OwnershipBridgeLinkL2", {
    contract: "OwnershipBridgeLinkMock",
    from: deployer,
    args: [
      ethers.constants.AddressZero,
      packageOwnershipManagerL2.address,
      formatBytes32String("l1-chain-name"),
      formatBytes32String("1"),
      1,
    ],
    log: true,
  });

  return !useProxy;
};
export default func;
func.id = "deploy_ownership_bridge_link_l2";
func.tags = ["OwnershipBridgeLinkL2", "l2"];
