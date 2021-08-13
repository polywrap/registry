// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

abstract contract Registry is OwnableUpgradeable {
  event OwnershipUpdated(
    bytes32 indexed domainRegistryNode,
    bytes32 packageId,
    bytes32 domainRegistry,
    address indexed owner
  );

  event VersionPublished(
    bytes32 indexed packageId,
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
    bytes32 domainRegistryNode;
    bytes32 domainRegistry;
  }

  mapping(bytes32 => PackageVersion) public versionNodes;
  mapping(bytes32 => PackageInfo) public packages;
  address public ownershipUpdater;
  address public versionPublisher;

  constructor() {
    initialize();
  }

  function initialize() public initializer {
    __Ownable_init();
  }

  function updateOwnershipUpdater(address _ownershipUpdater) public onlyOwner {
    ownershipUpdater = _ownershipUpdater;
  }

  function updateVersionPublisher(address _versionPublisher) public onlyOwner {
    versionPublisher = _versionPublisher;
  }

  function updateOwnership(
    bytes32 domainRegistry,
    bytes32 domainRegistryNode,
    address domainOwner
  ) public {
    assert(msg.sender == ownershipUpdater);

    bytes32 packageId = keccak256(
      abi.encodePacked(
        keccak256(abi.encodePacked(domainRegistryNode)),
        domainRegistry
      )
    );

    packages[packageId] = PackageInfo(
      domainOwner,
      domainRegistryNode,
      domainRegistry
    );

    emit OwnershipUpdated(
      domainRegistryNode,
      packageId,
      domainRegistry,
      domainOwner
    );
  }

  function publishVersion(
    bytes32 packageId,
    uint256 majorVersion,
    uint256 minorVersion,
    uint256 patchVersion,
    string memory location
  ) public returns (bytes32) {
    bytes32 majorNodeId = keccak256(abi.encodePacked(packageId, majorVersion));
    bytes32 minorNodeId = keccak256(
      abi.encodePacked(majorNodeId, minorVersion)
    );
    bytes32 patchNodeId = keccak256(
      abi.encodePacked(minorNodeId, patchVersion)
    );

    PackageVersion storage packageNode = versionNodes[packageId];
    PackageVersion storage majorNode = versionNodes[majorNodeId];
    PackageVersion storage minorNode = versionNodes[minorNodeId];

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

    require(!versionNodes[patchNodeId].created, "Version is already published");

    versionNodes[patchNodeId] = PackageVersion(true, 0, true, location);

    emit VersionPublished(
      packageId,
      majorVersion,
      minorVersion,
      patchVersion,
      location
    );

    return patchNodeId;
  }

  function getPackageOwner(bytes32 packageId) public view returns (address) {
    return packages[packageId].owner;
  }
}
