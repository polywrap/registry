// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@ensdomains/ens-contracts/contracts/registry/ENSRegistry.sol";

contract TestENSRegistry is ENSRegistry {
  constructor(address owner) {
    records[0x0].owner = owner;
  } 
}
