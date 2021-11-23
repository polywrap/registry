// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IPackageRegistry {
	event PackageOwnerChanged(bytes32 packageId, address indexed previousOwner, address indexed newOwner);
	event PackageControllerChanged(bytes32 packageId, address indexed previousController, address indexed newController);

	function setPackageOwner(bytes32 packageId, address owner) external virtual;
	function setPackageController(bytes32 packageId, address controller) external virtual;
	function setPackageOwnerAndController(bytes32 packageId, address owner, address controller) external virtual;
  function packageOwner(bytes32 packageId) external virtual view returns (address);
	function packageController(bytes32 packageId) external virtual view returns (address);
  function packageExists(bytes32 packageId) external virtual view returns (bool);
	function package(bytes32 packageId) external virtual view returns (bool exists, address owner, address controller);
}