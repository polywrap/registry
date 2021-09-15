pragma solidity ^0.8.4;

interface IOwnershipBridgeLink {
  function relayOwnership(
    bytes32 domainRegistrar,
    bytes32 domainRegistrarNode,
    address owner
  ) external;

  function receiveOwnership(
    bytes32 domainRegistrar,
    bytes32 domainRegistrarNode,
    address owner
  ) external;
}
