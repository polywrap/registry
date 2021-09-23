import {
  formatBytes32String,
  keccak256,
  namehash,
  solidityKeccak256,
} from "ethers/lib/utils";
import { labelhash } from "./labelhash";

export class EnsDomain {
  constructor(labelOrName: string) {
    this.label = labelOrName.endsWith(EnsDomain.TLD)
      ? labelOrName.slice(0, -EnsDomain.TLD.length - 1)
      : labelOrName;
    this.labelHash = labelhash(this.label);
    this.name = `${this.label}.${EnsDomain.TLD}`;
    this.node = namehash(this.name);
    this.packageId = solidityKeccak256(
      ["bytes32", "bytes32"],
      [keccak256(this.node), EnsDomain.RegistryBytes32]
    );
  }

  label: string;
  labelHash: string;
  name: string;
  node: string;
  packageId: string;

  readonly registry = "ens";
  readonly registryBytes32 = EnsDomain.RegistryBytes32;

  static TLD = "eth";
  static Registry = "ens";
  static RegistryBytes32: string = formatBytes32String(EnsDomain.Registry);
}
