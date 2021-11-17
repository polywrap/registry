// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

error VersionNotFullLength();
error ReleaseIdentifierMustBeNumeric();
error VersionAlreadyPublished();
error TooManyIdentifiers();

abstract contract RegistryV1 is OwnableUpgradeable {
  event OwnershipUpdated(
    bytes32 indexed domainRegistryNode,
    bytes32 packageId,
    bytes32 domainRegistry,
    address indexed owner
  );

  event VersionPublished(
    bytes32 indexed packageId,
    bytes32 indexed versionId,
    string location
  );

  struct VersionNode {
    bool leaf;
    bool created;
    uint8 level;
    uint256 latestPrereleaseVersion;
    uint256 latestReleaseVersion;
    string location;
  }

  struct PackageInfo {
    address owner;
    bytes32 domainRegistryNode;
    bytes32 domainRegistry;
  }

  mapping(bytes32 => PackageInfo) public packages;
  mapping(bytes32 => VersionNode) public versionNodes;
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
    bytes memory version,
    string memory location
  ) public returns (bytes32) {
    // assert(msg.sender == versionPublisher);

    VersionNode storage node = versionNodes[packageId];

    //Checking this saves gas    
    if(!node.created) {
      node.created = true;
    }

    bytes32 nodeId = packageId;

    uint256 pointer;
    uint256 identifier;
    uint256 cnt;
    bool newNodeCreated;
    uint8 level;

    assembly {
      pointer := version
    }
    
    //32 bytes per identifier, 3 * 32 = 96
    //A proper version requires at least 3 identifiers (major, minor, patch)
    if(version.length < 96) {
      revert VersionNotFullLength();
    }

    //level is used for identifier numbering
    //level is an uint8 which has a max value of 255
    //8160 = 32 * 255
    if(version.length > 8160) {
      revert TooManyIdentifiers();
    }

    //If a version has more than 3 identifiers then it's a prerelease
    bool isPrerelease = version.length > 96;

    while(cnt < version.length) {
      assembly {
        pointer := add(pointer, 32)
        identifier := mload(pointer)
      }
      cnt += 32;
      level += 1;

      //The first byte of the identifier is a bool indicating if the version is alphanumeric
      //Use a mask uint256(2 ** 248) = 0x0100..00 to sanitize the first byte to 0 or 1
      //Discard the first 8 bits to get the value of the identifier
      //Then concat the two numbers(1. byte and last 31 bytes) with bitwise OR
      identifier = (identifier & uint256(2 ** 248)) | (uint256(uint248(identifier)));

      if(cnt <= 96 && bytes32(identifier)[0] != 0) {
        revert ReleaseIdentifierMustBeNumeric();
      }

      //Numeric identifier are always lower than alphanumeric ones
      //Alphanumeric identifiers are ordered lexically in utf-8 order
      if (node.latestPrereleaseVersion < identifier) {
        node.latestPrereleaseVersion = identifier;
      }

      if (!isPrerelease && node.latestReleaseVersion < identifier) {
        node.latestReleaseVersion = identifier;
      }

      nodeId = keccak256(abi.encodePacked(nodeId, identifier));

      //Checking this saves gas    
      if(node.leaf) {
        node.leaf = false;
      }
      node = versionNodes[nodeId];

      if(!node.created) {
        node.created = true;
        newNodeCreated = true;
        node.level = level;
      }
    }

    //If there's already a location specified, it means that the version is already published
    if(bytes(node.location).length != 0) {
      revert VersionAlreadyPublished();
    }

    node.location = location;

    //If a new node was created, then it doesn't have children and is a leaf node
    if(newNodeCreated) {
      node.leaf = true;
    }

    emit VersionPublished(
      packageId,
      nodeId,
      location
    );

    return nodeId;
  }

  function getPackageOwner(bytes32 packageId) public view returns (address) {
    return packages[packageId].owner;
  }
   
  function getVersionNode(bytes32 nodeId) public view returns (
    bool leaf,
    bool created,
    uint8 level,
    uint256 latestPrereleaseVersion,
    uint256 latestReleaseVersion,
    string memory location
  ) {
    VersionNode memory node = versionNodes[nodeId];

    return (node.leaf, node.created, node.level, node.latestPrereleaseVersion, node.latestReleaseVersion, node.location);
  }
}
