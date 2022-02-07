import { labelhash } from ".";
import {
  formatBytes32String,
  namehash,
  solidityKeccak256,
} from "ethers/lib/utils";

export class EnsDomainV1 {
  constructor(labelOrName: string) {
    this.label = labelOrName.endsWith(EnsDomainV1.TLD)
      ? labelOrName.slice(0, -EnsDomainV1.TLD.length - 1)
      : labelOrName;
    this.labelHash = labelhash(this.label);
    this.name = `${this.label}.${EnsDomainV1.TLD}`;
    this.node = namehash(this.name);
    this.organizationId = solidityKeccak256(
      ["bytes32", "bytes32"],
      [EnsDomainV1.RegistryBytes32, this.node]
    );
  }

  label: string;
  labelHash: string;
  name: string;
  node: string;
  organizationId: string;

  readonly registry = "ens";
  readonly registryBytes32 = EnsDomainV1.RegistryBytes32;

  static TLD = "eth";
  static Registry = "ens";
  static RegistryBytes32: string = formatBytes32String(EnsDomainV1.Registry);
}
