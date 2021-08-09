// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./VersionVerification.sol";

contract PolywrapRegistry is VersionVerification {
  constructor(
    bytes32[] memory domainRegistrars,
    address[] memory domainRegistrarAddresses
  ) VersionRegistry(domainRegistrars, domainRegistrarAddresses) {}
}
