// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../registry/VersionVerification.sol";
import "../PackageOwnershipManager.sol";
import "./ITokenBridge.sol";

contract PolywrapOwnershipBridgeLink is OwnableUpgradeable {
  address public bridge;
  address public bridgeLink;
  address public packageOwnershipManager;
  bytes32 public blockchainName;
  bytes32 public bridgeChainId;
  uint256 public relayOwnershipGasLimit;

  constructor() {
    initialize();
  }

  function initialize() public initializer {
    __Ownable_init();
  }

  function relayOwnership(
    bytes32 domainRegistrar,
    bytes32 domainRegistrarNode,
    address owner
  ) public {
    assert(msg.sender == packageOwnershipManager);

    bytes4 methodSelector = PolywrapOwnershipBridgeLink(address(0))
      .receiveOwnership
      .selector;
    bytes memory data = abi.encodeWithSelector(
      methodSelector,
      domainRegistrar,
      domainRegistrarNode,
      owner
    );
    ITokenBridge(bridge).requireToPassMessage(
      bridgeLink,
      data,
      relayOwnershipGasLimit
    );
  }

  function receiveOwnership(
    bytes32 domainRegistrar,
    bytes32 domainRegistrarNode,
    address owner
  ) public {
    assert(msg.sender == bridge);

    ITokenBridge bridgeContract = ITokenBridge(bridge);
    assert(bridgeContract.messageSender() == bridgeLink);
    assert(bridgeContract.messageSourceChainId() == bridgeChainId);

    PackageOwnershipManager(packageOwnershipManager).receiveOwnership(
      blockchainName,
      domainRegistrar,
      domainRegistrarNode,
      owner
    );
  }
}
