// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./interfaces/IVersionRegistry.sol";
import "./VersionResolver.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

abstract contract VersionRegistry is
  IVersionRegistry,
  OwnableUpgradeable,
  VersionResolver
{
  function initialize() public initializer {
    __Ownable_init();
  }
}
