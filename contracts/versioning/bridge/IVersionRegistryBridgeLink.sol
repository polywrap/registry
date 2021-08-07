// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IVersionRegistryBridgeLink {
  function setVotingPeriodResult(uint256 votingPeriodId, bytes32 merkleRoot)
    external;
}
