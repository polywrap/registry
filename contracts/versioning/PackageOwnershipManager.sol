// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./registry/VersionRegistry.sol";
import "./token-bridge/PolywrapOwnershipBridgeLink.sol";
import "./token-bridge/PolywrapVerificationRootBridgeLink.sol";
import "./domain-registries/IDomainRegistryLink.sol";

contract PackageOwnershipManager is OwnableUpgradeable {
  address public registry;

  mapping(bytes32 => address) public domainRegistryLinks;

  mapping(bytes32 => bool) public allowedLocalDomainRegistries;
  mapping(bytes32 => address) public incomingBridgeLinks;
  mapping(bytes32 => address) public outgoingBridgeLinks;

  constructor(
    address _registry,
    bytes32[] memory domainRegistries,
    address[] memory domainRegistryAddresses
  ) {
    initialize(_registry, domainRegistries, domainRegistryAddresses);
  }

  function initialize(
    address _registry,
    bytes32[] memory domainRegistries,
    address[] memory domainRegistryAddresses
  ) public initializer {
    __Ownable_init();

    updateGlobalVars(_registry);

    require(
      domainRegistries.length == domainRegistryAddresses.length,
      "Registry arrays must have the same length"
    );

    for (uint256 i = 0; i < domainRegistries.length; i++) {
      domainRegistryLinks[domainRegistries[i]] = domainRegistryAddresses[i];
    }
  }

  function updateGlobalVars(address _registry) public {
    registry = _registry;
  }

  function connectDomainRegistryLink(
    bytes32 domainRegistry,
    address domainRegistryAddress
  ) public onlyOwner {
    domainRegistryLinks[domainRegistry] = domainRegistryAddress;
  }

  function updateOwnership(bytes32 domainRegistry, bytes32 domainRegistryNode)
    public
  {
    require(
      allowedLocalDomainRegistries[domainRegistry],
      "Domain registry is not allowed for local updates"
    );

    address owner = getPolywrapOwner(domainRegistry, domainRegistryNode);

    VersionRegistry(registry).updateOwnership(
      domainRegistry,
      domainRegistryNode,
      owner
    );
  }

  function relayOwnership(
    bytes32 blockchainName,
    bytes32 domainRegistry,
    bytes32 domainRegistryNode
  ) public {
    address bridgeLink = outgoingBridgeLinks[
      keccak256(abi.encodePacked(domainRegistry, blockchainName))
    ];

    require(
      bridgeLink != address(0),
      "Outgoing relay not supported for domain registry and blockchain"
    );

    address owner = getPolywrapOwner(domainRegistry, domainRegistryNode);

    PolywrapOwnershipBridgeLink(bridgeLink).relayOwnership(
      domainRegistry,
      domainRegistryNode,
      owner
    );
  }

  function receiveOwnership(
    bytes32 blockchainName,
    bytes32 domainRegistry,
    bytes32 domainRegistryNode,
    address owner
  ) public {
    address bridgeLink = incomingBridgeLinks[
      keccak256(abi.encodePacked(domainRegistry, blockchainName))
    ];

    require(
      bridgeLink != address(0),
      "Incoming relay not supported for domain registry and blockchain"
    );

    assert(msg.sender == bridgeLink);

    VersionRegistry(registry).updateOwnership(
      domainRegistry,
      domainRegistryNode,
      owner
    );
  }

  function getPolywrapOwner(bytes32 domainRegistry, bytes32 domainRegistryNode)
    public
    view
    returns (address)
  {
    bytes32 packageId = keccak256(
      abi.encodePacked(
        keccak256(abi.encodePacked(domainRegistryNode)),
        domainRegistry
      )
    );

    address domainRegistryLinkAddress = domainRegistryLinks[domainRegistry];

    require(
      domainRegistryLinkAddress != address(0),
      "Domain registry is not supported"
    );

    return
      IDomainRegistryLink(domainRegistryLinkAddress).getPolywrapOwner(
        domainRegistryNode
      );
  }
}
