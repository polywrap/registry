// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./VersionManager.sol";

abstract contract OwnableVersionRegistry is OwnableUpgradeable, VersionManager {
  function initialize() public initializer {
    __Ownable_init();
  }
}
