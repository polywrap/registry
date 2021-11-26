// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "hardhat/console.sol";
import "./interfaces/IVersionRegistry.sol";
import "./PackageRegistryV1.sol";

error OnlyTrustedVersionPublisher();
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
//When incrementing the major number, the minor and patch numbers must be reset to 0
//When incrementing the minor number, the patch number must be reset to 0
//Does not apply to development versions (0.x.x)
error IdentifierNotReset();
error OnlyPackageController();

abstract contract VersionRegistryV1 is PackageRegistryV1, IVersionRegistry {
  struct VersionNode {
    bool leaf;
    bool exists;
    uint8 level;
    uint256 latestPrereleaseVersion;
    uint256 latestReleaseVersion;
    bytes32 buildMetadata;
    string location;
  }

  mapping(bytes32 => VersionNode) versionNodes;
  mapping(bytes32 => bytes32[]) packageVersionLists;

  /**
   * @dev Constructs a new Registry.
   */
  constructor() {
    initialize();
  }

  function initialize() public initializer {
    __Ownable_init();
  }

  /**
   * @dev Publish a new version of a package.
   * @param packageId The ID of a package.
   * @param version The encoded bytes of a version string.
   * @param buildMetadata Metadata for the build of the version.
   * @param location The IPFS hash where the contents of the version are stored.
   * @return nodeId ID of the published version.
   */
  function publishVersion(
    bytes32 packageId,
    bytes memory version,
    bytes32 buildMetadata,
    string memory location
  ) public returns (bytes32 nodeId) {
    if(msg.sender != packages[packageId].controller) {
			revert OnlyPackageController();
		}

    VersionNode storage node = versionNodes[packageId];

    //Checking this saves gas    
    if(!node.exists) {
      node.exists = true;
    }

    //32 bytes per identifier, 3 * 32 = 96
    //A proper version requires at least 3 identifiers (major, minor, patch)
    if(version.length < 96) {
      revert VersionNotFullLength();
    }

    //level is used for numbering nodes/identifiers from (0 - packageNode, 1 - major node/identifier, etc)
    //level is an uint8 which has a max value of 255
    //8160 = 32 * 255
    if(version.length > 8160) {
      revert TooManyIdentifiers();
    }

    nodeId = packageId;
    uint256 pointer;
    uint256 identifier;
    uint256 cnt;
    uint8 level;
    //If a version has more than 3 identifiers then it's a prerelease
    bool isPrerelease = version.length > 96;
    bool lastNodeCreated = false;
    bool isDevelopmentVersion = false;

    assembly {
      pointer := version
    }

    while(cnt < version.length) {
      assembly {
        pointer := add(pointer, 32)
        identifier := mload(pointer)
      }
      cnt += 32;
      level += 1;

      //The first byte of the identifier is a boolean indicating if the version is alphanumeric
      //Use a mask = 0x0100..00 to sanitize the first byte to 0 or 1
      //Discard the first 8 bits to get the value of the identifier
      //Then concat the two numbers(1. byte and last 31 bytes) with bitwise OR
      identifier = (identifier & 0x0100000000000000000000000000000000000000000000000000000000000000) 
        | (uint256(uint248(identifier)));

      if(cnt <= 96 && bytes32(identifier)[0] != 0) {
        revert ReleaseIdentifierMustBeNumeric();
      }

      //If a version starts with 0 (0.x.x) then it's a development version
      if(level == 1 && identifier == 0) {
        isDevelopmentVersion = true;
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

      //If the node doesn't exist then create it
      if(!node.exists) {
        node.exists = true;
          
        //Check whether the identifier matches [0-9A-Za-z-]+
        if(!isSemverCompliantIdentifier(bytes32(identifier))) {
          revert InvalidIdentifier();
        }

        node.level = level;

        //Check whether the identifier needs to be reset to 0 (when incrementing major or minor numbers)
        if(
          !isDevelopmentVersion &&
          (level == 2 || level == 3) && 
          lastNodeCreated && 
          identifier != 0
        ) {
          revert IdentifierNotReset();
        }

        lastNodeCreated = true;
      } else {
        lastNodeCreated = false;
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
    if(lastNodeCreated) {
      node.leaf = true;
    }

    emit VersionPublished(
      packageId,
      nodeId,
      version,
      buildMetadata,
      location
    );

    return nodeId;
  }

  function isSemverCompliantIdentifier(bytes32 identifier) private pure returns (bool) {
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
  
  /**
   * @dev Get the details of a version node.
   * @param nodeId The ID of a version.
   * @return leaf Boolean indicating whether the node is a leaf node (does not contain children).
   * @return exists Boolean indicating whether or not the node exists.
   * @return level The level of the identifier for the node.
   * @return latestPrereleaseVersion The identifier of the latest prerelease version.
   * @return latestReleaseVersion The identifier of the latest release version.
   * @return buildMetadata Metadata for the build of the version.
   * @return location The IPFS hash where the contents of the version are stored.
   */
  function version(bytes32 nodeId) public view returns (
    bool leaf,
    bool exists,
    uint8 level,
    uint256 latestPrereleaseVersion,
    uint256 latestReleaseVersion,
    bytes32 buildMetadata,
    string memory location
  ) {
    VersionNode memory node = versionNodes[nodeId];

    return (
      node.leaf,
      node.exists, 
      node.level, 
      node.latestPrereleaseVersion, 
      node.latestReleaseVersion, 
      node.buildMetadata, 
      node.location
    );
  }

  function listVersions(bytes32 packageId, uint256 start, uint256 count) public virtual override view returns (bytes32[] memory) {
    bytes32[] memory versionList = packageVersionLists[packageId];

		uint256 versionListLength = versionList.length;
		
		uint256 len = start + count > versionListLength
			? versionListLength - start 
			: count;

		bytes32[] memory versionArray = new bytes32[](len);

		for(uint256 i = 0; i < len; i++) {
			versionArray[i] = versionList[start + i];
		}

		return versionArray;
	}

	function versionCount(bytes32 packageId) external virtual override view returns (uint256) {
    return packageVersionLists[packageId].length;
  }
}
