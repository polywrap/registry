// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./version-events-listeners/IVersionVerifiedListener.sol";
import "./VerificationRootRelayer.sol";

contract VerificationTreeManager is
  IVersionVerifiedListener,
  OwnableUpgradeable
{
  event VerificationRootCalculated(
    bytes32 indexed verificationRoot,
    uint256 verifiedVersionCount
  );

  event VersionVerified(
    bytes32 indexed patchNodeId,
    bytes32 packageLocationHash,
    uint256 verifiedVersionIndex
  );

  struct DynamicMerkleTree {
    //Track unpaired leaves and the highest level(root is at the top) to calculate the merkle root on the fly
    uint256 highestTreeLevel;
    mapping(uint256 => bytes32) unpairedTreeLeaves;
  }

  DynamicMerkleTree private verificationTree;

  address public registry;
  address public votingMachine;
  address public verificationRootRelayer;

  uint256 public verifiedVersionCount;

  constructor(
    address owner,
    address _registry, 
    address _votingMachine
  ) {
    initialize(_registry, _votingMachine);
    transferOwnership(owner);
  }

  function initialize(address _registry, address _votingMachine)
    public
    initializer
  {
    __Ownable_init();

    registry = _registry;
    votingMachine = _votingMachine;
  }

  function updateRegistry(address _registry) public onlyOwner {
    registry = _registry;
  }

  function updateVotingMachine(address _votingMachine) public onlyOwner {
    votingMachine = _votingMachine;
  }

  function updateVerificationRootRelayer(address _verificationRootRelayer)
    public
    onlyOwner
  {
    verificationRootRelayer = _verificationRootRelayer;
  }

  function onVersionVerified(bytes32 patchNodeId, bytes32 packageLocationHash)
    public
    override
  {
    assert(msg.sender == votingMachine);

    addVersionToTree(patchNodeId, packageLocationHash);

    emit VersionVerified(
      patchNodeId,
      packageLocationHash,
      verifiedVersionCount
    );

    verifiedVersionCount++;

    VerificationRootRelayer(verificationRootRelayer).onVersionVerified();
  }

  function addVersionToTree(bytes32 patchNodeId, bytes32 packageLocationHash)
    private
  {
    bytes32 leaf = keccak256(
      abi.encodePacked(patchNodeId, packageLocationHash)
    );

    //Go through the unpaired tree leaves and pair them with the new leaf
    uint256 currentTreeLevel = 0;
    while (verificationTree.unpairedTreeLeaves[currentTreeLevel] != 0x0) {
      leaf = keccak256(
        abi.encodePacked(
          verificationTree.unpairedTreeLeaves[currentTreeLevel],
          leaf
        )
      );

      verificationTree.unpairedTreeLeaves[currentTreeLevel] = 0x0;
      currentTreeLevel++;
    }

    //Store the unpaired leaf to be paired later
    verificationTree.unpairedTreeLeaves[currentTreeLevel] = leaf;

    //Track the highest level
    if (currentTreeLevel > verificationTree.highestTreeLevel) {
      verificationTree.highestTreeLevel = currentTreeLevel;
    }
  }

  function calculateVerificationRoot() public returns (bytes32) {
    assert(msg.sender == verificationRootRelayer);

    bytes32 leaf = 0x0;

    //Go through the unpaired tree leaves and pair them with the "0x0" leaf
    //If there is no unpaired leaf, just propagate the current one upwards
    uint256 currentTreeLevel = 0;
    while (currentTreeLevel <= verificationTree.highestTreeLevel) {
      if (verificationTree.unpairedTreeLeaves[currentTreeLevel] != 0x0) {
        if (leaf == 0x0) {
          leaf = verificationTree.unpairedTreeLeaves[currentTreeLevel];
        } else {
          leaf = keccak256(
            abi.encodePacked(
              verificationTree.unpairedTreeLeaves[currentTreeLevel],
              leaf
            )
          );
        }
      }

      currentTreeLevel++;
    }

    emit VerificationRootCalculated(leaf, verifiedVersionCount);

    return leaf;
  }
}
