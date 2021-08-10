// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./VersionRegistry.sol";

abstract contract VersionResolver is VersionRegistry {
  function resolveToLeaf(bytes32 versionNodeId) public view returns (bytes32) {
    PackageVersion storage versionNode = versionNodes[versionNodeId];
    require(versionNode.created, "Invalid Node");

    if (versionNode.leaf) {
      return versionNodeId;
    }

    bytes32 latestNodeId = keccak256(
      abi.encodePacked(versionNodeId, versionNode.latestSubVersion)
    );

    return resolveToLeaf(latestNodeId);
  }

  function getPackageLocation(bytes32 versionNodeId)
    public
    view
    returns (string memory)
  {
    bytes32 concreteVersionId = resolveToLeaf(versionNodeId);
    return versionNodes[concreteVersionId].location;
  }
}
