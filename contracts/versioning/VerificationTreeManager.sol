// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./version-events-listeners/IVersionDecidedListener.sol";
import "./VerificationRootRelayer.sol";

contract VerificationTreeManager is
  IVersionDecidedListener,
  OwnableUpgradeable
{
  event VerificationRootCalculated(
    bytes32 indexed verificationRoot,
    uint256 decidedVersionCount
  );

  event VersionVote(bytes32 indexed proposedVersionId, bool approved);

  event VersionDecided(
    bytes32 indexed proposedVersionId,
    bool verified,
    uint256 decidedVersionIndex
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

  uint256 public decidedVersionCount;

  constructor(address _registry, address _votingMachine) {
    initialize(_registry, _votingMachine);
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

  function onVersionDecided(bytes32 proposedVersionId, bool verified)
    public
    override
  {
    assert(msg.sender == votingMachine);

    addVersionToTree(proposedVersionId, verified);

    emit VersionDecided(proposedVersionId, verified, decidedVersionCount);
    VerificationRootRelayer(verificationRootRelayer).onVersionDecided();

    decidedVersionCount++;
  }

  function addVersionToTree(bytes32 proposedVersionId, bool verified) private {
    //Hash the version ID with the "verified" variable to store that the version is approved or not
    bytes32 leaf = keccak256(abi.encodePacked(proposedVersionId, verified));

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

    return leaf;

    bytes32 root;

    // if (leaf != 0) {
    //   //The tree was unbalanced
    //   root = keccak256(
    //     abi.encodePacked(
    //       verificationTree.unpairedTreeLeaves[currentTreeLevel],
    //       leaf
    //     )
    //   );
    // } else {
    //   //The tree was balanced and the highest unpaired leaf was already the root
    //   root = verificationTree.unpairedTreeLeaves[currentTreeLevel];
    // }

    emit VerificationRootCalculated(root, decidedVersionCount);

    return root;
  }
}
