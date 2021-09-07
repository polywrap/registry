// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../interfaces/IDomainRegistryLink.sol";

contract TestLink is IDomainRegistryLink {
  string internal constant POLYWRAP_OWNER_RECORD_NAME = "polywrap-owner";

  function getPolywrapOwner(bytes32 domainRegistryNode)
    public
    view
    override
    returns (address)
  {
    //Using the transaction origin the caller account will be the owner
    //This allows us to not need a "Test" domain registry to test custom link contracts
    return tx.origin;
  }
}
