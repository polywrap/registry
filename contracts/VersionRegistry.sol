// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "./VersionResolver.sol";

abstract contract VersionRegistry is OwnableUpgradeable, VersionResolver {
  constructor(ENS _ens) internal VersionResolver(_ens) {}

  function initialize() public initializer {
    __Ownable_init();
  }
}
