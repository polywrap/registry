import { formatBytes32String, keccak256, namehash, solidityKeccak256 } from "ethers/lib/utils";
import { labelhash } from "./labelhash";

export class EnsDomain {
  constructor(label: string) {
    this.label = label;
    this.labelHash = labelhash(label);
    this.name = `${label}.${EnsDomain.TLD}`;
    this.node = namehash(this.name);
    this.packageId = solidityKeccak256(["bytes32", "bytes32"], [keccak256(this.node), EnsDomain.RegistryBytes32]);
  }

  label: string;
  labelHash: string;
  name: string;
  node: string;
  packageId: string;

  static TLD: string = "eth";
  static Registry: string = "ens";
  static RegistryBytes32: string = formatBytes32String(EnsDomain.Registry);

  getPatchNodeId(major: number, minor: number, patch: number) {
    const majorNodeId = solidityKeccak256(["bytes32", "uint256"], [this.packageId, major]);
    const minorNodeId = solidityKeccak256(["bytes32", "uint256"], [majorNodeId, minor]);
    const patchNodeId = solidityKeccak256(["bytes32", "uint256"], [minorNodeId, patch]);

    return patchNodeId;
  }

  getProposedVersionId(major: number, minor: number, patch: number, packageLocation: string) {
    const proposedVersionId = solidityKeccak256(["bytes32", "string"], [this.getPatchNodeId(major, minor, patch), packageLocation]);
    
    return proposedVersionId; 
  }

  getDecidedVersionLeaf(major: number, minor: number, patch: number, packageLocation: string, verified: boolean) {
    const decidedVersionLeaf = solidityKeccak256(["bytes32", "bool"], [this.getProposedVersionId(major, minor, patch, packageLocation), verified]);

    return decidedVersionLeaf;
  }
}