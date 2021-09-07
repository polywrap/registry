import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from 'hardhat-deploy/types';
import { EnsDomain } from "../../../../test/helpers/ens/EnsDomain";
import { ethers } from "hardhat";
import { labelhash } from "../../../../test/helpers/ens/labelhash";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;
  const signer = await ethers.getSigner(deployer);

  const rootNode = ethers.utils.zeroPad([0], 32);

  const registry = await ethers.getContract('EnsRegistryL1');
  const registrar = await ethers.getContract('TestEthRegistrarL1');
  const publicResolver = await ethers.getContract('TestPublicResolverL1');

  await registry.setSubnodeOwner(rootNode, labelhash(EnsDomain.TLD), registrar.address);
  await registrar.addController(deployer);

  await registrar.setResolver(publicResolver.address);

  return !useProxy;
};
export default func;
func.id = 'setup_ens_l1';
func.tags = ['SetupEnsL1'];