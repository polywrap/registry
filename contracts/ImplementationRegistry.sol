// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./PolywrapVersionRegistry.sol";
import "./interfaces/IImplementationRegistry.sol";

abstract contract ImplementationRegistry is IImplementationRegistry {
  mapping(bytes32 => string[]) public interfaceToImplementations;

  PolywrapVersionRegistry public versionRegistry;

  constructor(PolywrapVersionRegistry _versionRegistry) internal {
    versionRegistry = _versionRegistry;
  }

  function registerImplementation(
    bytes32 interfaceApiId,
    string calldata implementationUri
  ) public override authorized(interfaceApiId) {
    interfaceToImplementations[interfaceApiId].push(implementationUri);

    emit ImplementationRegistered(interfaceApiId, implementationUri);
  }

  function registerImplementations(
    bytes32 interfaceApiId,
    string[] calldata implementationUris
  ) public override authorized(interfaceApiId) {
    for (uint256 i = 0; i < implementationUris.length; i++) {
      string memory implementationUri = implementationUris[i];

      interfaceToImplementations[interfaceApiId].push(implementationUri);
      emit ImplementationRegistered(interfaceApiId, implementationUri);
    }
  }

  function overwriteImplementations(
    bytes32 interfaceApiId,
    string[] calldata implementationUris
  ) public override authorized(interfaceApiId) {
    delete interfaceToImplementations[interfaceApiId];

    for (uint256 i = 0; i < implementationUris.length; i++) {
      string memory implementationUri = implementationUris[i];

      interfaceToImplementations[interfaceApiId].push(implementationUri);
      emit ImplementationRegistered(interfaceApiId, implementationUri);
    }
  }

  function getImplementations(bytes32 interfaceApiId)
    public
    view
    override
    returns (string[] memory)
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
