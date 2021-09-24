import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deterministic } = hre.deployments;
  const useProxy = !hre.network.live;

  const ensRegistry = await hre.deployments.get("EnsRegistryL1");

  await(
    await deterministic("EnsLinkL1", {
      contract: "EnsLink",
      from: deployer,
      args: [ensRegistry.address],
      log: true,
    })
  ).deploy();

  return !useProxy;
};
export default func;
func.id = "deploy_ens_link_l1";
func.tags = ["EnsLinkL1", "l1"];
