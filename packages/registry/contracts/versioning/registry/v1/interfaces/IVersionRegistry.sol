// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IVersionRegistry {
	event TrustedVersionPublisherSet(address trustedVersionPublisher);
	event VersionPublished(bytes32 indexed packageId, bytes32 indexed versionNodeId, bytes versionBytes, bytes32 buildMetadata, string location);
	
	function publishVersion(bytes32 packageId, bytes memory versionBytes, bytes32 buildMetadata, string memory location) external returns (bytes32 nodeId);
	function versionIds(bytes32 packageId, uint256 start, uint256 count) external view returns (bytes32[] memory);
	function versionCount(bytes32 packageId) external view returns (uint256);
	function versionLocation(bytes32 nodeId) external view returns (string memory);
	function versionBuildMetadata(bytes32 nodeId) external view returns (bytes32);
	function version(bytes32 nodeId) external view returns (bool leaf, bool created, uint8 level, uint256 latestPrereleaseVersion, uint256 latestReleaseVersion, bytes32 buildMetadata, string memory location);
}