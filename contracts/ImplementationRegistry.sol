// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./PolywrapRegistry.sol";
import "./interfaces/IImplementationRegistry.sol";

abstract contract ImplementationRegistry is IImplementationRegistry {
  mapping(bytes32 => bytes32[]) public interfaceToImplementations;

  PolywrapRegistry internal versionRegistry;

  constructor(PolywrapRegistry _versionRegistry) internal {
    versionRegistry = _versionRegistry;
  }

  function registerImplementation(
    bytes32 interfaceApiId,
    bytes32 implementationApiId
  ) public override authorized(interfaceApiId) {
    interfaceToImplementations[interfaceApiId].push(implementationApiId);

    emit ImplementationRegistered(interfaceApiId, implementationApiId);
  }

  function registerImplementations(
    bytes32 interfaceApiId,
    bytes32[] calldata implementationApiIds
  ) public override authorized(interfaceApiId) {
    for (uint256 i = 0; i < implementationApiIds.length; i++) {
      bytes32 implementationApiId = implementationApiIds[i];

      interfaceToImplementations[interfaceApiId].push(implementationApiId);
      emit ImplementationRegistered(interfaceApiId, implementationApiId);
    }
  }

  function overwriteImplementations(
    bytes32 interfaceApiId,
    bytes32[] calldata implementationApiIds
  ) public override authorized(interfaceApiId) {
    interfaceToImplementations[interfaceApiId] = implementationApiIds;
  }

  function getImplementations(bytes32 interfaceApiId)
    public
    view
    override
    returns (bytes32[] memory)
  {
    return interfaceToImplementations[interfaceApiId];
  }

  modifier authorized(bytes32 interfaceApiId) {
    require(
      versionRegistry.isAuthorized(interfaceApiId, msg.sender),
      "You do not have access to this interface API"
    );
    _;
  }
}
