import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;
  const ensRegistryAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";

  await deploy("EnsLinkL1", {
    contract: "EnsLinkV1",
    from: deployer,
    args: [ensRegistryAddress],
    log: true,
  });

  return !useProxy;
};
export default func;
func.id = "deploy_ens_link_l1";
func.tags = ["EnsLinkL1", "v1"];
