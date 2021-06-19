import { ethers } from "hardhat";
import { labelhash } from "./labelhash";

export class EnsDomain {
  constructor(label: string) {
    this.label = label;
    this.labelHash = labelhash(label);
    this.name = `${label}.eth`;
    this.node = ethers.utils.namehash(this.name);
    this.apiId = ethers.utils.keccak256(this.node);
  }

  label: string;
  labelHash: string;
  name: string;
  node: string;
  apiId: string;
}