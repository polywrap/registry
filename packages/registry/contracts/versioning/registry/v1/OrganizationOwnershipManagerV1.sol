// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./interfaces/IOrganizationOwnershipManager.sol";
import "./interfaces/IOrganizationRegistry.sol";
import "../../domain-registries/interfaces/IDomainRegistryLinkV1.sol";

error OnlyDomainRegistryController();
error DomainRegistryNotSupported();

contract OrganizationOwnershipManagerV1 is OwnableUpgradeable, IOrganizationOwnershipManager {
	
	address public organizationRegistry;
  mapping(bytes32 => address) public domainRegistryLinks;

	function setOrganizationRegistry(address organizationRegistryAddress) public virtual override {
		organizationRegistry = organizationRegistryAddress;
	}
	
	function claimOrganizationOwnership(bytes32 domainRegistry, bytes32 domainRegistryNode, address newOrganizationOwner) public virtual override {
    address domainOwner = domainOwner(domainRegistry, domainRegistryNode);

    if(domainOwner != msg.sender) {
      revert OnlyDomainRegistryController();
    }

    bytes32 organizationId = keccak256(abi.encodePacked(domainRegistry, domainRegistryNode));

    IOrganizationRegistry(organizationRegistry).claimOrganization(
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