// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./domain-registrars/IDomainRegistrarLink.sol";

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

    IDomainRegistrarLink drApi = IDomainRegistrarLink(
      domainRegistrarLinks[domainRegistrar]
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

  function publishNewVersion(
    bytes32 packageId,
    uint256 majorVersion,
    uint256 minorVersion,
    uint256 patchVersion,
    string memory location
  ) public authorized(packageId) {
    PackageVersion storage packageNode = nodes[packageId];

    if (packageNode.latestSubVersion < majorVersion) {
      packageNode.latestSubVersion = majorVersion;
    }
    packageNode.created = true;

    bytes32 majorNodeId = keccak256(abi.encodePacked(packageId, majorVersion));
    PackageVersion storage majorNode = nodes[majorNodeId];
    if (majorNode.latestSubVersion < minorVersion) {
      majorNode.latestSubVersion = minorVersion;
    }
    majorNode.created = true;

    bytes32 minorNodeId = keccak256(
      abi.encodePacked(majorNodeId, minorVersion)
    );
    PackageVersion storage minorNode = nodes[minorNodeId];

    if (minorNode.latestSubVersion < patchVersion) {
      minorNode.latestSubVersion = patchVersion;
    }
    minorNode.created = true;

    bytes32 patchNodeId = keccak256(
      abi.encodePacked(minorNodeId, patchVersion)
    );

    require(!nodes[patchNodeId].created, "Version is already published");

    nodes[patchNodeId] = PackageVersion(true, 0, true, location);

    emit VersionPublished(
      packageId,
      patchNodeId,
      majorVersion,
      minorVersion,
      patchVersion,
      location
    );
  }

  function internalPublishNewVersion(
    bytes32 packageId,
    uint256 majorVersion,
    uint256 minorVersion,
    uint256 patchVersion,
    string memory location
  ) internal {
    PackageVersion storage packageNode = nodes[packageId];

    if (packageNode.latestSubVersion < majorVersion) {
      packageNode.latestSubVersion = majorVersion;
    }
    packageNode.created = true;

    bytes32 majorNodeId = keccak256(abi.encodePacked(packageId, majorVersion));
    PackageVersion storage majorNode = nodes[majorNodeId];
    if (majorNode.latestSubVersion < minorVersion) {
      majorNode.latestSubVersion = minorVersion;
    }
    majorNode.created = true;

    bytes32 minorNodeId = keccak256(
      abi.encodePacked(majorNodeId, minorVersion)
    );
    PackageVersion storage minorNode = nodes[minorNodeId];

    if (minorNode.latestSubVersion < patchVersion) {
      minorNode.latestSubVersion = patchVersion;
    }
    minorNode.created = true;

    bytes32 patchNodeId = keccak256(
      abi.encodePacked(minorNodeId, patchVersion)
    );

    require(!nodes[patchNodeId].created, "Version is already published");

    nodes[patchNodeId] = PackageVersion(true, 0, true, location);

    emit VersionPublished(
      packageId,
      patchNodeId,
      majorVersion,
      minorVersion,
      patchVersion,
      location
    );
  }

  function isAuthorized(bytes32 packageId, address ownerOrManager)
    public
    view
    virtual
    returns (bool);

  modifier packageOwner(bytes32 packageId) {
    PackageInfo memory packageInfo = packages[packageId];

    require(packageInfo.domainRegistrarNode != 0, "Package is not registered");

    require(
      packageInfo.owner == msg.sender,
      "You do not have access to the domain of this package"
    );
    _;
  }

  modifier authorized(bytes32 packageId) {
    require(
      isAuthorized(packageId, msg.sender),
      "You do not have access to this package"
    );
    _;
  }
}
