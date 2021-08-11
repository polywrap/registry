// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Registrar.sol";

contract PolywrapRegistrar is Registrar {
  constructor(address _registry, address _votingMachine)
    Registrar(_registry, _votingMachine)
  {}
}
