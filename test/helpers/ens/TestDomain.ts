import { formatBytes32String, keccak256, namehash, solidityKeccak256 } from "ethers/lib/utils";
import { labelhash } from "../labelhash";

export class TestDomain {
  constructor(label: string) {
    this.label = label;
    this.labelHash = labelhash(label);
    this.name = `${label}.${TestDomain.TLD}`;
    this.node = namehash(this.name);
    this.packageId = solidityKeccak256(["bytes32", "bytes32"], [keccak256(this.node), TestDomain.RegistrarBytes32]);
  }

  label: string;
  labelHash: string;
  name: string;
  node: string;
  packageId: string;

  static TLD: string = "test";
  static Registrar: string = "test";
  static RegistrarBytes32: string = formatBytes32String(TestDomain.Registrar);
}