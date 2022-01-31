import { RegistryPlugin } from "./";
import { Mutation, Query } from "./w3";

import { Client } from "@web3api/core-js";

export const query = (
  registryPlugin: RegistryPlugin,
  client: Client
): Query.Module => ({
  domainOwner: (input: Query.Input_domainOwner) => {
    return registryPlugin.domainOwner(input, client);
  },
  organizationOwner: (input: Query.Input_organizationOwner) => {
    return registryPlugin.organizationOwner(input, client);
  },
  organizationController: (input: Query.Input_organizationController) => {
    return registryPlugin.organizationController(input, client);
  },
  organizationExists: (input: Query.Input_organizationExists) => {
    return registryPlugin.organizationExists(input, client);
  },
  organization: (input: Query.Input_organization) => {
    return registryPlugin.organization(input, client);
  },
  packageExists: (input: Query.Input_packageExists) => {
    return registryPlugin.packageExists(input, client);
  },
  packageOwner: (input: Query.Input_packageOwner) => {
    return registryPlugin.packageOwner(input, client);
  },
  packageController: (input: Query.Input_packageController) => {
    return registryPlugin.packageController(input, client);
  },
  packageOrganizationId: (input: Query.Input_packageOrganizationId) => {
    return registryPlugin.packageOrganizationId(input, client);
  },
  getPackage: (input: Query.Input_getPackage) => {
    return registryPlugin.getPackage(input, client);
  },
  buildPackageInfo: (input: Query.Input_buildPackageInfo) => {
    return registryPlugin.buildPackageInfo(input, client);
  },
  versionExists: (input: Query.Input_versionExists) => {
    return registryPlugin.versionExists(input, client);
  },
  versionLocation: (input: Query.Input_versionLocation) => {
    return registryPlugin.versionLocation(input, client);
  },
  versionMetadata: (input: Query.Input_versionMetadata) => {
    return registryPlugin.versionMetadata(input, client);
  },
  versionBuildMetadata: (input: Query.Input_versionBuildMetadata) => {
    return registryPlugin.versionBuildMetadata(input, client);
  },
  version: (input: Query.Input_version) => {
    return registryPlugin.version(input, client);
  },
  latestReleaseNode: (input: Query.Input_latestReleaseNode) => {
    return registryPlugin.latestReleaseNode(input, client);
  },
  latestPrereleaseNode: (input: Query.Input_latestPrereleaseNode) => {
    return registryPlugin.latestPrereleaseNode(input, client);
  },
  latestReleaseLocation: (input: Query.Input_latestReleaseLocation) => {
    return registryPlugin.latestReleaseLocation(input, client);
  },
  latestPrereleaseLocation: (input: Query.Input_latestPrereleaseLocation) => {
    return registryPlugin.latestPrereleaseLocation(input, client);
  },
});

export const mutation = (
  registryPlugin: RegistryPlugin,
  client: Client
): Mutation.Module => ({
  publishVersion: (input: Mutation.Input_publishVersion) => {
    return registryPlugin.publishVersion(input, client);
  },
  claimOrganizationOwnership: (
    input: Mutation.Input_claimOrganizationOwnership
  ) => {
    return registryPlugin.claimOrganizationOwnership(input, client);
  },
  transferOrganizationOwnership: (
    input: Mutation.Input_transferOrganizationOwnership
  ) => {
    return registryPlugin.transferOrganizationOwnership(input, client);
  },
  setOrganizationController: (
    input: Mutation.Input_setOrganizationController
  ) => {
    return registryPlugin.setOrganizationController(input, client);
  },
  transferOrganizationControl: (
    input: Mutation.Input_transferOrganizationControl
  ) => {
    return registryPlugin.transferOrganizationControl(input, client);
  },
  registerPackage: (input: Mutation.Input_registerPackage) => {
    return registryPlugin.registerPackage(input, client);
  },
  setPackageOwner: (input: Mutation.Input_setPackageOwner) => {
    return registryPlugin.setPackageOwner(input, client);
  },
  transferPackageOwnership: (
    input: Mutation.Input_transferPackageOwnership
  ) => {
    return registryPlugin.transferPackageOwnership(input, client);
  },
  setPackageController: (input: Mutation.Input_setPackageController) => {
    return registryPlugin.setPackageController(input, client);
  },
  transferPackageControl: (input: Mutation.Input_transferPackageControl) => {
    return registryPlugin.transferPackageControl(input, client);
  },
});
