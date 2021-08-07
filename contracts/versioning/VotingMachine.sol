// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./bridge/IVersionRegistryBridgeLink.sol";

contract VotingMachine is OwnableUpgradeable {
  struct VotingPeriod {
    bytes32[] proposedVersionIds;
    mapping(bytes32 => VersionVotingResult) votingResults;
    bytes32 merkleRoot;
    //Track unpaired leaves and the highest level(root is at the top) to calculate the merkle root on the fly
    uint256 highestTreeLevel;
    mapping(uint256 => bytes32) unpairedTreeLeaves;
    bool resultsRelayed;
  }

  struct VersionVotingResult {
    address[] approvingVerifierAddresses;
    address[] rejectingVerifierAddresses;
    mapping(address => bool) votedVerifierAddresses;
    bool decided;
  }

  struct Vote {
    bytes32 versionId;
    bool approved;
  }

  constructor(uint256 blocksPerVotingPeriod) {
    initialize(blocksPerVotingPeriod);
  }

  function initialize(uint256 blocksPerVotingPeriod) public initializer {
    __Ownable_init();

    setBlocksPerVotingPeriod(blocksPerVotingPeriod);
  }

  mapping(address => bool) public authorizedVerifierAddresses;
  uint256 public authorizedVerifierAddressCount;

  mapping(uint256 => VotingPeriod) public votingPeriods;
  mapping(uint256 => bool) public relayedVotingPeriods;

  uint256 public blocksPerVotingPeriod;
  uint256 public lastVotingPeriodWithVotesId;

  address public versionRegistryBridgeLinkAddres;

  function setBlocksPerVotingPeriod(uint256 _blocksPerVotingPeriod)
    public
    onlyOwner
  {
    blocksPerVotingPeriod = _blocksPerVotingPeriod;
  }

  function setBridgeInfo(address _versionRegistryBridgeLinkAddres)
    public
    onlyOwner
  {
    versionRegistryBridgeLinkAddres = _versionRegistryBridgeLinkAddres;
  }

  function authorizeVerifierAddresses(address[] memory addresses)
    public
    onlyOwner
  {
    for (uint256 i = 0; i < addresses.length; i++) {
      if (!authorizedVerifierAddresses[addresses[i]]) {
        authorizedVerifierAddresses[addresses[i]] = true;
        authorizedVerifierAddressCount++;
      }
    }
  }

  function unauthorizeVerifierAddresses(address[] memory addresses)
    public
    onlyOwner
  {
    for (uint256 i = 0; i < addresses.length; i++) {
      if (authorizedVerifierAddresses[addresses[i]]) {
        authorizedVerifierAddresses[addresses[i]] = false;
        authorizedVerifierAddressCount--;
      }
    }
  }

  function getCurrentVotingPeriodId() public view returns (uint256) {
    return block.number / blocksPerVotingPeriod;
  }

  function vote(Vote[] memory votes) public {
    require(
      authorizedVerifierAddresses[msg.sender],
      "You are not an authorized verifier"
    );

    uint256 currentVotingPeriodId = getCurrentVotingPeriodId();

    if (lastVotingPeriodWithVotesId != currentVotingPeriodId) {
      relayResults(lastVotingPeriodWithVotesId);
    }

    lastVotingPeriodWithVotesId = currentVotingPeriodId;

    VotingPeriod storage votingPeriod = votingPeriods[currentVotingPeriodId];

    for (uint256 i = 0; i < votes.length; i++) {
      Vote memory vote = votes[i];

      VersionVotingResult storage votingResult = votingPeriod.votingResults[
        vote.versionId
      ];

      require(
        !votingResult.decided,
        "Voting for this version has already been decided"
      );

      require(
        !votingResult.votedVerifierAddresses[msg.sender],
        "You already voted"
      );

      votingResult.votedVerifierAddresses[msg.sender] = true;

      if (vote.approved) {
        votingResult.approvingVerifierAddresses.push(msg.sender);
      } else {
        votingResult.rejectingVerifierAddresses.push(msg.sender);
      }

      if (
        votingResult.approvingVerifierAddresses.length >
        authorizedVerifierAddressCount / 2
      ) {
        votingResult.decided = true;

        //Hash the version ID with "false" to signal that the version was approved
        bytes32 leaf = keccak256(abi.encodePacked(vote.versionId, true));
      } else if (
        votingResult.rejectingVerifierAddresses.length >
        authorizedVerifierAddressCount / 2
      ) {
        votingResult.decided = true;

        //Hash the version ID with "false" to signal that the version was rejected
        bytes32 leaf = keccak256(abi.encodePacked(vote.versionId, false));

        //Go through the unpaired tree leaves and pair them with the new leaf
        uint256 currentTreeLevel = 0;
        while (votingPeriod.unpairedTreeLeaves[currentTreeLevel] != 0x0) {
          leaf = keccak256(
            abi.encodePacked(
              votingPeriod.unpairedTreeLeaves[currentTreeLevel],
              leaf
            )
          );

          currentTreeLevel++;
        }

        //Store the unpaired leaf to be paired later
        votingPeriod.unpairedTreeLeaves[currentTreeLevel] = leaf;

        //Track the highest level
        if (currentTreeLevel > votingPeriod.highestTreeLevel) {
          votingPeriod.highestTreeLevel = currentTreeLevel;
        }
      }
    }
  }

  function relayResults(uint256 votingPeriodId) public {
    VotingPeriod storage votingPeriod = votingPeriods[votingPeriodId];
    require(
      !votingPeriod.resultsRelayed,
      "Voting period results have already been relayed"
    );
    votingPeriod.resultsRelayed = true;

    bytes32 merkleRoot;
    uint256 highestTreeLevel;
    (merkleRoot, highestTreeLevel) = calculateMerkleRoot(votingPeriod);

    votingPeriod.merkleRoot = merkleRoot;
    votingPeriod.highestTreeLevel = highestTreeLevel;

    IVersionRegistryBridgeLink bridgeLink = IVersionRegistryBridgeLink(
      versionRegistryBridgeLinkAddres
    );
    bridgeLink.setVotingPeriodResult(votingPeriodId, merkleRoot);
  }

  function calculateMerkleRoot(VotingPeriod storage votingPeriod)
    private
    view
    returns (bytes32 merkleRoot, uint256 highestTreeLevel)
  {
    bytes32 leaf = 0;

    //Go through the unpaired tree leaves and pair them with the "0" leaf
    //If there is no unpaired leaf, just propagate the current one upwards
    uint256 currentTreeLevel = 0;
    while (currentTreeLevel < votingPeriod.highestTreeLevel) {
      if (votingPeriod.unpairedTreeLeaves[currentTreeLevel] != 0x0) {
        leaf = keccak256(
          abi.encodePacked(
            votingPeriod.unpairedTreeLeaves[currentTreeLevel],
            leaf
          )
        );
      }

      currentTreeLevel++;
    }

    if (leaf != 0) {
      //The tree was unbalanced
      return (
        keccak256(
          abi.encodePacked(
            votingPeriod.unpairedTreeLeaves[currentTreeLevel],
            leaf
          )
        ),
        votingPeriod.highestTreeLevel + 1
      );
    } else {
      //The tree was balanced and the highest unpaired leaf was already the root
      return (
        votingPeriod.unpairedTreeLeaves[currentTreeLevel],
        votingPeriod.highestTreeLevel
      );
    }
  }
}
