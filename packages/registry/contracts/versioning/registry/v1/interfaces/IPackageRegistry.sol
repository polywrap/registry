// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IPackageRegistry {
	event OrganizationClaimed(bytes32 indexed organizationId, address indexed owner);
	event OrganizationOwnerChanged(bytes32 indexed organizationId, address indexed previousOwner, address indexed newOwner);
	event OrganizationControllerChanged(bytes32 indexed organizationId, address indexed previousController, address indexed newController);
	event PackageRegistered(bytes32 indexed organizationId, bytes32 indexed	packageId, bytes32 indexed packageName,	address packageOwner, address packageController);
	event PackageOwnerChanged(bytes32 packageId, address indexed previousOwner, address indexed newOwner);
	event PackageControllerChanged(bytes32 packageId, address indexed previousController, address indexed newController);

	function transferOrganizationOwnership(bytes32 organizationId, address newOwner) external;
	function setOrganizationController(bytes32 organizationId, address newController) external;
	function transferOrganizationControl(bytes32 organizationId, address newController) external;
	function registerPackage(bytes32 organizationId, bytes32 packageName, address packageOwner, address packageController) external;
	function setPackageOwner(bytes32 packageId, address newOwner) external;
	function transferPackageOwnership(bytes32 packageId, address newOwner) external;
	function setPackageController(bytes32 packageId, address newController) external;
	function transferPackageControl(bytes32 packageId, address newController) external ;
  function organizationOwner(bytes32 organizationId) external view returns (address);
	function organizationController(bytes32 organizationId) external view returns (address);
	function organizationExists(bytes32 organizationId) external view returns (bool);
	function organization(bytes32 organizationId) external view returns (bool exists, address owner, address controller);
	function organizationIds(uint256 start, uint256 count) external view returns (bytes32[] memory);
	function organizationCount() external view returns (uint256);
	function packageIds(bytes32 organizationId, uint256 start, uint256 count) external view returns (bytes32[] memory);
	function packageCount(bytes32 organizationId) external view returns (uint256);
	function packageOwner(bytes32 packageId) external view returns (address);
	function packageController(bytes32 packageId) external view returns (address);
  function packageExists(bytes32 packageId) external view returns (bool);
	function package(bytes32 packageId) external view returns (bool exists, address owner, address controller);
}