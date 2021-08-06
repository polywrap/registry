// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract VotingMachine is OwnableUpgradeable {
  struct VotingPeriodInfo {
    bytes32 votingPeriodId;
    bytes32[] proposedVersionIds;
    mapping(bytes32 => VersionVotingResult) votingResults;
    uint32 treeRoot;
    //Track unpaired leaves and the highest level(root is at the top) to calculate the merkle root on the fly
    uint32 highestTreeLevel;
    mapping(uint32 => bytes32) unpairedTreeLeaves;
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

  constructor(
  ) {
    initialize(domainRegistrars, domainRegistrarAddresses);
  }

  function initialize() public initializer {
    __Ownable_init();
  }

  mapping(address => bool) public authorizedVerifierAddresses;
  uint256 public authorizedVerifierAddressCount;

  function authorizeVerifierAddresses(address[] addresses) public onlyOwner {
    for(uint256 i = 0; i < addresses.length; i++) {
      if(!authorizedVerifierAddresses[addresses[i]]) {
        authorizedVerifierAddresses[addresses[i]] = true;
        authorizedVerifierAddressCount++;
      }
    }
  }

  function unauthorizeVerifierAddresses(address[] addresses) public onlyOwner {
    for(uint256 i = 0; i < addresses.length; i++) {
      if(authorizedVerifierAddresses[addresses[i]]) {
        authorizedVerifierAddresses[addresses[i]] = false;
        authorizedVerifierAddressCount--;
      }
    }
  }

  function vote(Vote[] votes) public {
    require(authorizedVerifierAddresses[msg.sender] != 0, "You are not allowed")
    for(uint256 i = 0; i < votes.length; i++) {
      Vote vote = votes[i];
      VotingPeriodInfo storage periodInfo;

      require(!periodInfo.votedVerifierAddresses[msg.sender], "You already voted")
      
      periodInfo.votedVerifierAddresses[msg.sender] = true;

      VersionVotingResult storage votingResult = periodInfo.votingResults[vote.versionId];

      require(!votingResult.decided, "Voting for this version has already been decided")

      if(vote.approved) {
        votingResult.approvingVerifierAddresses.push(msg.sender);
      } else {
        votingResult.rejectingVerifierAddresses.push(msg.sender);
      }

      if(votingResult.approvingVerifierAddresses.length > authorizedVerifierAddressCount / 2) {
        votingResult.decided = true;

        //Hash the version ID with "false" to signal that the version was approved
        uint256 leaf = keccak256(abi.encodePacked(vote.versionId, true));
      } else if(votingResult.rejectingVerifierAddresses.length > authorizedVerifierAddressCount / 2) {
        votingResult.decided = true;
        
        //Hash the version ID with "false" to signal that the version was rejected
        uint256 leaf = keccak256(abi.encodePacked(vote.versionId, false));

        //Go through the unpaired tree leaves and pair them with the new leaf
        uint256 currentTreeLevel = 0;
        while(periodInfo.unpairedTreeLeaves[currentTreeLevel] != 0) {
          leaf = keccak256(abi.encodePacked(periodInfo.unpairedTreeLeaves[currentTreeLevel], leaf))

          currentTreeLevel++;
        }

        //Store the unpaired leaf to be paired later
        periodInfo.unpairedTreeLeaves[currentTreeLevel] = leaf;

        //Track the highest level
        if(currentTreeLevel > periodInfo.highestTreeLevel) {
          periodInfo.highestTreeLevel = currentTreeLevel;
        }
      }
    }
  }

  function relayResults(Vote[] votes) public {
    VotingPeriodInfo storage periodInfo;
    uint256 merkleRoot, highestTreeLevel = calculateMerkleRoot(periodInfo);

    periodInfo.merkleRoot = merkleRoot;
    periodInfo.highestTreeLevel = highestTreeLevel;
  }

  function calculateMerkleRoot(VotingPeriodInfo memory periodInfo) private returns(uint256 merkleRoot, uint256 highestTreeLevel) {
    uint256 leaf = 0;

    //Go through the unpaired tree leaves and pair them with the "0" leaf
    //If there is no unpaired leaf, just propagate the current one upwards
    uint256 currentTreeLevel = 0;
    while(currentTreeLevel < periodInfo.highestTreeLevel) {
      if(periodInfo.unpairedTreeLeaves[currentTreeLevel] != 0) {
        leaf = keccak256(abi.encodePacked(periodInfo.unpairedTreeLeaves[currentTreeLevel], leaf))
      }

      currentTreeLevel++;
    }

    if(leaf != 0) {
      //The tree was unbalanced
      return (
        keccak256(abi.encodePacked(periodInfo.unpairedTreeLeaves[currentTreeLevel], leaf)),
        periodInfo.highestTreeLevel+1
      );
    } else {
      //The tree was balanced and the highest unpaired leaf was already the root
      return (
        periodInfo.unpairedTreeLeaves[currentTreeLevel],
        periodInfo.highestTreeLevel
      )
    }
  }
}
