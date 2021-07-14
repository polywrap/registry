// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./VersionResolver.sol";

abstract contract VersionManager is VersionResolver {
  event ManagerAdded(bytes32 indexed packageId, address indexed manager);
  event ManagerRemoved(bytes32 indexed packageId, address indexed manager);

  mapping(bytes32 => bool) public managers;

  function addManager(bytes32 packageId, address manager)
    public
    packageOwner(packageId)
  {
    bytes32 key = keccak256(abi.encodePacked(packageId, manager));

    managers[key] = true;

    emit ManagerAdded(packageId, manager);
  }

  function removeManager(bytes32 packageId, address manager)
    public
    packageOwner(packageId)
  {
    bytes32 key = keccak256(abi.encodePacked(packageId, manager));

    managers[key] = false;

    emit ManagerRemoved(packageId, manager);
  }

  function isAuthorized(bytes32 packageId, address ownerOrManager)
    public
    view
    override
    returns (bool)
  {
    PackageInfo memory packageInfo = packages[packageId];

    require(packageInfo.ensNode != 0, "Package is not registered");

    bytes32 key = keccak256(abi.encodePacked(packageId, ownerOrManager));

    if (managers[key]) {
      return true;
    }

    return packageInfo.controller == ownerOrManager;
  }
}
