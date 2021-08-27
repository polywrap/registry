import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from 'hardhat-deploy/types';
import { formatBytes32String } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { VerificationRootBridgeLink__factory } from "../typechain";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;

  // proxy only in non-live network (localhost and hardhat network) enabling HCR (Hot Contract Replacement)
  // in live network, proxy is disabled and constructor is invoked
  const registryResult = await deploy('PolywrapRegistry', {
    from: deployer,
    // proxy: useProxy && 'postUpgrade',
    args: [],
    log: true,
  });

  const registrarResult = await deploy('PolywrapRegistrar', {
    from: deployer,
    args: [registryResult.address],
    log: true,
  });

  const votingMachineResult = await deploy('VotingMachine', {
    from: deployer,
    args: [registrarResult.address],
    log: true,
  });

  return !useProxy; // when live network, record the script as executed to prevent rexecution
};
export default func;
func.id = 'deploy_registry'; // id required to prevent reexecution
func.tags = ['Registry'];