import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export const getDeployedContract = async (
  name: string,
  hre: HardhatRuntimeEnvironment,
  deployer: string,
  signer: SignerWithAddress
): Promise<Contract> => {
  const deployment = await hre.deployments.get(name);

  let contract = await ethers.getContractAt(deployment.abi, deployer);
  contract = contract.connect(signer);

  return contract;
};
