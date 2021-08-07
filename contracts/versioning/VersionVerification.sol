// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./VersionManager.sol";

abstract contract VersionVerification is VersionManager {
  struct VotingPeriod {
    uint256 votingPeriodId;
    bytes32 merkleRoot;
  }

  mapping(uint256 => VotingPeriod) public votingPeriods;

  address public bridgeLinkAddress;

  function setBridgeInfo(address _bridgeLinkAddress) public onlyOwner {
    bridgeLinkAddress = _bridgeLinkAddress;
  }

  function setVotingPeriodResult(uint256 votingPeriodId, bytes32 merkleRoot)
    public
  {
    require(msg.sender == bridgeLinkAddress);

    votingPeriods[votingPeriodId] = VotingPeriod(votingPeriodId, merkleRoot);
  }

  function publishVersion(bytes32 versionId, uint256 votingPeriodId) public {}
}
