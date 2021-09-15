// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@ensdomains/ens-contracts/contracts/ethregistrar/BaseRegistrarImplementation.sol";

contract TestEthRegistrar is BaseRegistrarImplementation {
  constructor(ENS _ens, bytes32 _baseNode)
    public
    BaseRegistrarImplementation(_ens, _baseNode)
  {}
}
