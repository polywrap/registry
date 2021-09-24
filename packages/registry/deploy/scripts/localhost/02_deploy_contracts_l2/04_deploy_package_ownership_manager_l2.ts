import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { formatBytes32String } from "ethers/lib/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deterministic } = hre.deployments;
  const useProxy = !hre.network.live;

  const registryL2 = await hre.deployments.get("PolywrapRegistryL2");
  const ensLink = await hre.deployments.get("EnsLinkL1");

  await(
    await deterministic("PackageOwnershipManagerL2", {
      contract: "PackageOwnershipManager",
      from: deployer,
      args: [
        deployer,
        registryL2.address,
        [formatBytes32String("ens")],
        [ensLink.address],
      ],
      log: true,
    })
  ).deploy();

  return !useProxy;
};
export default func;
func.id = "deploy_package_ownership_manager_l2";
func.tags = ["PackageOwnershipManagerL2", "l2"];
