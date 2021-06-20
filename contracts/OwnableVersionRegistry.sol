// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "./VersionManager.sol";

abstract contract OwnableVersionRegistry is OwnableUpgradeable, VersionManager {
  constructor(ENS _ens) internal VersionManager(_ens) {}

  function initialize() public initializer {
    __Ownable_init();
  }
}
