// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../../../PackageOwnershipManager.sol";
import "../ITokenBridge.sol";
import "../OwnershipBridgeLink.sol";

contract OwnershipBridgeLinkMock is OwnershipBridgeLink {
  constructor(
    address owner,
    address _bridge,
    address _packageOwnershipManager,
    bytes32 _blockchainName,
    bytes32 _bridgeChainId,
    uint256 _relayOwnershipGasLimit
  )
    OwnershipBridgeLink(
      owner,
      _bridge,
      _packageOwnershipManager,
      _blockchainName,
      _bridgeChainId,
      _relayOwnershipGasLimit
    )
  {}

  function relayOwnership(
    bytes32 domainRegistrar,
    bytes32 domainRegistrarNode,
    address owner
  ) public virtual override {
    assert(msg.sender == packageOwnershipManager);

    OwnershipBridgeLink(bridgeLink).receiveOwnership(
      domainRegistrar,
      domainRegistrarNode,
      owner
    );
  }

  function receiveOwnership(
    bytes32 domainRegistrar,
    bytes32 domainRegistrarNode,
    address owner
  ) public virtual override {
    assert(msg.sender == bridgeLink);

    PackageOwnershipManager(packageOwnershipManager).receiveOwnership(
      blockchainName,
      domainRegistrar,
      domainRegistrarNode,
      owner
    );
  }
}
