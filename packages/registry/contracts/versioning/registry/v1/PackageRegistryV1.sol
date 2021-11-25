// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./interfaces/IPackageRegistry.sol";

error OnlyOrganizationOwnershipManager();
error OnlyOrganizationOwner();
error UnauthorizedOrganizationControl();
error PackageAlreadyExists();
error OnlyPackageOwner();
error UnauthorizedPackageControl();
error OnlyOwnershipUpdater();

abstract contract PackageRegistryV1 is OwnableUpgradeable, IPackageRegistry {
  
  struct Organization {
    bool exists;
    address owner;
    address controller;
		bytes32[] packageList;
  }

  struct Package {
    bool exists;
    address owner;
    address controller;
    bytes32 organizationId;
  }

  mapping(bytes32 => Organization) organizations;
  bytes32[] organizationList;
  mapping(bytes32 => Package) packages;

  function claimOrganization(bytes32 organizationId, address owner) internal {
		if(!organizations[organizationId].exists) {
			organizationList.push(organizationId);

			organizations[organizationId].exists = true;
		}

		address previousOwner = organizations[organizationId].owner;
    organizations[organizationId].owner = owner;

    emit OrganizationOwnerChanged(
      organizationId, 
			previousOwner,
      owner
    );
	}

	function setOrganizationOwner(bytes32 organizationId, address owner) public virtual override {
		if(msg.sender != organizationOwner(organizationId)) {
      revert OnlyOrganizationOwner();
    }

		address previousOwner = organizations[organizationId].owner;
    organizations[organizationId].owner = owner;

    emit OrganizationOwnerChanged(
      organizationId,
			previousOwner, 
      owner
    );
	}
	
	function setOrganizationController(bytes32 organizationId, address controller) public virtual override {
 		if(msg.sender != organizationOwner(organizationId) && msg.sender != organizationController(organizationId)) {
      revert UnauthorizedOrganizationControl();
    }

		address previousController = organizations[organizationId].controller;
    organizations[organizationId].controller = controller;

    emit OrganizationControllerChanged(
      organizationId, 
			previousController,
      controller
    );
	}
	
	function setOrganizationOwnerAndController(bytes32 organizationId, address owner, address controller) public virtual override {
		if(msg.sender != organizationOwner(organizationId)) {
      revert OnlyOrganizationOwner();
    }

		address previousOwner = organizations[organizationId].owner;
    organizations[organizationId].owner = owner;

    emit OrganizationOwnerChanged(
      organizationId, 
			previousOwner,
      owner
    );

		address previousController = organizations[organizationId].controller;
    organizations[organizationId].controller = controller;
  
    emit OrganizationControllerChanged(
      organizationId, 
			previousController,
      controller
    );
	}

	function registerPackage(bytes32 organizationId, bytes32 packageName, address packageOwner) public virtual override {
		if(msg.sender != organizationOwner(organizationId)) {
      revert OnlyOrganizationOwner();
    }

		bytes32 packageId = keccak256(abi.encodePacked(organizationId, packageName));
		
		if(packages[packageId].exists) {
			revert PackageAlreadyExists();
		}
		
		packages[packageId].exists = true;
		packages[packageId].organizationId = organizationId;
		organizations[organizationId].packageList.push(packageId);
		
		emit PackageRegistered(
			organizationId, 
			packageId, 
			packageName, 
			packageOwner
		);

		_setPackageOwner(packageId, packageOwner);
	}

	function setPackageOwner(
    bytes32 packageId,
    address owner
  ) public virtual override {
    if(msg.sender != packageOwner(packageId) && msg.sender != organizationOwner(packages[packageId].organizationId)) {
      revert OnlyOrganizationOrPackageOwner();
    }

    _setPackageOwner(packageId, owner);
  }

  function _setPackageOwner(
    bytes32 packageId,
    address owner
  ) internal {
    address previousOwner = packages[packageId].owner;
    packages[packageId].owner = owner;

    emit PackageOwnerChanged(
      packageId, 
      previousOwner,
      owner
    );
  }

  function setPackageOwnerAndController(
    bytes32 packageId,
    address owner,
    address controller
  ) public virtual override {
    if(msg.sender != packageOwner(packageId)) {
      revert OnlyPackageOwner();
    }

    address previousOwner = packages[packageId].owner;
    packages[packageId].owner = owner;

    emit PackageOwnerChanged(
      packageId, 
      previousOwner,
      owner
    );

    address previousController = packages[packageId].controller;
    packages[packageId].controller = controller;
  
    emit PackageControllerChanged(
      packageId, 
      previousController,
      controller
    );
  }

  function setPackageController(
    bytes32 packageId,
    address controller
  ) public virtual override {
    if(msg.sender != packageOwner(packageId) && msg.sender != packageController(packageId)) {
      revert OnlyPackageOwnerOrController();
    }

    address previousController = packages[packageId].controller;
    packages[packageId].controller = controller;

    emit PackageControllerChanged(
      packageId,
      previousController, 
      controller
    );
  }

	function organizationOwner(bytes32 organizationId) public virtual override view returns (address) {
    return organizations[organizationId].owner;
	}
	
	function organizationController(bytes32 organizationId) public virtual override view returns (address) {
    return organizations[organizationId].controller;
	}
	
	function organizationExists(bytes32 organizationId) public virtual override view returns (bool) {
    return organizations[organizationId].exists;
	}

	function organization(bytes32 organizationId) public virtual override view returns (bool exists, address owner, address controller) {
    Organization memory organization = organizations[organizationId];

		return (
      organization.exists,
			organization.owner,
      organization.controller
    );
	}

  function hasOrganizationControl(bytes32 organizationId) public virtual override view returns (bool) {
    address controller = organizations[organizationId].controller;

    return (controller != address(0) && msg.sender == controller)
      || msg.sender == organizations[organizationId].owner;
  }
	
	function listOrganizations(uint256 start, uint256 count) public virtual override view returns (bytes32[] memory) {
		uint256 packageListLength = organizationList.length;
		
		uint256 len = start + count > organizationList.length 
			? organizationList.length - start 
			: count;

		bytes32[] memory organizationArray = new bytes32[](len);

		for(uint256 i = 0; i < len; i++) {
			organizationArray[i] = organizationList[start + i];
		}

		return organizationArray;
	}
	
	function organizationCount() public virtual view returns (uint256) {
    return organizationList.length;
	}
	
	function listPackages(bytes32 organizationId, uint256 start, uint256 count) public virtual override view returns (bytes32[] memory) {
		Organization memory organization = organizations[organizationId];

		uint256 packageListLength = organization.packageList.length;

		uint256 len = start + count > packageListLength 
			? packageListLength - start 
			: count;

		bytes32[] memory packageArray = new bytes32[](len);

		for(uint256 i = 0; i < len; i++) {
			packageArray[i] = organization.packageList[start + i];
		}

		return packageArray;
	}
	
	function packageCount(bytes32 organizationId) public virtual override view returns (uint256) {
    return organizations[organizationId].packageList.length;
	}

  function packageOwner(bytes32 packageId) public virtual override view returns (address) {
    return packages[packageId].owner;
  }

  function packageController(bytes32 packageId) public virtual override view returns (address) {
    return packages[packageId].controller;
  }

  function packageExists(bytes32 packageId) public virtual override view returns (bool) {
    return packages[packageId].exists;
  }

  function package(bytes32 packageId) public virtual override view returns (bool exists, address owner, address controller) {
    return (
      packages[packageId].exists,
      packages[packageId].owner,
      packages[packageId].controller
    );
  }

  function hasPackageControl(bytes32 packageId) public virtual override view returns (bool) {
    address packageController = packages[packageId].controller;

    bool hasPackageControl = (packageController != address(0) && msg.sender == packageController)
      || msg.sender == packages[packageId].owner;

    if(hasPackageControl) {
      return true;
    }
  
    return hasOrganizationControl(organizations[packages[packageId].organizationId]);
  }
}
