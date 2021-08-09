// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./VersionResolver.sol";
import "./VersionRegistry.sol";

abstract contract VersionRegistrar is OwnableUpgradeable {
  event ManagerAdded(bytes32 indexed packageId, address indexed manager);
  event ManagerRemoved(bytes32 indexed packageId, address indexed manager);

  mapping(bytes32 => bool) public managers;
  address public polywrapRegistryAddress;
  address public votingMachineAddress;

  constructor(address _polywrapRegistryAddress, address _votingMachineAddress) {
    initialize(_polywrapRegistryAddress, _votingMachineAddress);
  }

  function initialize(
    address _polywrapRegistryAddress,
    address _votingMachineAddress
  ) public initializer {
    __Ownable_init();

    polywrapRegistryAddress = _polywrapRegistryAddress;
    votingMachineAddress = _votingMachineAddress;
  }

  function addManager(bytes32 packageId, address manager)
    public
    packageOwner(packageId)
  {
    bytes32 key = keccak256(abi.encodePacked(packageId, manager));

    managers[key] = true;

    emit ManagerAdded(packageId, manager);
  }

  function removeManager(bytes32 packageId, address manager)
    public
    packageOwner(packageId)
  {
    bytes32 key = keccak256(abi.encodePacked(packageId, manager));

    managers[key] = false;

    emit ManagerRemoved(packageId, manager);
  }

  function proposeVersion(
    bytes32 packageId,
    uint256 majorVersion,
    uint256 minorVersion,
    uint256 patchVersion,
    string memory location
  ) public authorized(packageId) {}

  function isAuthorized(bytes32 packageId, address ownerOrManager)
    public
    view
    override
    returns (bool)
  {
    bytes32 key = keccak256(abi.encodePacked(packageId, ownerOrManager));

    if (managers[key]) {
      return true;
    }

    return getPackageOwner(packageId) == ownerOrManager;
  }

  modifier authorized(bytes32 packageId) {
    require(
      isAuthorized(packageId, msg.sender),
      "You do not have access to this package"
    );
    _;
  }

  modifier packageOwner(bytes32 packageId) {
    require(
      getPackageOwner(packageId) == msg.sender,
      "You do not have access to the domain of this package"
    );
    _;
  }

  function getPackageOwner(bytes32 packageId) private returns (address) {
    VersionRegistry registry = VersionRegistry(polywrapRegistryAddress);

    return registry.packages[packageId].owner;
  }
}
