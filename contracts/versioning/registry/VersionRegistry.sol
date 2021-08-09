// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../domain-registrars/IDomainRegistrarLink.sol";

abstract contract VersionRegistry is OwnableUpgradeable {
  event OwnershipUpdated(
    bytes32 indexed registrarNode,
    bytes32 packageId,
    bytes32 registrar,
    address indexed owner
  );

  event VersionPublished(
    bytes32 indexed packageId,
    bytes32 versionId,
    uint256 major,
    uint256 minor,
    uint256 patch,
    string location
  );

  struct PackageVersion {
    bool leaf;
    uint256 latestSubVersion;
    bool created;
    string location; // empty on non-leaf nodes
  }

  struct PackageInfo {
    address owner;
    bytes32 domainRegistrarNode;
    bytes32 domainRegistrar;
  }

  mapping(bytes32 => PackageVersion) public nodes;
  mapping(bytes32 => PackageInfo) public packages;
  mapping(bytes32 => address) public domainRegistrarLinks;
  address public trustedOwnershipOverrider;

  constructor(
    bytes32[] memory domainRegistrars,
    address[] memory domainRegistrarAddresses
  ) {
    initialize(domainRegistrars, domainRegistrarAddresses);
  }

  function initialize(
    bytes32[] memory domainRegistrars,
    address[] memory domainRegistrarAddresses
  ) public initializer {
    __Ownable_init();

    require(
      domainRegistrars.length == domainRegistrarAddresses.length,
      "Parameter arrays must have the same length"
    );

    for (uint256 i = 0; i < domainRegistrars.length; i++) {
      domainRegistrarLinks[domainRegistrars[i]] = domainRegistrarAddresses[i];
    }
  }

  function connectDomainRegistrarLink(
    bytes32 domainRegistrar,
    address domainRegistrarAddress
  ) public onlyOwner {
    domainRegistrarLinks[domainRegistrar] = domainRegistrarAddress;
  }

  function updateOwnership(bytes32 domainRegistrar, bytes32 domainRegistrarNode)
    public
  {
    bytes32 packageId = keccak256(
      abi.encodePacked(
        keccak256(abi.encodePacked(domainRegistrarNode)),
        domainRegistrar
      )
    );

    address domainRegistrarLinkAddress = domainRegistrarLinks[domainRegistrar];

    require(
      domainRegistrarLinkAddress != address(0),
      "Domain registrar is not supported"
    );

    IDomainRegistrarLink drApi = IDomainRegistrarLink(
      domainRegistrarLinkAddress
    );

    address owner = drApi.getPolywrapOwner(domainRegistrarNode);
    packages[packageId] = PackageInfo(
      owner,
      domainRegistrarNode,
      domainRegistrar
    );

    emit OwnershipUpdated(
      domainRegistrarNode,
      packageId,
      domainRegistrar,
      owner
    );
  }

  function overrideOwnership(
    bytes32 domainRegistrar,
    bytes32 domainRegistrarNode,
    address domainOwner
  ) public {
    require(msg.sender == trustedOwnershipOverrider);

    bytes32 packageId = keccak256(
      abi.encodePacked(
        keccak256(abi.encodePacked(domainRegistrarNode)),
        domainRegistrar
      )
    );

    packages[packageId] = PackageInfo(
      domainOwner,
      domainRegistrarNode,
      domainRegistrar
    );

    emit OwnershipUpdated(
      domainRegistrarNode,
      packageId,
      domainRegistrar,
      owner
    );
  }

  function internalPublishVersion(
    bytes32 packageId,
    bytes32 proposedVersionId,
    uint256 majorVersion,
    uint256 minorVersion,
    uint256 patchVersion,
    string memory location,
    bytes32[] merkleProof,
    uint256 verifiedVersionIndex
  ) internal {
    PackageVersion storage packageNode = nodes[packageId];

    bytes32 majorNodeId = keccak256(abi.encodePacked(packageId, majorVersion));
    PackageVersion storage majorNode = nodes[majorNodeId];

    bytes32 minorNodeId = keccak256(
      abi.encodePacked(majorNodeId, minorVersion)
    );
    PackageVersion storage minorNode = nodes[minorNodeId];

    bytes32 patchNodeId = keccak256(
      abi.encodePacked(minorNodeId, patchVersion)
    );

    if (packageNode.latestSubVersion < majorVersion) {
      packageNode.latestSubVersion = majorVersion;
    }
    packageNode.created = true;

    if (majorNode.latestSubVersion < minorVersion) {
      majorNode.latestSubVersion = minorVersion;
    }
    majorNode.created = true;

    if (minorNode.latestSubVersion < patchVersion) {
      minorNode.latestSubVersion = patchVersion;
    }
    minorNode.created = true;

    require(!nodes[patchNodeId].created, "Version is already published");

    nodes[patchNodeId] = PackageVersion(true, 0, true, location);

    require(
      proposedVersionId == keccak256(abi.encodePacked(patchNodeId, location)),
      "Proposed version ID does not match the patch version and location pair"
    );

    emit VersionPublished(
      packageId,
      patchNodeId,
      majorVersion,
      minorVersion,
      patchVersion,
      location
    );
  }
}
