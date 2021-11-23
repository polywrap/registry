// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IOrganizationRegistry {
	event OrganizationOwnershipManagerSet(address organizationOwnershipManager);
	event OrganizationClaimed(bytes32 indexed organizationId, address indexed owner);
	event OrganizationOwnerChanged(bytes32 indexed organizationId, address indexed previousOwner, address indexed newOwner);
	event OrganizationControllerChanged(bytes32 indexed organizationId, address indexed previousController, address indexed newController);
	event PackageRegistered(bytes32 indexed organizationId, bytes32 indexed	packageId, bytes32 indexed packageName,	address packageOwner);

	function setOrganizationOwnershipManager(address organizationOwnershipManagerAddress) external virtual;

	function claimOrganization(bytes32 organizationId, address owner) external virtual;
	function setOrganizationOwner(bytes32 organizationId, address owner) external virtual;
	function setOrganizationController(bytes32 organizationId, address controller) external virtual;
	function setOrganizationOwnerAndController(bytes32 organizationId, address owner, address controller) external virtual;
	function registerPackage(bytes32 organizationId, bytes32 packageName, address packageOwner) external virtual;
	function organizationOwner(bytes32 organizationId) external virtual view returns (address);
	function organizationController(bytes32 organizationId) external virtual view returns (address);
	function organizationExists(bytes32 organizationId) external virtual view returns (bool);
	function organization(bytes32 organizationId) external virtual view returns (bool exists, address owner, address controller);
	function listOrganizations(uint256 start, uint256 count) external virtual view returns (bytes32[] memory);
	function organizationCount() external virtual view returns (uint256);
	function listPackages(bytes32 organizationId, uint256 start, uint256 count) external virtual view returns (bytes32[] memory);
	function packageCount(bytes32 organizationId) external virtual view returns (uint256);
}