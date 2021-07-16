// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./OwnableImplementationRegistry.sol";
import "../versioning/PolywrapVersionRegistry.sol";

contract PolywrapImplementationRegistry is OwnableImplementationRegistry {
  constructor(PolywrapVersionRegistry _versionRegistry)
    public
    ImplementationRegistry(_versionRegistry)
  {}
}
