// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./interfaces/IPackageRegistry.sol";

error OnlyPackageOwner();
error OnlyPackageOwnerOrController();
error OnlyOwnershipUpdater();
error OnlyPackageOwnerOrOwnershipUpdater();

abstract contract PackageRegistryV1 is OwnableUpgradeable, IPackageRegistry {
  struct Package {
    bool exists;
    address owner;
    address controller;
  }

  mapping(bytes32 => Package) packages;

  function setPackageOwner(
    bytes32 packageId,
    address owner
  ) public virtual override {
    if(msg.sender != packageOwner(packageId)) {
      revert OnlyPackageOwner();
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
}
