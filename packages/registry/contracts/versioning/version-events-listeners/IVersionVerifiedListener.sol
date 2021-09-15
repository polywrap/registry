// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IVersionVerifiedListener {
  function onVersionVerified(bytes32 patchNodeId, bytes32 packageLocationHash)
    external;
}
