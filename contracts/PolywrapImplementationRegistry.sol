// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ImplementationRegistry.sol";

contract PolywrapImplementationRegistry is ImplementationRegistry {
  constructor(PolywrapRegistry _versionRegistry)
    public
    ImplementationRegistry(_versionRegistry)
  {}
}
