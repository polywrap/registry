import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;

  const ensRegistry = await hre.deployments.get("EnsRegistryL1");

  await deploy("EnsLinkL1", {
    contract: "EnsLink",
    from: deployer,
    args: [ensRegistry.address],
    log: true,
  });

  return !useProxy;
};
export default func;
func.id = "deploy_ens_link_l1";
func.tags = ["EnsLinkL1", "l1"];
