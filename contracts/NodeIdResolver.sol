// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

abstract contract NodeIdResolver {
  function getApiNodeId(uint256 apiId) internal pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked(apiId)));
  }

  function getMajorNodeId(uint256 apiNodeId, uint256 majorVersion)
    internal
    pure
    returns (uint256)
  {
    return uint256(keccak256(abi.encodePacked(apiNodeId, majorVersion)));
  }

  function getMinorNodeId(uint256 majorNodeId, uint256 minorVersion)
    internal
    pure
    returns (uint256)
  {
    return uint256(keccak256(abi.encodePacked(majorNodeId, minorVersion)));
  }

  function getPatchNodeId(uint256 minorNodeId, uint256 patchVersion)
    internal
    pure
    returns (uint256)
  {
    return uint256(keccak256(abi.encodePacked(minorNodeId, patchVersion)));
  }
}
