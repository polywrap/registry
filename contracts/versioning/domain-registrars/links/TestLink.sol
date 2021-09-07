// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../IDomainRegistrarLink.sol";

contract TestLink is IDomainRegistrarLink {
  string internal constant POLYWRAP_OWNER_RECORD_NAME = "polywrap-owner";

  function getPolywrapOwner(bytes32 domainRegistrarNode)
    public
    view
    override
    returns (address)
  {
    //Using the transaction origin the caller account will be the owner
    //This allows us to not need a "Test" domain registrar to test custom link contracts
    return tx.origin;
  }
}
