import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;

  const registryL2 = await hre.deployments.get("PolywrapRegistryL2");

  await deploy("PackageOwnershipManagerL2", {
    contract: "PackageOwnershipManager",
    from: deployer,
    args: [registryL2.address, [], []],
    log: true,
  });

  return !useProxy;
};
export default func;
func.id = "deploy_package_ownership_manager_l2";
func.tags = ["PackageOwnershipManagerL2", "l2"];
