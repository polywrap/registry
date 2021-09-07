// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "../../../helpers/StringToAddressParser.sol";
import "../IDomainRegistrarLink.sol";

interface ITextResolverInterface {
  function setText(
    bytes32 node,
    string calldata key,
    string calldata value
  ) external;

  function text(bytes32 node, string calldata key)
    external
    view
    returns (string memory);
}

contract EnsLink is StringToAddressParser, IDomainRegistrarLink {
  string internal constant POLYWRAP_OWNER_RECORD_NAME = "polywrap-owner";

  ENS internal ens;

  constructor(ENS _ens) {
    ens = _ens;
  }

  function getPolywrapOwner(bytes32 domainRegistrarNode)
    public
    view
    override
    returns (address)
  {
    address textResolverAddr = ens.resolver(domainRegistrarNode);

    require(textResolverAddr != address(0), "Resolver not set");

    ITextResolverInterface ensTextResolver = ITextResolverInterface(
      textResolverAddr
    );

    return
      stringToAddress(
        ensTextResolver.text(domainRegistrarNode, POLYWRAP_OWNER_RECORD_NAME)
      );
  }
}
