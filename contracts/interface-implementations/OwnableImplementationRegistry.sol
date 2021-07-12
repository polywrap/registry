// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./ImplementationRegistry.sol";

abstract contract OwnableImplementationRegistry is
  OwnableUpgradeable,
  ImplementationRegistry
{}
