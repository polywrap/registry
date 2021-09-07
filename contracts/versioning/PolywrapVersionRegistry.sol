// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./VersionManager.sol";

contract PolywrapVersionRegistry is VersionManager {
  constructor(
    bytes32[] memory domainRegistrars,
    address[] memory domainRegistrarAddresses
  ) VersionRegistry(domainRegistrars, domainRegistrarAddresses) {}
}
