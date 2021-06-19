// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/profiles/TextResolver.sol";
import "./interfaces/IVersionRegistry.sol";
import "./VersionResolver.sol";

abstract contract VersionRegistry is
  IVersionRegistry,
  OwnableUpgradeable,
  VersionResolver
{
  constructor(ENS _ens, TextResolver _ensTextResolver)
    internal
    VersionResolver(_ens, _ensTextResolver)
  {}

  function initialize() public initializer {
    __Ownable_init();
  }
}
