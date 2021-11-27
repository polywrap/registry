// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./interfaces/IPackageRegistry.sol";

error OnlyOrganizationOwner();
error OnlyOrganizationController();
error PackageAlreadyExists();
error OnlyPackageOwner();
error OnlyPackageController();

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

  function transferOrganizationOwnership(bytes32 organizationId, address newOwner) 
    public virtual override onlyOrganizationOwner(organizationId) {

		address previousOwner = organizations[organizationId].owner;
    organizations[organizationId].owner = newOwner;

    emit OrganizationOwnerChanged(
      organizationId,
			previousOwner, 
      newOwner
    );
	}
	
	function setOrganizationController(bytes32 organizationId, address newController) 
    public virtual override onlyOrganizationOwner(organizationId) {

		address previousController = organizations[organizationId].controller;
    organizations[organizationId].controller = newController;

    emit OrganizationControllerChanged(
      organizationId, 
			previousController,
      newController
    );
	}
	
	function transferOrganizationControl(bytes32 organizationId, address newController) 
    public virtual override onlyOrganizationController(organizationId) {

		address previousController = organizations[organizationId].controller;
    organizations[organizationId].controller = newController;

    emit OrganizationControllerChanged(
      organizationId, 
			previousController,
      newController
    );
	}

	function registerPackage(bytes32 organizationId, bytes32 packageName, address packageOwner, address packageController) 
    public virtual override onlyOrganizationController(organizationId) {

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
			packageOwner,
      packageController
		);

		_setPackageOwner(packageId, packageOwner);
    _setPackageController(packageId, packageController);
	}

	function setPackageOwner(
    bytes32 packageId,
    address newOwner
  ) public virtual override onlyOrganizationController(packages[packageId].organizationId) {
    _setPackageOwner(packageId, newOwner);
  }

  function transferPackageOwnership(
    bytes32 packageId,
    address newOwner
  ) public virtual override onlyPackageOwner(packageId) {
    _setPackageOwner(packageId, newOwner);
  }

  function _setPackageOwner(
    bytes32 packageId,
    address newOwner
  ) private {
    address previousOwner = packages[packageId].owner;
    packages[packageId].owner = newOwner;

    emit PackageOwnerChanged(
      packageId, 
      previousOwner,
      newOwner
    );
  }

  function setPackageController(
    bytes32 packageId,
    address newController
  ) public virtual override onlyPackageOwner(packageId) {
    _setPackageController(packageId, newController);
  }

  function _setPackageController(
    bytes32 packageId,
    address newController
  ) private {
    address previousController = packages[packageId].controller;
    packages[packageId].controller = newController;

    emit PackageControllerChanged(
      packageId,
      previousController, 
      newController
    );
  }

  function transferPackageControl(
    bytes32 packageId,
    address newController
  ) public virtual override onlyPackageController(packageId) {
    _setPackageController(packageId, newController);
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

  modifier onlyOrganizationOwner(bytes32 organizationId) {
    if (msg.sender != organizations[organizationId].owner) {
      revert OnlyOrganizationOwner();
    }
    _;
  }

  modifier onlyOrganizationController(bytes32 organizationId) {
    if (msg.sender != organizations[organizationId].controller) {
      revert OnlyOrganizationController();
    }
    _;
  }

  modifier onlyPackageOwner(bytes32 packageId) {
    if (msg.sender != packages[packageId].owner) {
      revert OnlyPackageOwner();
    }
    _;
  }

  modifier onlyPackageController(bytes32 packageId) {
    if (msg.sender != packages[packageId].controller) {
      revert OnlyPackageController();
    }
    _;
  }
}
