import { formatBytes32String, keccak256, namehash, solidityKeccak256 } from "ethers/lib/utils";
import { labelhash } from "../labelhash";

export class CustomDomain {
  constructor(label: string) {
    this.label = label;
    this.labelHash = labelhash(label);
    this.name = `${label}.${CustomDomain.TLD}`;
    this.node = namehash(this.name);
    this.packageId = solidityKeccak256(["bytes32", "bytes32"], [keccak256(this.node), CustomDomain.RegistrarBytes32]);
  }

  label: string;
  labelHash: string;
  name: string;
  node: string;
  packageId: string;

  static TLD: string = "cst";
  static Registrar: string = "custom";
  static RegistrarBytes32: string = formatBytes32String(CustomDomain.Registrar);
}