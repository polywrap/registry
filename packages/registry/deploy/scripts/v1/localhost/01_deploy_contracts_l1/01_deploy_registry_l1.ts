import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { formatBytes32String } from "ethers/lib/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;

  const ensLinkL1 = await hre.deployments.get("EnsLinkL1");

  await deploy("PolywrapRegistryV1", {
    contract: "PolywrapRegistryV1",
    from: deployer,
    args: [[formatBytes32String("ens")], [ensLinkL1.address]],
    log: true,
  });

  return !useProxy;
};
export default func;
func.id = "deploy_registry_l1";
func.tags = ["PolywrapRegistryL1", "v1"];
