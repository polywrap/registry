// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./interfaces/IVersionPublisher.sol";
import "./interfaces/IVersionRegistry.sol";
import "./interfaces/IPackageRegistry.sol";

error OnlyPackageController();

contract VersionPublisherV1 is OwnableUpgradeable, IVersionPublisher {

	address public versionRegistry;
	address public packageRegistry;
	
	function setVersionRegistry(address versionRegistryAddress) public virtual override {
		versionRegistry = versionRegistryAddress;
	}

	function setPackageRegistry(address packageRegistryAddress) external virtual {
		packageRegistry = packageRegistryAddress;
	}

	//TODO: publish development, release, prerelease
	function publishVersion(bytes32 packageId, bytes memory version, bytes32 buildMetadata, string memory location) public virtual override returns (bytes32 nodeId) {
		if(msg.sender != IPackageRegistry(packageRegistry).packageController(packageId)) {
			revert OnlyPackageController();
		}

	  bytes32 versionNodeId = IVersionRegistry(versionRegistry).publishVersion(packageId, version, buildMetadata, location);
	
		emit VersionPublished(packageId, versionNodeId, version, buildMetadata, location);
	}
}