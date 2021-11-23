import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;

  const registryL1 = await hre.deployments.get("PolywrapRegistryL1");

  await deploy("VersionResolverL1", {
    contract: "VersionResolverV1",
    from: deployer,
    args: [registryL1.address],
    log: true,
  });

  return !useProxy;
};
export default func;
func.id = "deploy_version_resolver_l1";
func.tags = ["VersionResolverL1", "l1"];
