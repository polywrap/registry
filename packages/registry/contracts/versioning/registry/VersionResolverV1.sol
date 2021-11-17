// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./RegistryV1.sol";
import "hardhat/console.sol";

error NodeNotFound();

contract VersionResolverV1 {

  RegistryV1 registry;

  constructor(RegistryV1 _registry) {
    registry = _registry;
  }

  function resolveToLatestPrereleaseNode(bytes32 versionNodeId) public view returns (bytes32) {
    (bool leaf, bool created, uint8 level, uint256 latestPrereleaseVersion,,, string memory location) = RegistryV1(registry).getVersionNode(versionNodeId);
 
    if(!created) {
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

    return resolveToLatestPrereleaseNode(latestNodeId);
  }

  function resolveToLatestReleaseNode(bytes32 versionNodeId) public view returns (bytes32) {
    (bool leaf, bool created, uint8 level, , uint256 latestReleaseVersion,,) = RegistryV1(registry).getVersionNode(versionNodeId);

    if(!created) {
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

    return resolveToLatestReleaseNode(latestNodeId);
  }

  function getPrereleasePackageLocation(bytes32 versionNodeId)
    public
    view
    returns (string memory)
  {
    bytes32 concreteVersionId = resolveToLatestPrereleaseNode(versionNodeId);
    (,,,,,, string memory location) = RegistryV1(registry).getVersionNode(concreteVersionId);

    return location;
  }

  function getReleasePackageLocation(bytes32 versionNodeId)
    public
    view
    returns (string memory)
  {
    bytes32 concreteVersionId = resolveToLatestReleaseNode(versionNodeId);
    (,,,,,, string memory location) = RegistryV1(registry).getVersionNode(concreteVersionId);

    return location;
  }
}
