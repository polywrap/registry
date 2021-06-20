// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "./VersionResolver.sol";

abstract contract VersionManager is VersionResolver {
  event AddApiManager(bytes32 indexed apiId, address indexed manager);
  event RemoveApiManager(bytes32 indexed apiId, address indexed manager);

  mapping(bytes32 => bool) public apiManagers;

  constructor(ENS _ens) internal VersionResolver(_ens) {}

  function addApiManager(bytes32 apiId, address manager)
    public
    apiOwner(apiId)
  {
    bytes32 key = keccak256(abi.encodePacked(apiId, manager));

    apiManagers[key] = true;

    emit AddApiManager(apiId, manager);
  }

  function removeApiManager(bytes32 apiId, address manager)
    public
    apiOwner(apiId)
  {
    bytes32 key = keccak256(abi.encodePacked(apiId, manager));

    apiManagers[key] = false;

    emit RemoveApiManager(apiId, manager);
  }

  function isAuthorized(bytes32 apiId, address ownerOrManager)
    public
    view
    override
    returns (bool)
  {
    uint256 ensNode = registeredAPI[apiId];

    require(ensNode != 0, "API is not registered");

    if (getPolywrapController(bytes32(ensNode)) == ownerOrManager) {
      return true;
    }

    bytes32 key = keccak256(abi.encodePacked(apiId, ownerOrManager));

    return apiManagers[key];
  }
}
