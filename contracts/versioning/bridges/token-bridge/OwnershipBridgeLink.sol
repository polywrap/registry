// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../../PackageOwnershipManager.sol";
import "./ITokenBridge.sol";
import "../interfaces/IOwnershipBridgeLink.sol";

contract OwnershipBridgeLink is IOwnershipBridgeLink, OwnableUpgradeable {
  address public bridge;
  address public bridgeLink;
  address public packageOwnershipManager;
  bytes32 public blockchainName;
  bytes32 public bridgeChainId;
  uint256 public relayOwnershipGasLimit;

  constructor(
    address _bridge,
    address _packageOwnershipManager,
    bytes32 _blockchainName,
    bytes32 _bridgeChainId,
    uint256 _relayOwnershipGasLimit
  ) {
    initialize(
      _bridge,
      _packageOwnershipManager,
      _blockchainName,
      _bridgeChainId,
      _relayOwnershipGasLimit
    );
  }

  function initialize(
    address _bridge,
    address _packageOwnershipManager,
    bytes32 _blockchainName,
    bytes32 _bridgeChainId,
    uint256 _relayOwnershipGasLimit
  ) public initializer {
    __Ownable_init();

    bridge = _bridge;
    packageOwnershipManager = _packageOwnershipManager;
    blockchainName = _blockchainName;
    bridgeChainId = _bridgeChainId;
    relayOwnershipGasLimit = _relayOwnershipGasLimit;
  }

  function updateBridge(address _bridge) public onlyOwner {
    bridge = _bridge;
  }

  function updateBridgeLink(address _bridgeLink) public onlyOwner {
    bridgeLink = _bridgeLink;
  }

  function updatePackageOwnershipManager(address _packageOwnershipManager)
    public
    onlyOwner
  {
    packageOwnershipManager = _packageOwnershipManager;
  }

  function updateBlockchainName(bytes32 _blockchainName) public onlyOwner {
    blockchainName = _blockchainName;
  }

  function updateBridgeChainId(bytes32 _bridgeChainId) public onlyOwner {
    bridgeChainId = _bridgeChainId;
  }

  function updateRelayOwnershipGasLimit(uint256 _relayOwnershipGasLimit)
    public
    onlyOwner
  {
    relayOwnershipGasLimit = _relayOwnershipGasLimit;
  }

  function relayOwnership(
    bytes32 domainRegistrar,
    bytes32 domainRegistrarNode,
    address owner
  ) public virtual override {
    assert(msg.sender == packageOwnershipManager);

    bytes4 methodSelector = IOwnershipBridgeLink(address(0))
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
  ) public virtual override {
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
