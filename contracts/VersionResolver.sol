// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./interfaces/IVersionRegistry.sol";
import "./VersionManager.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

abstract contract VersionResolver is
  IVersionRegistry,
  OwnableUpgradeable,
  VersionManager
{
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
}
