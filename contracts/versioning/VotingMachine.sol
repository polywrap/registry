// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./version-events-listeners/IVersionDecidedListener.sol";
import "./version-events-listeners/IVersionVoteListener.sol";

contract VotingMachine is OwnableUpgradeable {
  event VersionProposed(
    bytes32 packageId,
    bytes32 majorVersion,
    bytes32 minorVersion,
    bytes32 patchVersion,
    bytes32 patchNodeId,
    string location,
    address proposer
  );

  event VersionDecided(bytes32 patchNodeId, string location, address proposer);

  struct ProposedVersion {
    address[] approvingVerifierAddresses;
    address[] rejectingVerifierAddresses;
    mapping(address => bool) votedVerifierAddresses;
    bool decided;
    bool verified;
    bytes32 patchNodeId;
    string location;
  }

  struct Vote {
    //This is equal to keccak256(abi.encodePacked(patchNodeId, location))
    bytes32 proposedVersionId;
    bool approved;
  }

  address public registrar;
  address public versionDecidedListener;
  address public versionVoteListener;

  mapping(address => bool) public authorizedVerifierAddresses;
  uint256 public authorizedVerifierAddressCount;

  mapping(bytes32 => ProposedVersions) proposedVersions;

  constructor() {
    initialize();
  }

  function initialize() public initializer {
    __Ownable_init();
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

  function proposeVersion(
    bytes32 packageId,
    uint256 majorVersion,
    uint256 minorVersion,
    uint256 patchVersion,
    string memory location,
    address proposer
  ) public {
    require(msg.sender == registrar);

    bytes32 majorNodeId = keccak256(abi.encodePacked(packageId, majorVersion));
    bytes32 minorNodeId = keccak256(
      abi.encodePacked(majorNodeId, minorVersion)
    );
    bytes32 patchNodeId = keccak256(
      abi.encodePacked(minorNodeId, patchVersion)
    );

    ProposedVersions proposedVersion = proposedVersions[patchNodeId];

    require(proposedVersion.patchNodeId != 0x0, "Version is already proposed");

    proposedVersion.patchNodeId = patchNodeId;
    proposedVersion.location = location;

    emit VersionProposed(
      packageId,
      majorVersion,
      minorVersion,
      patchVersion,
      patchNodeId,
      location,
      proposer
    );
  }

  function vote(Vote[] memory votes) public {
    require(
      authorizedVerifierAddresses[msg.sender],
      "You are not an authorized verifier"
    );

    for (uint256 i = 0; i < votes.length; i++) {
      Vote memory vote = votes[i];

      ProposedVersion storage proposedVersion = proposedVersions[
        vote.proposedVersionId
      ];

      require(
        proposedVersion.patchNodeId != 0x0,
        "Version is not yet proposed"
      );

      require(
        !proposedVersion.decided,
        "Voting for this version has already been decided"
      );

      require(
        !proposedVersion.votedVerifierAddresses[msg.sender],
        "You already voted"
      );

      proposedVersion.votedVerifierAddresses[msg.sender] = true;

      if (vote.approved) {
        proposedVersion.approvingVerifierAddresses.push(msg.sender);
      } else {
        proposedVersion.rejectingVerifierAddresses.push(msg.sender);
      }

      if (
        proposedVersion.approvingVerifierAddresses.length >
        authorizedVerifierAddressCount / 2
      ) {
        proposedVersion.decided = true;
        proposedVersion.verified = true;

        onVersionDecided(vote.proposedVersionId, proposedVersion.verified);

        emit VersionDecided(proposedVersion.patchNodeId, location, verified);
      } else {
        proposedVersion.decided = true;
        proposedVersion.verified = false;

        onVersionDecided(vote.proposedVersionId, proposedVersion.verified);

        emit VersionDecided(proposedVersion.patchNodeId, location, verified);
      }

      onVersionVote(vote.proposedVersionId, vote.approved);
    }
  }

  function onVersionDecided(bytes32 proposedVersionId, bool verified) private {
    if (versionDecidedListener != address(0)) {
      IVersionDecidedListener listener = IVersionDecidedListener(
        versionDecidedListener
      );

      listener.onVersionDecided(proposedVersionId, verified);
    }
  }

  function onVersionVote(bytes32 proposedVersionId, bool approved) private {
    if (versionVoteListener != address(0)) {
      IVersionVoteListener listener = IVersionVoteListener(versionVoteListener);

      listener.onVersionVote(proposedVersionId, approved);
    }
  }
}
