// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./version-events-listeners/IVersionVerifiedListener.sol";

contract VotingMachine is OwnableUpgradeable {
  event VersionProposed(
    bytes32 indexed packageId,
    bytes32 patchNodeId,
    uint256 majorVersion,
    uint256 minorVersion,
    uint256 patchVersion,
    bytes32 packageLocationHash,
    address proposer
  );

  event VersionVotingStarted(
    bytes32 indexed packageId,
    bytes32 indexed patchNodeId,
    uint256 majorVersion,
    uint256 minorVersion,
    uint256 patchVersion,
    bytes32 packageLocationHash,
    address proposer
  );

  event VersionVote(
    address indexed verifier,
    bytes32 indexed patchNodeId,
    bytes32 packageLocationHash,
    bool approved
  );

  event VersionDecided(
    bytes32 indexed patchNodeId,
    bool indexed verified,
    bytes32 packageLocationHash
  );

  struct ProposedVersion {
    address[] approvingVerifiers;
    address[] rejectingVerifiers;
    mapping(address => bool) votedVerifiers;
    bool decided;
    bool verified;
    bool votingStarted;
    bytes32 packageId;
    bytes32 majorNodeId;
    bytes32 minorNodeId;
    bytes32 patchNodeId;
    bytes32 packageLocationHash;
    uint256 majorVersion;
    uint256 minorVersion;
    uint256 patchVersion;
    address proposer;
  }

  struct QueuedVersion {
    bytes32 nextQueuedVersionId;
    bytes32 patchNodeId;
  }

  struct MajorVersionQueueContainer {
    bytes32 headVersionId;
    bytes32 tailVersionId;
    mapping(bytes32 => QueuedVersion) queuedVersions;
  }

  struct VerifiedMinorVersion {
    uint256 versionNumber;
    bytes32 nextMinorNodeId;
    bytes32 prevMinorNodeId;
    bytes32 majorNodeId;
    bytes32 patchNodeId;
  }

  struct Vote {
    bytes32 patchNodeId;
    bytes32 prevMinorNodeId;
    bytes32 nextMinorNodeId;
    bytes32 packageLocationHash;
    bool approved;
  }

  address public registrar;
  address public versionVerifiedListener;

  mapping(bytes32 => MajorVersionQueueContainer)
    public majorVersionQueueContainers;
  mapping(bytes32 => ProposedVersion) public proposedVersions;
  mapping(bytes32 => VerifiedMinorVersion) public verifiedMinorVersions;

  mapping(address => bool) public authorizedVerifiers;
  uint256 public authorizedVerifierCount;

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

  function updateVersionVerifiedListener(address _versionVerifiedListener)
    public
    onlyOwner
  {
    versionVerifiedListener = _versionVerifiedListener;
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
    bytes32 packageLocationHash,
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

    ProposedVersion storage proposedVersion = proposedVersions[patchNodeId];

    require(proposedVersion.patchNodeId == 0x0, "Version is already proposed");

    proposedVersion.packageId = packageId;

    proposedVersion.majorNodeId = majorNodeId;
    proposedVersion.minorNodeId = minorNodeId;
    proposedVersion.patchNodeId = patchNodeId;

    proposedVersion.majorVersion = majorVersion;
    proposedVersion.minorVersion = minorVersion;
    proposedVersion.patchVersion = patchVersion;

    proposedVersion.packageLocationHash = packageLocationHash;
    proposedVersion.proposer = proposer;

    MajorVersionQueueContainer
      storage majorVersionContainer = majorVersionQueueContainers[majorNodeId];

    QueuedVersion storage queuedVersion = majorVersionContainer.queuedVersions[
      patchNodeId
    ];

    queuedVersion.patchNodeId = patchNodeId;

    if (majorVersionContainer.tailVersionId != 0x0) {
      //The queue is not empty
      QueuedVersion storage tailVersion = majorVersionContainer.queuedVersions[
        majorVersionContainer.tailVersionId
      ];

      tailVersion.nextQueuedVersionId = patchNodeId;
      majorVersionContainer.tailVersionId = patchNodeId;
    } else {
      //The queue is empty
      majorVersionContainer.tailVersionId = patchNodeId;
      majorVersionContainer.headVersionId = patchNodeId;

      //Since there is only one version in the queue, we can start voting for it
      proposedVersion.votingStarted = true;

      emit VersionVotingStarted(
        packageId,
        patchNodeId,
        majorVersion,
        minorVersion,
        patchVersion,
        packageLocationHash,
        proposer
      );
    }

    emit VersionProposed(
      packageId,
      patchNodeId,
      majorVersion,
      minorVersion,
      patchVersion,
      packageLocationHash,
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
        vote.patchNodeId
      ];

      require(proposedVersion.votingStarted, "Version is not yet proposed");
      require(
        proposedVersion.packageLocationHash == vote.packageLocationHash,
        "A different package location is proposed"
      );
      require(!proposedVersion.decided, "Voting for this version has ended");
      require(!proposedVersion.votedVerifiers[msg.sender], "You already voted");

      requireValidMinorVersionPlacement(
        vote.prevMinorNodeId,
        vote.nextMinorNodeId,
        proposedVersion.minorVersion,
        proposedVersion.majorNodeId,
        proposedVersion.minorNodeId
      );

      proposedVersion.votedVerifiers[msg.sender] = true;

      if (vote.approved) {
        proposedVersion.approvingVerifiers.push(msg.sender);
      } else {
        proposedVersion.rejectingVerifiers.push(msg.sender);
      }

      if (
        proposedVersion.approvingVerifiers.length > authorizedVerifierCount / 2
      ) {
        //The version is verified
        proposedVersion.decided = true;
        proposedVersion.verified = true;

        onVersionDecided(
          vote.prevMinorNodeId,
          vote.nextMinorNodeId,
          proposedVersion.minorVersion,
          proposedVersion.majorNodeId,
          proposedVersion.minorNodeId,
          vote.patchNodeId,
          proposedVersion.verified,
          proposedVersion.packageLocationHash
        );
      } else {
        //The version is rejected
        proposedVersion.decided = true;
        proposedVersion.verified = false;

        onVersionDecided(
          vote.prevMinorNodeId,
          vote.nextMinorNodeId,
          proposedVersion.minorVersion,
          proposedVersion.majorNodeId,
          proposedVersion.minorNodeId,
          vote.patchNodeId,
          proposedVersion.verified,
          proposedVersion.packageLocationHash
        );
      }

      emit VersionVote(
        msg.sender,
        proposedVersion.patchNodeId,
        proposedVersion.packageLocationHash,
        vote.approved
      );
    }
  }

  function requireValidMinorVersionPlacement(
    bytes32 prevMinorNodeId,
    bytes32 nextMinorNodeId,
    uint256 minorVersionNumber,
    bytes32 majorNodeId,
    bytes32 minorNodeId
  ) private view {
    VerifiedMinorVersion storage currentVersion = verifiedMinorVersions[
      minorNodeId
    ];

    if (currentVersion.patchNodeId != 0x0) {
      //Minor version has at least one patch version verified and there's no need to keep track of multiple patch versions
      return;
    }

    VerifiedMinorVersion storage prevVersion = verifiedMinorVersions[
      prevMinorNodeId
    ];
    VerifiedMinorVersion storage nextVersion = verifiedMinorVersions[
      nextMinorNodeId
    ];

    //Verify the current version is between prev and next version
    if (prevVersion.patchNodeId != 0x0) {
      require(
        prevVersion.versionNumber < minorVersionNumber,
        "Previous version number is not less than the current one"
      );
      require(
        prevVersion.nextMinorNodeId == nextMinorNodeId,
        "Previous version does not point to the next version"
      );
      require(
        prevVersion.majorNodeId == majorNodeId,
        "Previous version does not belong to the same major version"
      );
    }

    if (nextVersion.patchNodeId != 0x0) {
      require(
        minorVersionNumber < nextVersion.versionNumber,
        "Next version number is not greater than the current one"
      );
      require(
        nextVersion.prevMinorNodeId == prevMinorNodeId,
        "Next version does not point to the previous version"
      );
      require(
        nextVersion.majorNodeId == majorNodeId,
        "Next version does not belong to the same major version"
      );
    }
  }

  function addToVersionTree(
    bytes32 prevMinorNodeId,
    bytes32 nextMinorNodeId,
    uint256 minorVersionNumber,
    bytes32 majorNodeId,
    bytes32 minorNodeId,
    bytes32 patchNodeId
  ) private {
    VerifiedMinorVersion storage currentVersion = verifiedMinorVersions[
      minorNodeId
    ];

    currentVersion.patchNodeId = patchNodeId;
    currentVersion.versionNumber = minorVersionNumber;
    currentVersion.majorNodeId = majorNodeId;

    VerifiedMinorVersion storage prevVersion = verifiedMinorVersions[
      prevMinorNodeId
    ];
    VerifiedMinorVersion storage nextVersion = verifiedMinorVersions[
      nextMinorNodeId
    ];

    //Insert into the linked list between prev and next version

    if (prevVersion.patchNodeId != 0x0) {
      currentVersion.prevMinorNodeId = prevMinorNodeId;
      prevVersion.nextMinorNodeId = minorNodeId;
    }

    if (nextVersion.patchNodeId != 0x0) {
      currentVersion.nextMinorNodeId = nextMinorNodeId;
      nextVersion.prevMinorNodeId = minorNodeId;
    }
  }

  function onVersionDecided(
    bytes32 prevMinorNodeId,
    bytes32 nextMinorNodeId,
    uint256 minorVersionNumber,
    bytes32 majorNodeId,
    bytes32 minorNodeId,
    bytes32 patchNodeId,
    bool verified,
    bytes32 packageLocationHash
  ) private {
    if (verified) {
      addToVersionTree(
        prevMinorNodeId,
        nextMinorNodeId,
        minorVersionNumber,
        majorNodeId,
        minorNodeId,
        patchNodeId
      );

      if (versionVerifiedListener != address(0)) {
        IVersionVerifiedListener listener = IVersionVerifiedListener(
          versionVerifiedListener
        );

        listener.onVersionVerified(patchNodeId, packageLocationHash);
      }
    }

    dequeueNextVersion(majorNodeId);

    emit VersionDecided(patchNodeId, verified, packageLocationHash);
  }

  function dequeueNextVersion(bytes32 majorNodeId) private {
    MajorVersionQueueContainer
      storage majorVersionContainer = majorVersionQueueContainers[majorNodeId];

    if (majorVersionContainer.headVersionId == 0x0) {
      //The queue is empty
      return;
    }

    QueuedVersion storage headVersion = majorVersionContainer.queuedVersions[
      majorVersionContainer.headVersionId
    ];

    ProposedVersion storage nextVotingVersion = proposedVersions[
      majorVersionContainer.headVersionId
    ];

    if (headVersion.nextQueuedVersionId == 0x0) {
      majorVersionContainer.headVersionId = 0x0;
      majorVersionContainer.tailVersionId = 0x0;
    } else {
      majorVersionContainer.headVersionId = headVersion.nextQueuedVersionId;
    }

    nextVotingVersion.votingStarted = true;

    emit VersionVotingStarted(
      nextVotingVersion.packageId,
      nextVotingVersion.patchNodeId,
      nextVotingVersion.majorVersion,
      nextVotingVersion.minorVersion,
      nextVotingVersion.patchVersion,
      nextVotingVersion.packageLocationHash,
      nextVotingVersion.proposer
    );
  }
}
