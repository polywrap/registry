// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IDomainRegistryLinkV1 {
  function getDomainOwner(bytes32 domainRegistryNode)
    external
    view
    returns (address);
}
