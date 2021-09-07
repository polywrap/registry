// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IDomainRegistrarLink {
  function getPolywrapOwner(bytes32 domainRegistrarNode)
    external
    view
    returns (address);
}
