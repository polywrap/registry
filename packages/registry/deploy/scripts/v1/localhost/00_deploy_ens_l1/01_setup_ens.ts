import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { labelhash, EnsDomain } from "@polywrap/registry-core-js";
import {
  ENSRegistry__factory,
  TestEthRegistrar__factory,
  TestPublicResolver__factory,
} from "../../../../../typechain-types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;
  const signer = await ethers.getSigner(deployer);

  const rootNode = ethers.utils.zeroPad([0], 32);

  const registry = ENSRegistry__factory.connect(
    (await hre.deployments.get("EnsRegistryL1")).address,
    signer
  );
  const registrar = TestEthRegistrar__factory.connect(
    (await hre.deployments.get("TestEthRegistrarL1")).address,
    signer
  );
  const publicResolver = TestPublicResolver__factory.connect(
    (await hre.deployments.get("TestPublicResolverL1")).address,
    signer
  );

  await registry.setSubnodeOwner(
    rootNode,
    labelhash(EnsDomain.TLD),
    registrar.address
  );
  await registrar.addController(deployer);

  await registrar.setResolver(publicResolver.address);

  return !useProxy;
};
export default func;
func.id = "setup_ens_l1";
func.tags = ["SetupEnsL1", "ens", "l1"];
