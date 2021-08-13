// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./version-events-listeners/IVersionDecidedListener.sol";

contract VotingMachine is OwnableUpgradeable {
  event VersionProposed(
    bytes32 indexed packageId,
    bytes32 proposedVersionId,
    uint256 majorVersion,
    uint256 minorVersion,
    uint256 patchVersion,
    bytes32 patchNodeId,
    string location,
    address proposer
  );

  event VersionVote(
    address indexed verifier,
    bytes32 indexed proposedVersionId,
    bytes32 patchNodeId,
    string location,
    bool approved
  );

  event VersionDecided(
    bytes32 indexed proposedVersionId,
    bytes32 patchNodeId,
    string location,
    bool verified
  );

  struct ProposedVersion {
    address[] approvingVerifiers;
    address[] rejectingVerifiers;
    mapping(address => bool) votedVerifiers;
    bool decided;
    bool verified;
    bytes32 patchNodeId;
    string location;
  }

  struct Vote {
    //This is equal to hash of patchNodeId and location
    bytes32 proposedVersionId;
    bool approved;
  }

  address public registrar;
  address public versionDecidedListener;

  mapping(address => bool) public authorizedVerifiers;
  uint256 public authorizedVerifierCount;

  mapping(bytes32 => ProposedVersion) proposedVersions;

  constructor(address _registrar) {
    initialize(_registrar);
  }

  function initialize(address _registrar) public initializer {
    __Ownable_init();

    registrar = _registrar;
  }

  function updateRegistrar(address _registrar) public onlyOwner {
    registrar = _registrar;
  }

  function updateVersionDecidedListener(address _versionDecidedListener)
    public
    onlyOwner
  {
    versionDecidedListener = _versionDecidedListener;
  }

  function authorizeVerifiers(address[] memory addresses) public onlyOwner {
    for (uint256 i = 0; i < addresses.length; i++) {
      if (!authorizedVerifiers[addresses[i]]) {
        authorizedVerifiers[addresses[i]] = true;
        authorizedVerifierCount++;
      }
    }
  }

  function unauthorizeVerifiers(address[] memory addresses) public onlyOwner {
    for (uint256 i = 0; i < addresses.length; i++) {
      if (authorizedVerifiers[addresses[i]]) {
        authorizedVerifiers[addresses[i]] = false;
        authorizedVerifierCount--;
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
    assert(msg.sender == registrar);

    bytes32 majorNodeId = keccak256(abi.encodePacked(packageId, majorVersion));
    bytes32 minorNodeId = keccak256(
      abi.encodePacked(majorNodeId, minorVersion)
    );
    bytes32 patchNodeId = keccak256(
      abi.encodePacked(minorNodeId, patchVersion)
    );

    bytes32 proposedVersionId = keccak256(
      abi.encodePacked(patchNodeId, location)
    );

    ProposedVersion storage proposedVersion = proposedVersions[
      proposedVersionId
    ];

    require(proposedVersion.patchNodeId == 0x0, "Version is already proposed");

    proposedVersion.patchNodeId = patchNodeId;
    proposedVersion.location = location;

    emit VersionProposed(
      packageId,
      proposedVersionId,
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
      authorizedVerifiers[msg.sender],
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

      require(!proposedVersion.decided, "Voting for this version has ended");

      require(!proposedVersion.votedVerifiers[msg.sender], "You already voted");

      proposedVersion.votedVerifiers[msg.sender] = true;

      if (vote.approved) {
        proposedVersion.approvingVerifiers.push(msg.sender);
      } else {
        proposedVersion.rejectingVerifiers.push(msg.sender);
      }

      if (
        proposedVersion.approvingVerifiers.length > authorizedVerifierCount / 2
      ) {
        proposedVersion.decided = true;
        proposedVersion.verified = true;

        onVersionDecided(vote.proposedVersionId, proposedVersion.verified);

        emit VersionDecided(
          vote.proposedVersionId,
          proposedVersion.patchNodeId,
          proposedVersion.location,
          proposedVersion.verified
        );
      } else {
        proposedVersion.decided = true;
        proposedVersion.verified = false;

        onVersionDecided(vote.proposedVersionId, proposedVersion.verified);

        emit VersionDecided(
          vote.proposedVersionId,
          proposedVersion.patchNodeId,
          proposedVersion.location,
          proposedVersion.verified
        );
      }

      emit VersionVote(
        msg.sender,
        vote.proposedVersionId,
        proposedVersion.patchNodeId,
        proposedVersion.location,
        vote.approved
      );
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
}
