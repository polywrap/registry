import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;

  await deploy("PolywrapRegistryL2", {
    contract: "PolywrapRegistry",
    from: deployer,
    args: [],
    log: true,
  });

  return !useProxy;
};
export default func;
func.id = "deploy_registry_l2";
func.tags = ["PolywrapRegistryL2", "l2"];
