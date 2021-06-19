// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/profiles/TextResolver.sol";
import "./interfaces/IVersionRegistry.sol";
import "./VersionManager.sol";

abstract contract VersionResolver is
  IVersionRegistry,
  OwnableUpgradeable,
  VersionManager
{
  constructor(ENS _ens, TextResolver _ensTextResolver)
    internal
    VersionManager(_ens, _ensTextResolver)
  {}

  function resolveToLeaf(bytes32 nodeId) public view returns (bytes32) {
    Web3APIVersion storage node = nodes[nodeId];
    require(node.created, "Invalid Node");

    if (node.leaf) {
      return nodeId;
    }

    bytes32 latestNodeId =
      keccak256(abi.encodePacked(nodeId, node.latestSubVersion));

    bytes32 leafNodeId = resolveToLeaf(latestNodeId);

    return leafNodeId;
  }

  function getPackageLocation(bytes32 nodeId)
    public
    view
    returns (string memory)
  {
    bytes32 concreteVersionId = resolveToLeaf(nodeId);
    Web3APIVersion storage node = nodes[concreteVersionId];

    string memory versionLocation = node.location;
    return versionLocation;
  }

  function resolveLatestMajorVersion(bytes32 apiId)
    public
    view
    returns (string memory)
  {
    bytes32 apiNodeId = keccak256(abi.encodePacked(apiId));

    return getPackageLocation(apiNodeId);
  }

  function resolveLatestMinorVersion(bytes32 apiId, uint256 major)
    public
    view
    returns (string memory)
  {
    bytes32 apiNodeId = keccak256(abi.encodePacked(apiId));

    bytes32 majorNodeId = keccak256(abi.encodePacked(apiNodeId, major));

    return getPackageLocation(majorNodeId);
  }

  function resolveLatestPatchVersion(
    bytes32 apiId,
    uint256 majorVersion,
    uint256 minorVersion
  ) public view returns (string memory) {
    bytes32 apiNodeId = keccak256(abi.encodePacked(apiId));

    bytes32 majorNodeId = getMajorNodeId(apiNodeId, majorVersion);
    bytes32 minorNodeId = getMinorNodeId(majorNodeId, minorVersion);

    return getPackageLocation(minorNodeId);
  }

  function resolveVersion(
    bytes32 apiId,
    uint256 majorVersion,
    uint256 minorVersion,
    uint256 patchVersion
  ) public view returns (string memory) {
    bytes32 apiNodeId = keccak256(abi.encodePacked(apiId));

    bytes32 majorNodeId = getMajorNodeId(apiNodeId, majorVersion);
    bytes32 minorNodeId = getMinorNodeId(majorNodeId, minorVersion);
    bytes32 patchNodeId = getPatchNodeId(minorNodeId, patchVersion);

    return getPackageLocation(patchNodeId);
  }
}
