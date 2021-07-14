// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./VersionResolver.sol";

abstract contract VersionManager is VersionResolver {
  event ManagerAdded(bytes32 indexed apiId, address indexed manager);
  event ManagerRemoved(bytes32 indexed apiId, address indexed manager);

  mapping(bytes32 => bool) public apiManagers;

  function addApiManager(bytes32 apiId, address manager)
    public
    apiOwner(apiId)
  {
    bytes32 key = keccak256(abi.encodePacked(apiId, manager));

    apiManagers[key] = true;

    emit ManagerAdded(apiId, manager);
  }

  function removeApiManager(bytes32 apiId, address manager)
    public
    apiOwner(apiId)
  {
    bytes32 key = keccak256(abi.encodePacked(apiId, manager));

    apiManagers[key] = false;

    emit ManagerRemoved(apiId, manager);
  }

  function isAuthorized(bytes32 apiId, address ownerOrManager)
    public
    view
    override
    returns (bool)
  {
    ApiInfo memory apiInfo = registeredAPI[apiId];

    require(apiInfo.ensNode != 0, "API is not registered");

    bytes32 key = keccak256(abi.encodePacked(apiId, ownerOrManager));

    if (apiManagers[key]) {
      return true;
    }

    return apiInfo.controller == ownerOrManager;
  }
}
