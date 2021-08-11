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

  constructor(
    address _bridge,
    address _bridgeLink,
    address _verificationRootRelayer,
    address _registry,
    bytes32 _bridgeChainId,
    uint256 _relayVerificationRootGasLimit
  ) {
    initialize(
      _bridge,
      _bridgeLink,
      _verificationRootRelayer,
      _registry,
      _bridgeChainId,
      _relayVerificationRootGasLimit
    );
  }

  function initialize(
    address _bridge,
    address _bridgeLink,
    address _verificationRootRelayer,
    address _registry,
    bytes32 _bridgeChainId,
    uint256 _relayVerificationRootGasLimit
  ) public initializer {
    __Ownable_init();

    bridge = _bridge;
    bridgeLink = _bridgeLink;
    verificationRootRelayer = _verificationRootRelayer;
    registry = _registry;
    bridgeChainId = _bridgeChainId;
    relayVerificationRootGasLimit = _relayVerificationRootGasLimit;
  }

  function updateBridge(address _bridge) public onlyOwner {
    bridge = _bridge;
  }

  function updateBridgeLink(address _bridgeLink) public onlyOwner {
    bridgeLink = _bridgeLink;
  }

  function updateVerificationRootRelayer(address _verificationRootRelayer)
    public
    onlyOwner
  {
    verificationRootRelayer = _verificationRootRelayer;
  }

  function updateRegistry(address _registry) public onlyOwner {
    registry = _registry;
  }

  function updateBridgeChainId(bytes32 _bridgeChainId) public onlyOwner {
    bridgeChainId = _bridgeChainId;
  }

  function updateRelayVerificationRootGasLimit(
    uint256 _relayVerificationRootGasLimit
  ) public onlyOwner {
    relayVerificationRootGasLimit = _relayVerificationRootGasLimit;
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
