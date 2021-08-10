// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../registry/VersionVerification.sol";
import "../PackageOwnershipManager.sol";
import "./ITokenBridge.sol";

contract PolywrapVerificationRootBridgeLink is OwnableUpgradeable {
  address public bridge;
  address public bridgeLink;
  address public verificationRootRelayer;
  address public registry;
  bytes32 public bridgeChainId;
  uint256 public relayVerificationRootGasLimit;

  constructor() {
    initialize();
  }

  function initialize() public initializer {
    __Ownable_init();
  }

  function relayVerificationRoot(bytes32 root) public {
    assert(msg.sender == verificationRootRelayer);

    bytes4 methodSelector = PolywrapVerificationRootBridgeLink(address(0))
      .receiveVerificationRoot
      .selector;
    bytes memory data = abi.encodeWithSelector(methodSelector, root);
    ITokenBridge(bridge).requireToPassMessage(
      bridgeLink,
      data,
      relayVerificationRootGasLimit
    );
  }

  function receiveVerificationRoot(bytes32 root) public {
    assert(msg.sender == bridge);

    ITokenBridge bridgeContract = ITokenBridge(bridge);
    require(bridgeContract.messageSender() == bridgeLink);
    require(bridgeContract.messageSourceChainId() == bridgeChainId);

    VersionVerification(registry).updateVerificationRoot(root);
  }
}
