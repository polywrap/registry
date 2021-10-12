import {
  DomainPolywrapOwnerRevert,
  DomainPolywrapOwnerReverts,
  PackageLocationRevert,
  PackageLocationReverts,
  PolywrapOwnerRevert,
  PolywrapOwnerReverts,
  PrevAndNextMinorPackageLocationsRevert,
  PrevAndNextMinorPackageLocationsReverts,
  PrevPatchPackageLocationRevert,
  PrevPatchPackageLocationReverts,
  ProposeVersionRevert,
  ProposeVersionReverts,
  PublishVersionRevert,
  PublishVersionReverts,
  RelayOwnershipRevert,
  RelayOwnershipReverts,
  UpdateOwnershipRevert,
  UpdateOwnershipReverts,
} from "@polywrap/registry-js";

export const IgnorableReverts = [
  ...PolywrapOwnerReverts,
  ...DomainPolywrapOwnerReverts,
  ...UpdateOwnershipReverts,
  ...RelayOwnershipReverts,
  ...ProposeVersionReverts,
  ...PublishVersionReverts,
  ...PackageLocationReverts,
  ...PrevPatchPackageLocationReverts,
  ...PrevAndNextMinorPackageLocationsReverts,
] as const;

export type IgnorableRevert =
  | PolywrapOwnerRevert
  | DomainPolywrapOwnerRevert
  | UpdateOwnershipRevert
  | RelayOwnershipRevert
  | ProposeVersionRevert
  | PublishVersionRevert
  | PackageLocationRevert
  | PrevPatchPackageLocationRevert
  | PrevAndNextMinorPackageLocationsRevert;
