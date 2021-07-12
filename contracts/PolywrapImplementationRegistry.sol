// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ImplementationRegistry.sol";
import "./PolywrapVersionRegistry.sol";

contract PolywrapImplementationRegistry is ImplementationRegistry {
  constructor(PolywrapVersionRegistry _versionRegistry)
    public
    ImplementationRegistry(_versionRegistry)
  {}
}
