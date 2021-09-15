import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { formatBytes32String } from "ethers/lib/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;

  const registryL1 = await hre.deployments.get("PolywrapRegistryL1");
  const ensLinkL1 = await hre.deployments.get("EnsLinkL1");

  await deploy("PackageOwnershipManagerL1", {
    contract: "PackageOwnershipManager",
    from: deployer,
    args: [
      registryL1.address,
      [formatBytes32String("ens")],
      [ensLinkL1.address],
    ],
    log: true,
  });

  return !useProxy;
};
export default func;
func.id = "deploy_package_ownership_manager_l1";
func.tags = ["PackageOwnershipManagerL1"];
