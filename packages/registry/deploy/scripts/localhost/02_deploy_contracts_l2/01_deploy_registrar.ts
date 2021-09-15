import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;

  const registryL2 = await hre.deployments.get("PolywrapRegistryL2");

  await deploy("PolywrapRegistrar", {
    from: deployer,
    args: [registryL2.address],
    log: true,
  });

  return !useProxy;
};
export default func;
func.id = "deploy_registrar";
func.tags = ["Registrar"];
