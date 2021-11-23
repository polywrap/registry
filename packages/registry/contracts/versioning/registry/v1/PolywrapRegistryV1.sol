// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./OrganizationOwnershipManagerV1.sol";

contract PolywrapRegistryV1 is OrganizationOwnershipManagerV1 {
  constructor(
    bytes32[] memory _domainRegistries,
    address[] memory _domainRegistryLinks
  ) OrganizationOwnershipManagerV1(_domainRegistries, _domainRegistryLinks) {

  }
}
