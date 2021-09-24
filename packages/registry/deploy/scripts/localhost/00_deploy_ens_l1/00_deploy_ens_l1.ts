import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { EnsDomain } from "@polywrap/registry-core-js";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deterministic } = hre.deployments;
  const useProxy = !hre.network.live;

  const ensRegistry = await(
    await deterministic("EnsRegistryL1", {
      contract: "TestENSRegistry",
      from: deployer,
      args: [deployer],
      log: true,
    })
  ).deploy();

  await(
    await deterministic("TestEthRegistrarL1", {
      contract: "TestEthRegistrar",
      from: deployer,
      args: [
        deployer,
        ensRegistry.address,
        ethers.utils.namehash(EnsDomain.TLD),
      ],
      log: true,
    })
  ).deploy();

  await(
    await deterministic("TestPublicResolverL1", {
      contract: "TestPublicResolver",
      from: deployer,
      args: [ensRegistry.address],
      log: true,
    })
  ).deploy();

  return !useProxy;
};
export default func;
func.id = "deploy_ens_l1";
func.tags = ["EnsL1", "ens", "l1"];
