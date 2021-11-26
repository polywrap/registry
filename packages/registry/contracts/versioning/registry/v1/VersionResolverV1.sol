// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;


import "hardhat/console.sol";
import "./interfaces/IVersionRegistry.sol";
import "./interfaces/IVersionResolver.sol";
import "./VersionRegistryV1.sol";

error NodeNotFound();

abstract contract VersionResolverV1 is VersionRegistryV1, IVersionResolver {

  function latestReleaseNode(bytes32 versionNodeId) public virtual override view returns (bytes32 nodeId) {
    (bool leaf, bool exists, uint8 level, , uint256 latestReleaseVersion,,) = version(versionNodeId);

    if(!exists) {
      revert NodeNotFound();
    }

    //level == 3 is true for release versions versions(patch nodes)
    //eg. 1.0.1
    if (level == 3) {
      return versionNodeId;
    }

    bytes32 latestNodeId = keccak256(
      abi.encodePacked(versionNodeId, latestReleaseVersion)
    );

    return latestReleaseNode(latestNodeId);
  }

  function latestPrereleaseNode(bytes32 versionNodeId) public virtual override view returns (bytes32 nodeId) {
    (bool leaf, bool exists, uint8 level, uint256 latestPrereleaseVersion,,, string memory location) = version(versionNodeId);
 
    if(!exists) {
      revert NodeNotFound();
    }

    //level == 3 && bytes(location).length != 0) is true if it's a patch version (eg. 1.0.0) and it has a location
    //This follows SemVer rules where a prerelease version has lower precedence than a release(patch) version
    //eg. 1.0.0-alpha < 1.0.0
    if (leaf || (level == 3 && bytes(location).length != 0)) {
      return versionNodeId;
    }

    bytes32 latestNodeId = keccak256(
      abi.encodePacked(versionNodeId, latestPrereleaseVersion)
    );

    return latestPrereleaseNode(latestNodeId);
  }

  function latestReleaseLocation(bytes32 versionNodeId)
    public virtual override
    view
    returns (string memory location)
  {
    bytes32 concreteVersionId = latestReleaseNode(versionNodeId);
    (,,,,,, string memory location) = version(concreteVersionId);

    return location;
  }

  function latestPrereleaseLocation(bytes32 versionNodeId)
    public virtual override
    view
    returns (string memory location)
  {
    bytes32 concreteVersionId = latestPrereleaseNode(versionNodeId);
    (,,,,,, string memory location) = version(concreteVersionId);

    return location;
  }
}
