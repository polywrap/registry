// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./RegistryV1.sol";
import "hardhat/console.sol";

abstract contract VersionResolverV1 is RegistryV1 {
  function resolveToLeaf(bytes32 versionNodeId) public view returns (bytes32) {
    VersionNode storage versionNode = versionNodes[versionNodeId];
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
