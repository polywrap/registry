// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "./OwnableVersionRegistry.sol";

contract PolywrapRegistry is OwnableVersionRegistry {
  constructor(ENS _ens) public VersionRegistry(_ens) {}
}
