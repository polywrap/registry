// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "../interfaces/IDomainRegistryLinkV1.sol";

contract EnsLinkV1 is IDomainRegistryLinkV1 {

  ENS internal ens;

  constructor(ENS _ens) {
    ens = _ens;
  }

  function getDomainOwner(bytes32 domainRegistryNode)
    public
    view
    override
    returns (address)
  {
    return ens.owner(domainRegistryNode);
  }
}
