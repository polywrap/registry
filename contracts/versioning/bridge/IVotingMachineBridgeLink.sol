// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IVotingMachineBridgeLink {
  function setVotingPeriodResult(uint256 votingPeriodId, bytes32 merkleRoot)
    external;
}
