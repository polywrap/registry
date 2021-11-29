import { labelhash } from "@polywrap/registry-core-js";
import {
  formatBytes32String,
  namehash,
  solidityKeccak256,
} from "ethers/lib/utils";

export class EnsDomain {
  constructor(labelOrName: string) {
    this.label = labelOrName.endsWith(EnsDomain.TLD)
      ? labelOrName.slice(0, -EnsDomain.TLD.length - 1)
      : labelOrName;
    this.labelHash = labelhash(this.label);
    this.name = `${this.label}.${EnsDomain.TLD}`;
    this.node = namehash(this.name);
    this.organizationId = solidityKeccak256(
      ["bytes32", "bytes32"],
      [EnsDomain.RegistryBytes32, this.node]
    );
  }

  label: string;
  labelHash: string;
  name: string;
  node: string;
  organizationId: string;

  readonly registry = "ens";
  readonly registryBytes32 = EnsDomain.RegistryBytes32;

  static TLD = "eth";
  static Registry = "ens";
  static RegistryBytes32: string = formatBytes32String(EnsDomain.Registry);
}
