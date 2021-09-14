import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from "hardhat";
import { EnsDomain } from "registry-js";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;

  const ensRegistry = await deploy(
    'EnsRegistryL1',
    {
      contract: 'TestENSRegistry',
      from: deployer,
      args: [],
      log: true,
    }
  );

  await deploy(
    'TestEthRegistrarL1',
    {
      contract: 'TestEthRegistrar',
      from: deployer,
      args: [ensRegistry.address, ethers.utils.namehash(EnsDomain.TLD)],
      log: true,
    }
  );

  await deploy(
    'TestPublicResolverL1',
    {
      contract: 'TestPublicResolver',
      from: deployer,
      args: [ensRegistry.address],
      log: true,
    }
  );

  return !useProxy;
};
export default func;
func.id = 'deploy_ens_l1';
func.tags = ['EnsL1'];