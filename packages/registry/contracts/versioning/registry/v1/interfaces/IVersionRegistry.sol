// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IVersionRegistry {
	event TrustedVersionPublisherSet(address trustedVersionPublisher);
	event VersionPublished(bytes32 indexed packageId, bytes32 indexed versionNodeId, bytes version, bytes32 buildMetadata, string location);
	
	function setTrustedVersionPublisher(address trustedVersionPublisherAddress) external virtual;
	
	function publishVersion(bytes32 packageId, bytes memory version, bytes32 buildMetadata, string memory location) external virtual returns (bytes32 nodeId);
	function version(bytes32 nodeId) external virtual view returns (bool leaf, bool created, uint8 level, uint256 latestPrereleaseVersion, uint256 latestReleaseVersion, bytes32 buildMetadata, string memory location);
	function listVersions(bytes32 packageId, uint256 start, uint256 count) external virtual view returns (bytes32[] memory);
	function versionCount(bytes32 packageId) external virtual view returns (uint256);
}