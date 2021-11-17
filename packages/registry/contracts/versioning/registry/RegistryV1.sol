// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

//Version requires at least major, minor and patch identifiers specified
error VersionNotFullLength();
//Major, minor and patch are release identifiers and they must be numeric (not alphanumeric)
error ReleaseIdentifierMustBeNumeric();
error VersionAlreadyPublished();
//Max count of identifiers is 255
error TooManyIdentifiers();
//Identifiers must satisfy [0-9A-Za-z-]+
error InvalidIdentifier();
//Build metadata must satisfy [0-9A-Za-z-]*
error InvalidBuildMetadata();

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
    bytes32 buildMetadata;
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
    //Array of byte32 identifiers
    bytes memory version,
    bytes32 buildMetadata,
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
      //Use a mask = 0x0100..00 to sanitize the first byte to 0 or 1
      //Discard the first 8 bits to get the value of the identifier
      //Then concat the two numbers(1. byte and last 31 bytes) with bitwise OR
      identifier = (identifier & 0x0100000000000000000000000000000000000000000000000000000000000000) 
        | (uint256(uint248(identifier)));

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
        if(!isSemverCompliantIdentifier(bytes32(identifier))) {
          revert InvalidIdentifier();
        }

        newNodeCreated = true;
        node.level = level;
      }
    }

    //If there's already a location specified, it means that the version is already published
    if(bytes(node.location).length != 0) {
      revert VersionAlreadyPublished();
    }

    node.location = location;

    if(buildMetadata != 0x0) {
      //Unlike identifiers, build metadata is alphanumeric, so it doesn't have the first byte to specify if it's numeric or alphanumeric
      if(!isSemverCompliantString(buildMetadata, 0)) {
        revert InvalidBuildMetadata();
      }
      node.buildMetadata = buildMetadata;
    }

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

  function isSemverCompliantIdentifier(bytes32 identifier) private view returns (bool) {
    //The identifier is numeric
    if(identifier[0] == 0) {
      return true;
    }

    //If the identifier is alphanumeric, then it can not start with a 0
    //This is used to cover the case when the whole identifier is 0 (apart from the first byte that indicates it being alphanumeric) 
    //since it's not caught by the isSemverCompliantString function
    if(identifier == 0x0100000000000000000000000000000000000000000000000000000000000000) {
      return false;
    }

    //The identifier is alphanumeric from index 1 to end
    return isSemverCompliantString(identifier, 1);
  }

  //A SemVer compliant string is an ASCII encoded string that satisfies the regex [0-9A-Za-z-]+
  //Returns true if the string is 0x0 which means empty
  function isSemverCompliantString(bytes32 identifier, uint256 startIndex) private pure returns (bool) {
    bool foundZero = false;
    for(uint256 i = startIndex; i < 32; i++) {
      //If a character is 0x0 then the rest of the identifier should be 0x0
      if(identifier[i] == 0) {
        foundZero = true;
        continue;
      }

      if(foundZero && identifier[i] != 0) {
        return false;
      }

      if(!(
          //0-9
          (identifier[i] >=0x30 && identifier[i] <= 0x39) || 
          //A-Z
          (identifier[i] >=0x41 && identifier[i] <= 0x5a) || 
          //a-z
          (identifier[i] >=0x61 && identifier[i] <= 0x7a) || 
          //Hyphen(-)
          identifier[i] == 0x2d
        )){
        return false;
      }
    }

    return true;
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
    bytes32 buildMetadata,
    string memory location
  ) {
    VersionNode memory node = versionNodes[nodeId];

    return (
      node.leaf,
      node.created, 
      node.level, 
      node.latestPrereleaseVersion, 
      node.latestReleaseVersion, 
      node.buildMetadata, 
      node.location
    );
  }
}
