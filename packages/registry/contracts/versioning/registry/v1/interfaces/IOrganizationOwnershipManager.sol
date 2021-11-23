// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IOrganizationOwnershipManager {
  event OrganizationOwnershipClaimed(bytes32 indexed domainRegistry, bytes32 indexed domainRegistryNode, address domainOwner, address newOrganizationOwner);

	function claimOrganizationOwnership(bytes32 domainRegistry, bytes32 domainRegistryNode, address newOrganizationOwner) external virtual;
	function domainOwner(bytes32 domainRegistry, bytes32 domainRegistryNode) external virtual view returns (address);
}