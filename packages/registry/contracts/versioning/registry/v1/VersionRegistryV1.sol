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
//Max count of identifiers is 16
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
error NoChangeMade();

abstract contract VersionRegistryV1 is PackageRegistryV1, IVersionRegistry {
  struct VersionNode {
    /*
    Contains:
      2 bits = empty;
      1 bit = exists;
      1 bit = leaf;
      4 bits = level;
      6 bits = empty
      1 bit = isLatestPrereleaseAlphanumeric
      120 bits = latestPrereleaseVersion;
      1 bit = isLatestReleaseAlphanumeric
      120 bits = latestReleaseVersion;
    */
    bytes32 versionMetadata;
    bytes32 buildMetadata;
    string location;
  }

  struct NodeInfo {
    bool exists;
    bool leaf;
    uint8 level;
    uint256 latestPrereleaseVersion; 
    uint256 latestReleaseVersion;
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
    bool hasMadeChange = false;

    NodeInfo memory nodeInfo = versionMetadata(packageId);
    
    if(!nodeInfo.exists) {
      hasMadeChange = true;
      nodeInfo.exists = true;
    }

    //First byte of the version array is the number of identifiers
    //level is used for numbering nodes/identifiers from (0 - packageNode, 1 - major node/identifier, etc)
    //level is an 4 bit number (altough stored in uint8) which has a max value of 15
    //0x0f = 15
    if(version[0] > 0x0f) {
      revert TooManyIdentifiers();
    }

    //0x0F is 00001111 in binary
    //We sanitize the byte before we get the identifier count
    uint8 identifierCnt = uint8(version[0] & 0x0F);

    //32 bytes per identifier, 3 * 32 = 96
    //A proper version requires at least 3 identifiers (major, minor, patch)
    if(identifierCnt < 3) {
      revert VersionNotFullLength();
    }

    nodeId = packageId;
    bool lastNodeCreated = false;
    {
      uint256 identifier;
      uint256 secondIdentifier;
      uint8 levelCnt;
      //If a version has more than 3 identifiers then it's a prerelease
      bool isPrerelease = identifierCnt > 3;
      bool isDevelopmentVersion = false;
      uint256 pointer;
      assembly {
        //First 32 bytes stores the length of the array, the next byte is the number of identifiers
        pointer := add(version, 33)
      }

      while(levelCnt < identifierCnt) {
      
        levelCnt += 1;

        if(levelCnt % 2 == 1) {
          assembly {
            identifier := mload(pointer)
            pointer := add(pointer, 32)
          }

          //Identifiers are 121 bits long 
          //They are store two by two in the version array (32 bytes for two identifiers)
          //The first bit of the identifier is a flag indicating if the version is alphanumeric
          secondIdentifier = identifier & 0x0000000000000000000000000000000001ffffffffffffffffffffffffffffff;
          identifier = identifier >> 121 & 0x0000000000000000000000000000000001ffffffffffffffffffffffffffffff;
        } else {
          identifier = secondIdentifier;
          secondIdentifier = 0x0;
        }
        //The next 120 bits is the numberic or alphanumeric value of the identifier
        //The byte at the 16th position (0 indexed) is the alphanumeric flag
        if(levelCnt <= 3 && bytes32(identifier)[16] != 0) {
          revert ReleaseIdentifierMustBeNumeric();
        }

        //If a version starts with 0 (0.x.x) then it's a development version
        if(levelCnt == 1 && identifier == 0) {
          isDevelopmentVersion = true;
        }

        //Numeric identifier are always lower (lower precedence) than alphanumeric ones
        //Alphanumeric identifiers are ordered lexically in ASCII order
        if (nodeInfo.latestPrereleaseVersion < identifier) {
          nodeInfo.latestPrereleaseVersion = identifier;
          hasMadeChange = true;
        }

        if (!isPrerelease && nodeInfo.latestReleaseVersion < identifier) {
          nodeInfo.latestReleaseVersion = identifier;
          hasMadeChange = true;
        }

        if(nodeInfo.leaf) {
          nodeInfo.leaf = false;
          hasMadeChange = true;
        }

        if(hasMadeChange) {
          setVersionMetadata(nodeId, nodeInfo);

          hasMadeChange = false;
        }

        nodeId = keccak256(abi.encodePacked(nodeId, identifier));
        nodeInfo = versionMetadata(nodeId);

        //If the node doesn't exist then create it
        if(!nodeInfo.exists) {
          nodeInfo.exists = true;
          hasMadeChange = true;
            
          //Check whether the identifier matches [0-9A-Za-z-]+
          if(!isSemverCompliantIdentifier(bytes32(identifier))) {
            revert InvalidIdentifier();
          }

          nodeInfo.level = levelCnt;

          //Check whether the identifier needs to be reset to 0 (when incrementing major or minor numbers)
          if(
            !isDevelopmentVersion &&
            (levelCnt == 2 || levelCnt == 3) && 
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
    }

    //If there's already a location specified, it means that the version is already published
    if(bytes(versionNodes[nodeId].location).length != 0) {
      revert VersionAlreadyPublished();
    }

    versionNodes[nodeId].location = location;
    packageVersionLists[packageId].push(nodeId);

    if(buildMetadata != 0x0) {
      //Unlike identifiers, build metadata is always alphanumeric, so it doesn't have the first byte to specify if it's numeric or alphanumeric
      if(!isSemverCompliantMetadataString(buildMetadata)) {
        revert InvalidBuildMetadata();
      }
      versionNodes[nodeId].buildMetadata = buildMetadata;
    }

    //If a new node was created, then it doesn't have children and is a leaf node
    if(lastNodeCreated) {
      nodeInfo.leaf = true;
    }

    setVersionMetadata(nodeId, nodeInfo);

    emit VersionPublished(
      packageId,
      nodeId,
      version,
      buildMetadata,
      location
    );

    return nodeId;
  }

  function versionMetadata(bytes32 versionNodeId) public view returns (
    NodeInfo memory nodeInfo
  ) {
    /*
    Contains:
      2 bits = empty;
      1 bit = exists;
      1 bit = leaf;
      4 bits = level;
      6 bits = empty
      1 bit = isLatestPrereleaseAlphanumeric
      120 bits = latestPrereleaseVersion;
      1 bit = isLatestReleaseAlphanumeric
      120 bits = latestReleaseVersion;
    */
    uint256 metadata = uint256(versionNodes[versionNodeId].versionMetadata);

    //First byte of metadata stores the exists flag, leaf flag and level number
    //00|1|1|1111|
    uint8 firstByte =  uint8(metadata >> 248);

    //0x0f = 00001111 in binary
    nodeInfo.level = firstByte & 0x0f; 
    nodeInfo.leaf = (firstByte >> 4) & 0x01  == 1
      ? true
      : false;
    nodeInfo.exists = (firstByte >> 5) & 0x01 == 1
      ? true
      : false; 

    nodeInfo.latestPrereleaseVersion = (metadata >> 121) & 0x0000000000000000000000000000000001ffffffffffffffffffffffffffffff; 
    nodeInfo.latestReleaseVersion = metadata & 0x0000000000000000000000000000000001ffffffffffffffffffffffffffffff; 
  }

  function setVersionMetadata(
    bytes32 nodeId,
    NodeInfo memory nodeInfo
  ) private {

    uint8 firstByte = nodeInfo.level
      | ((nodeInfo.leaf ? 1 : 0) << 4) 
      | ((nodeInfo.exists ? 1 : 0) << 5);
    
    uint256 metadata = uint256(firstByte) << 248
      | uint256(nodeInfo.latestReleaseVersion)
      | uint256(nodeInfo.latestPrereleaseVersion) << 121; 

    versionNodes[nodeId].versionMetadata = bytes32(metadata);
  }

  function isSemverCompliantIdentifier(bytes32 identifier) private view returns (bool) {
    //The identifier is numeric
    if(identifier[16] == 0) {
      return true;
    }
    
    //If the identifier is alphanumeric, then it can not start with a 0
    //This is used to cover the case when the whole identifier is 0 (apart from the first byte that indicates it being alphanumeric) 
    //since it's not caught by the isSemverCompliantIdentifierString function
    //The 16th byte position (0 indexed) is the alphanumeric flag
    //From the 17th to 31st byte position is the identifier
    if(identifier == 0x0000000000000000000000000000000001000000000000000000000000000000) {
      return false;
    }

    //The identifier is alphanumeric from index 1 to end
    return isSemverCompliantIdentifierString(uint256(identifier));
  }

  function isSemverCompliantIdentifierString(uint256 identifier) private view returns (bool) {
    bool foundZero = false;
    //20 characters
    uint256 charOffset = 0;
    uint256 bitOffset = 0;

    //Take only the last 120 bits which represent 20 characters with 6 bytes each
    identifier = identifier & 0x0000000000000000000000000000000000ffffffffffffffffffffffffffffff;

    while(charOffset < 20) {
      //6 bits per character
      bitOffset = charOffset * 6;
      //0x3f = 111111
      uint8 character = uint8(identifier >> bitOffset) & 0x3f;
      charOffset += 1;

      //If a character is 0x0 then the rest of the identifier should be 0x0
      if(character != 0) {
        foundZero = true;
        continue;
      }

      if(foundZero && character == 0) {
        return false;
      }
    }

    return true;
  }

  //A SemVer compliant string is an ASCII encoded string that satisfies the regex [0-9A-Za-z-]+
  //Returns true if the string is 0x0 which means empty
  function isSemverCompliantMetadataString(bytes32 identifier) private pure returns (bool) {
    bool foundZero = false;
    for(uint256 i = 0; i < 32; i++) {
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
  
  function versionLocation(bytes32 nodeId) public virtual override view returns (string memory) {
    return versionNodes[nodeId].location;
  }

  function versionBuildMetadata(bytes32 nodeId) public virtual override view returns (bytes32) {
    return versionNodes[nodeId].buildMetadata;
  }

  /**
   * @dev Get the details of a version node.
   * @param nodeId The ID of a version.
   * @return exists Boolean indicating whether or not the node exists.
   * @return leaf Boolean indicating whether the node is a leaf node (does not contain children).
   * @return level The level of the identifier for the node.
   * @return latestPrereleaseVersion The identifier of the latest prerelease version.
   * @return latestReleaseVersion The identifier of the latest release version.
   * @return buildMetadata Metadata for the build of the version.
   * @return location The IPFS hash where the contents of the version are stored.
   */
  function version(bytes32 nodeId) public view returns (
    bool exists,
    bool leaf,
    uint8 level,
    uint256 latestPrereleaseVersion,
    uint256 latestReleaseVersion,
    bytes32 buildMetadata,
    string memory location
  ) {
    NodeInfo memory nodeInfo = versionMetadata(nodeId);

    bytes32 a = versionBuildMetadata(nodeId);
    string memory b = versionLocation(nodeId);
    return (
      nodeInfo.exists, 
      nodeInfo.leaf,
      nodeInfo.level, 
      nodeInfo.latestPrereleaseVersion, 
      nodeInfo.latestReleaseVersion, 
      a,
      b
    );
  }

  function versionIds(bytes32 packageId, uint256 start, uint256 count) public virtual override view returns (bytes32[] memory) {
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

	function versionCount(bytes32 packageId) public virtual override view returns (uint256) {
    return packageVersionLists[packageId].length;
  }
}
