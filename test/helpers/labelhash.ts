import { ethers } from "hardhat";

export const labelhash = (label: string): string => {
  const labelhash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(
      ethers.utils.nameprep(label)
    )
  );

  return labelhash;
};