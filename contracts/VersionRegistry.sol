// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./interfaces/IVersionRegistry.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract VersionRegistry is IVersionRegistry, OwnableUpgradeable {
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

  function initialize() public initializer {
    __Ownable_init();
  }

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

  function resolveToLeaf(uint256 nodeId) public view returns (uint256) {
    Web3APIVersion storage node = nodes[nodeId];
    require(node.created, "Invalid Node");

    if (node.leaf) {
      return nodeId;
    }

    uint256 latestNodeId =
      uint256(keccak256(abi.encodePacked(nodeId, node.latestSubVersion)));

    uint256 leafNodeId = resolveToLeaf(latestNodeId);

    return leafNodeId;
  }

  function getPackageLocation(uint256 nodeId)
    public
    view
    returns (string memory)
  {
    uint256 concreteVersionId = resolveToLeaf(nodeId);
    Web3APIVersion storage node = nodes[concreteVersionId];

    string memory versionLocation = node.location;
    return versionLocation;
  }

  function resolveLatestMajorVersion(uint256 apiId)
    public
    view
    returns (string memory)
  {
    uint256 apiNodeId = uint256(keccak256(abi.encodePacked(apiId)));

    return getPackageLocation(apiNodeId);
  }

  function resolveLatestMinorVersion(uint256 apiId, uint256 major)
    public
    view
    returns (string memory)
  {
    uint256 apiNodeId = uint256(keccak256(abi.encodePacked(apiId)));

    uint256 majorNodeId =
      uint256(keccak256(abi.encodePacked(apiNodeId, major)));

    return getPackageLocation(majorNodeId);
  }

  function resolveLatestPatchVersion(
    uint256 apiId,
    uint256 majorVersion,
    uint256 minorVersion
  ) public view returns (string memory) {
    uint256 apiNodeId = uint256(keccak256(abi.encodePacked(apiId)));

    uint256 majorNodeId = getMajorNodeId(apiNodeId, majorVersion);
    uint256 minorNodeId = getMinorNodeId(majorNodeId, minorVersion);

    return getPackageLocation(minorNodeId);
  }

  function resolveVersion(
    uint256 apiId,
    uint256 majorVersion,
    uint256 minorVersion,
    uint256 patchVersion
  ) public view returns (string memory) {
    uint256 apiNodeId = uint256(keccak256(abi.encodePacked(apiId)));

    uint256 majorNodeId = getMajorNodeId(apiNodeId, majorVersion);
    uint256 minorNodeId = getMinorNodeId(majorNodeId, minorVersion);
    uint256 patchNodeId = getPatchNodeId(minorNodeId, patchVersion);

    return getPackageLocation(patchNodeId);
  }

  function getApiNodeId(uint256 apiId) private pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked(apiId)));
  }

  function getMajorNodeId(uint256 apiNodeId, uint256 majorVersion)
    private
    pure
    returns (uint256)
  {
    return uint256(keccak256(abi.encodePacked(apiNodeId, majorVersion)));
  }

  function getMinorNodeId(uint256 majorNodeId, uint256 minorVersion)
    private
    pure
    returns (uint256)
  {
    return uint256(keccak256(abi.encodePacked(majorNodeId, minorVersion)));
  }

  function getPatchNodeId(uint256 minorNodeId, uint256 patchVersion)
    private
    pure
    returns (uint256)
  {
    return uint256(keccak256(abi.encodePacked(minorNodeId, patchVersion)));
  }
}
