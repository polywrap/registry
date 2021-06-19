import { ethers } from "hardhat";
import { labelhash } from "./labelhash";

export const ensDomain = (label: string) => {
  return {
    label,
    labelHash: labelhash(label),
    name: `${label}.eth`,
    node: ethers.utils.namehash(`${label}.eth`)
  };
};