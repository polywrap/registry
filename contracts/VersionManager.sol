// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./NodeIdResolver.sol";

abstract contract VersionManager is NodeIdResolver {
  event NewWeb3API(uint256 indexed apiId, string name);
  event NewVersion(
    uint256 indexed apiId,
    uint256 versionId,
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

  mapping(uint256 => Web3APIVersion) public nodes;
  mapping(uint256 => bool) public registeredAPI;

  function registerNewWeb3API(string memory name) public {
    uint256 id = uint256(keccak256(bytes(name)));

    require(!registeredAPI[id], "API is already registered");

    registeredAPI[id] = true;

    emit NewWeb3API(id, name);
  }

  function publishNewVersion(
    uint256 apiId,
    uint256 majorVersion,
    uint256 minorVersion,
    uint256 patchVersion,
    string memory location
  ) public {
    uint256 apiNodeId = getApiNodeId(apiId);
    Web3APIVersion storage latestNode = nodes[apiNodeId];

    if (latestNode.latestSubVersion < majorVersion) {
      latestNode.latestSubVersion = majorVersion;
    }
    latestNode.created = true;

    uint256 majorNodeId = getMajorNodeId(apiNodeId, majorVersion);
    Web3APIVersion storage majorNode = nodes[majorNodeId];
    if (majorNode.latestSubVersion < minorVersion) {
      majorNode.latestSubVersion = minorVersion;
    }
    majorNode.created = true;

    uint256 minorNodeId = getMinorNodeId(majorNodeId, minorVersion);
    Web3APIVersion storage minorNode = nodes[minorNodeId];

    if (majorNode.latestSubVersion < minorVersion) {
      majorNode.latestSubVersion = minorVersion;
    }
    majorNode.created = true;

    if (minorNode.latestSubVersion < patchVersion) {
      minorNode.latestSubVersion = patchVersion;
    }
    minorNode.created = true;

    uint256 patchNodeId = getPatchNodeId(minorNodeId, patchVersion);
    Web3APIVersion storage patchNode = nodes[patchNodeId];

    require(!patchNode.created, "Version is already published");

    patchNode.leaf = true;
    patchNode.created = true;
    patchNode.location = location;

    emit NewVersion(
      apiId,
      patchNodeId,
      majorVersion,
      minorVersion,
      patchVersion,
      location
    );
  }
}
