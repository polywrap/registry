// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/profiles/TextResolver.sol";
import "./NodeIdResolver.sol";
import "./StringToAddressParser.sol";

abstract contract VersionManager is NodeIdResolver, StringToAddressParser {
  string polywrapControllerRecordName = "polywrap-controller";

  event NewWeb3API(bytes32 indexed apiId, bytes32 name);
  event NewVersion(
    bytes32 indexed apiId,
    bytes32 versionId,
    uint256 major,
    uint256 minor,
    uint256 patch,
    string location
  );

  struct Web3APIVersion {
    bool leaf;
    uint256 latestSubVersion;
    bool created;
    string location; // empty on non-leaf nodes
  }

  mapping(bytes32 => Web3APIVersion) public nodes;
  mapping(bytes32 => bool) public registeredAPI;

  ENS ens;
  TextResolver ensTextResolver;

  constructor(ENS _ens, TextResolver _ensTextResolver) internal {
    ens = _ens;
    ensTextResolver = _ensTextResolver;
  }

  function registerNewWeb3API(bytes32 domainName)
    public
    authorised(getApiId(domainName))
  {
    bytes32 id = getApiId(domainName);

    require(!registeredAPI[id], "API is already registered");

    registeredAPI[id] = true;

    emit NewWeb3API(id, domainName);
  }

  function getApiId(bytes32 domainName) internal pure returns (bytes32) {
    bytes32 rootEnsNode = 0x0;
    return keccak256(abi.encodePacked(rootEnsNode, domainName));
  }

  function publishNewVersion(
    bytes32 apiId,
    uint256 majorVersion,
    uint256 minorVersion,
    uint256 patchVersion,
    string memory location
  ) public authorised(apiId) {
    bytes32 apiNodeId = getApiNodeId(apiId);
    Web3APIVersion storage latestNode = nodes[apiNodeId];

    if (latestNode.latestSubVersion < majorVersion) {
      latestNode.latestSubVersion = majorVersion;
    }
    latestNode.created = true;

    bytes32 majorNodeId = getMajorNodeId(apiNodeId, majorVersion);
    Web3APIVersion storage majorNode = nodes[majorNodeId];
    if (majorNode.latestSubVersion < minorVersion) {
      majorNode.latestSubVersion = minorVersion;
    }
    majorNode.created = true;

    bytes32 minorNodeId = getMinorNodeId(majorNodeId, minorVersion);
    Web3APIVersion storage minorNode = nodes[minorNodeId];

    if (majorNode.latestSubVersion < minorVersion) {
      majorNode.latestSubVersion = minorVersion;
    }
    majorNode.created = true;

    if (minorNode.latestSubVersion < patchVersion) {
      minorNode.latestSubVersion = patchVersion;
    }
    minorNode.created = true;

    bytes32 patchNodeId = getPatchNodeId(minorNodeId, patchVersion);

    require(!nodes[patchNodeId].created, "Version is already published");

    nodes[patchNodeId] = Web3APIVersion(true, 0, true, location);

    emit NewVersion(
      apiId,
      patchNodeId,
      majorVersion,
      minorVersion,
      patchVersion,
      location
    );
  }

  modifier authorised(bytes32 apiId) {
    string memory ownerStr =
      ensTextResolver.text(apiId, polywrapControllerRecordName);

    require(
      bytesToAddress(ownerStr) == msg.sender,
      "You do not have access to the specified ENS domain"
    );
    _;
  }

  function aa(bytes32 domain) external view returns (address) {
    string memory ownerStr =
      ensTextResolver.text(getApiId(domain), polywrapControllerRecordName);

    return bytesToAddress(ownerStr);
  }
}
