// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IDomainRegistryLink {
  function getPolywrapOwner(bytes32 domainRegistryNode)
    external
    view
    returns (address);
}
