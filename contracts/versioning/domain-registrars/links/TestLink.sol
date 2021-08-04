// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "../../../helpers/StringToAddressParser.sol";
import "../IDomainRegistrarLink.sol";

contract TestLink is IDomainRegistrarLink {
  string internal constant POLYWRAP_OWNER_RECORD_NAME = "polywrap-owner";

  function getPolywrapOwner(bytes32 domainRegistrarNode)
    public
    view
    override
    returns (address)
  {
    return msg.sender;
  }
}
