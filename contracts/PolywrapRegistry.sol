// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "./VersionRegistry.sol";

contract PolywrapRegistry is VersionRegistry {
  constructor(ENS _ens) public VersionRegistry(_ens) {}
}
