import { formatBytes32String, keccak256, namehash, solidityKeccak256 } from "ethers/lib/utils";
import { labelhash } from "../labelhash";

export class EnsDomain {
  constructor(label: string) {
    this.label = label;
    this.labelHash = labelhash(label);
    this.name = `${label}.${EnsDomain.TLD}`;
    this.node = namehash(this.name);
    this.packageId = solidityKeccak256(["bytes32", "bytes32"], [keccak256(this.node), formatBytes32String(EnsDomain.Registrar)]);
  }

  label: string;
  labelHash: string;
  name: string;
  node: string;
  packageId: string;

  static TLD: string = "eth";
  static Registrar: string = "ens";
}