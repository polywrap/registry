// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "./VersionManager.sol";

abstract contract VersionResolver is OwnableUpgradeable, VersionManager {
  constructor(ENS _ens) internal VersionManager(_ens) {}

  function resolveToLeaf(bytes32 nodeId) public view returns (bytes32) {
    Web3APIVersion storage node = nodes[nodeId];
    require(node.created, "Invalid Node");

    if (node.leaf) {
      return nodeId;
    }

    bytes32 latestNodeId =
      keccak256(abi.encodePacked(nodeId, node.latestSubVersion));

    return resolveToLeaf(latestNodeId);
  }

  function getPackageLocation(bytes32 nodeId)
    public
    view
    returns (string memory)
  {
    bytes32 concreteVersionId = resolveToLeaf(nodeId);
    return nodes[concreteVersionId].location;
  }
}
