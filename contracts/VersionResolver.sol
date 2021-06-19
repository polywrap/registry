// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "./interfaces/IVersionRegistry.sol";
import "./VersionManager.sol";

abstract contract VersionResolver is
  IVersionRegistry,
  OwnableUpgradeable,
  VersionManager
{
  constructor(ENS _ens) internal VersionManager(_ens) {}

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

    return node.location;
  }

  function resolveLatestMajorVersion(bytes32 apiId)
    external
    view
    returns (string memory)
  {
    return getPackageLocation(apiId);
  }

  function resolveLatestMinorVersion(bytes32 apiId, uint256 major)
    public
    view
    returns (string memory)
  {
    bytes32 majorNodeId = keccak256(abi.encodePacked(apiId, major));

    return getPackageLocation(majorNodeId);
  }

  function resolveLatestPatchVersion(
    bytes32 apiId,
    uint256 majorVersion,
    uint256 minorVersion
  ) external view returns (string memory) {
    bytes32 majorNodeId = keccak256(abi.encodePacked(apiId, majorVersion));
    bytes32 minorNodeId =
      keccak256(abi.encodePacked(majorNodeId, minorVersion));

    return getPackageLocation(minorNodeId);
  }

  function resolveVersion(
    bytes32 apiId,
    uint256 majorVersion,
    uint256 minorVersion,
    uint256 patchVersion
  ) public view returns (string memory) {
    bytes32 majorNodeId = keccak256(abi.encodePacked(apiId, majorVersion));
    bytes32 minorNodeId =
      keccak256(abi.encodePacked(majorNodeId, minorVersion));
    bytes32 patchNodeId =
      keccak256(abi.encodePacked(minorNodeId, patchVersion));

    return getPackageLocation(patchNodeId);
  }
}
