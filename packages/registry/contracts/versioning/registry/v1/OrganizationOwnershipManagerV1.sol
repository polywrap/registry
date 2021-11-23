// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./interfaces/IOrganizationOwnershipManager.sol";
import "./interfaces/IOrganizationRegistry.sol";
import "../../domain-registries/interfaces/IDomainRegistryLinkV1.sol";
import "./VersionResolverV1.sol";

error OnlyDomainRegistryOwner();
error DomainRegistryNotSupported();

abstract contract OrganizationOwnershipManagerV1 is VersionResolverV1, IOrganizationOwnershipManager {
  mapping(bytes32 => address) public domainRegistryLinks;

  constructor(
    bytes32[] memory _domainRegistries,
    address[] memory _domainRegistryLinks
  ) VersionResolverV1() {
    require(
      _domainRegistries.length == _domainRegistryLinks.length,
      "Registry arrays must have the same length"
    );

    for (uint256 i = 0; i < _domainRegistries.length; i++) {
      domainRegistryLinks[_domainRegistries[i]] = _domainRegistryLinks[i];
    }
  }

	function claimOrganizationOwnership(bytes32 domainRegistry, bytes32 domainRegistryNode, address newOrganizationOwner) public virtual override {
    address domainOwner = domainOwner(domainRegistry, domainRegistryNode);

    if(msg.sender != domainOwner) {
      revert OnlyDomainRegistryOwner();
    }

    bytes32 organizationId = keccak256(abi.encodePacked(domainRegistry, domainRegistryNode));

    claimOrganization(
      organizationId,
      newOrganizationOwner
    );

		emit OrganizationOwnershipClaimed(domainRegistry, domainRegistryNode, domainOwner, newOrganizationOwner);
	}
	
	function domainOwner(bytes32 domainRegistry, bytes32 domainRegistryNode) public virtual override view returns (address) {
		address domainRegistryLinkAddress = domainRegistryLinks[domainRegistry];

    if(domainRegistryLinkAddress == address(0)) {
			revert DomainRegistryNotSupported();
		}

    return
      IDomainRegistryLinkV1(domainRegistryLinkAddress).getDomainOwner(
        domainRegistryNode
      );
	}
}