// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IVersionResolver {
	event VersionRegistrySet(address versionRegistry);

	function setVersionRegistry(address versionRegistryAddress) external virtual;
	function latestReleaseNode(bytes32 versionNodeId) external virtual view returns (bytes32 nodeId);
	function latestPrereleaseNode(bytes32 versionNodeId) external virtual view returns (bytes32 nodeId);
	function latestReleaseLocation(bytes32 versionNodeId) external virtual view returns (string memory location);
	function latestPrereleaseLocation(bytes32 versionNodeId) external virtual view returns (string memory location);
}