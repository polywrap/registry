// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

abstract contract NodeIdResolver {
  function getApiNodeId(bytes32 apiId) internal pure returns (bytes32) {
    return keccak256(abi.encodePacked(apiId));
  }

  function getMajorNodeId(bytes32 apiNodeId, uint256 majorVersion)
    internal
    pure
    returns (bytes32)
  {
    return keccak256(abi.encodePacked(apiNodeId, majorVersion));
  }

  function getMinorNodeId(bytes32 majorNodeId, uint256 minorVersion)
    internal
    pure
    returns (bytes32)
  {
    return keccak256(abi.encodePacked(majorNodeId, minorVersion));
  }

  function getPatchNodeId(bytes32 minorNodeId, uint256 patchVersion)
    internal
    pure
    returns (bytes32)
  {
    return keccak256(abi.encodePacked(minorNodeId, patchVersion));
  }
}
