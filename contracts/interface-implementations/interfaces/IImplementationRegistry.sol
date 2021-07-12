// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IImplementationRegistry {
  event ImplementationRegistered(
    bytes32 indexed interfaceApiId,
    string implementationUri
  );

  //Adds the API to the list of implementations for the specified interface API
  function registerImplementation(
    bytes32 interfaceApiId,
    string calldata implementationUri
  ) external;

  //Adds multiple APIs to the list of implementations for the specified interface API
  function registerImplementations(
    bytes32 interfaceApiId,
    string[] calldata implementationUris
  ) external;

  //Overwites the list of implementations for the specified interface API with
  //a new list of APIs
  function overwriteImplementations(
    bytes32 interfaceApiId,
    string[] calldata implementationUris
  ) external;

  //Returns the list of implementations for the specified interface API with
  function getImplementations(bytes32 interfaceApiId)
    external
    returns (string[] memory);
}
