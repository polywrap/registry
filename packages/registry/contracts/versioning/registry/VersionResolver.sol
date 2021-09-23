// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Registry.sol";

abstract contract VersionResolver is Registry {
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

  function getLatestVersionInfo(bytes32 packageId)
    public
    view
    returns (
      bytes32 packageId,
      uint256 majorVersion,
      uint256 minorVersion,
      uint256 patchVersion,
      string memory location
    )
  {
    PackageVersion storage packageNode = versionNodes[packageId];
    uint256 majorVersion = packageNode.latestSubVersion;
    bytes32 majorNodeId = keccak256(abi.encodePacked(packageId, majorVersion));

    PackageVersion storage majorNode = versionNodes[majorNodeId];
    uint256 minorVersion = majorNode.latestSubVersion;
    bytes32 minorNodeId = keccak256(
      abi.encodePacked(majorNodeId, minorVersion)
    );

    PackageVersion storage minorNode = versionNodes[minorNodeId];
    uint256 patchVersion = minorNode.latestSubVersion;
    bytes32 patchNodeId = keccak256(
      abi.encodePacked(minorNodeId, patchVersion)
    );

    PackageVersion storage patchNode = versionNodes[patchNodeId];
    string memory location = patchNode.location;

    return (packageId, majorVersion, minorVersion, patchVersion, location);
  }
}
