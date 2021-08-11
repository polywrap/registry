// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../registry/VersionResolver.sol";
import "../registry/Registry.sol";
import "../VotingMachine.sol";

abstract contract Registrar is OwnableUpgradeable {
  event ManagerAdded(bytes32 indexed packageId, address indexed manager);
  event ManagerRemoved(bytes32 indexed packageId, address indexed manager);

  address public registry;
  address public votingMachine;

  mapping(bytes32 => bool) public managers;

  constructor(address _registry, address _votingMachine) {
    initialize(_registry, _votingMachine);
  }

  function initialize(address _registry, address _votingMachine)
    public
    initializer
  {
    __Ownable_init();

    registry = registry;
    votingMachine = _votingMachine;
  }

  function updateRegistry(address _registry) public onlyOwner {
    registry = _registry;
  }

  function updateVotingMachine(address _votingMachine) public onlyOwner {
    votingMachine = _votingMachine;
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
  ) public authorized(packageId) {
    VotingMachine votingMachineContract = VotingMachine(votingMachine);

    votingMachineContract.proposeVersion(
      packageId,
      majorVersion,
      minorVersion,
      patchVersion,
      location,
      msg.sender
    );
  }

  function isAuthorized(bytes32 packageId, address ownerOrManager)
    public
    view
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

  function getPackageOwner(bytes32 packageId) private view returns (address) {
    return Registry(registry).getPackageOwner(packageId);
  }
}
