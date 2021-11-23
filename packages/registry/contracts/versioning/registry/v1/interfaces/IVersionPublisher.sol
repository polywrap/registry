// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IVersionPublisher {
	event VersionRegistrySet(address versionRegistry);
	event PackageRegistrySet(address packageRegistry);
	event VersionPublished(bytes32 indexed packageId, bytes32 indexed versionNodeId, bytes version, bytes32 buildMetadata, string location);
	
	function setVersionRegistry(address versionRegistryAddress) external virtual;
	function setPackageRegistry(address packageRegistryAddress) external virtual;
	
	//TODO: publish development, release, prerelease
	function publishVersion(bytes32 packageId, bytes memory version, bytes32 buildMetadata, string memory location) external virtual returns (bytes32 nodeId);
}