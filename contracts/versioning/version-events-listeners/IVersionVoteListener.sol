// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IVersionVoteListener {
  function onVersionVote(bytes32 proposedVersionId, bool approved) external;
}
