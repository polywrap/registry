// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./VersionVerification.sol";
import "./VersionRegistry.sol";

interface IBridge {
  function requireToPassMessage(
    address _contract,
    bytes calldata _data,
    uint256 _gas
  ) external returns (bytes32);

  function messageSender() external view returns (address);

  function messageSourceChainId() external view returns (bytes32);
}

contract PolywrapBridgeLink is OwnableUpgradeable {
  address public versionRegistry;
  address public verificationRootRelayer;
  address public overrideOwnershipRelayer;
  address public bridgeAddress;
  address public bridgeLinkAddress;
  uint256 public relayVerificationRootGasLimit;
  uint256 public relayOverrideOwnershipGasLimit;

  constructor() {
    initialize();
  }

  function initialize() public initializer {
    __Ownable_init();
  }

  function updateTrustedAddresses(
    address _bridgeLinkAddress,
    address _versionRegistry
  ) public {
    bridgeLinkAddress = _bridgeLinkAddress;
    versionRegistry = _versionRegistry;
  }

  function relayVerificationRoot(bytes32 root) public override {
    require(msg.sender == verificationRootRelayer);

    bytes4 methodSelector = PolywrapBridgeLink(address(0))
      .receiveVerificationRoot
      .selector;
    bytes memory data = abi.encodeWithSelector(methodSelector, root);
    IBridge(bridgeAddress).requireToPassMessage(
      bridgeLinkAddress,
      data,
      relayVerificationRootGasLimit
    );
  }

  function receiveVerificationRoot(bytes32 root) public override {
    require(msg.sender == bridgeAddress);

    IBridge bridge = IBridge(bridgeAddress);
    require(bridge.messageSender() == bridgeLinkAddress);
    require(bridge.messageSourceChainId() == bridgeChainId);

    VersionVerification registry = VersionVerification(versionRegistry);
    registry.updateVerificationRoot(root);
  }

  function relayOverrideOwnership(
    bytes32 domainRegistrar,
    bytes32 domainRegistrarNode,
    address owner
  ) public override {
    require(msg.sender == overrideOwnershipRelayer);

    bytes4 methodSelector = PolywrapBridgeLink(address(0))
      .receiveOverrideOwnership
      .selector;
    bytes memory data = abi.encodeWithSelector(
      methodSelector,
      domainRegistrar,
      domainRegistrarNode,
      owner
    );
    IBridge(bridgeAddress).requireToPassMessage(
      bridgeLinkAddress,
      data,
      relayOverrideOwnershipGasLimit
    );
  }

  function receiveOverrideOwnership(
    bytes32 domainRegistrar,
    bytes32 domainRegistrarNode,
    address owner
  ) public override {
    require(msg.sender == bridgeAddress);

    IBridge bridge = IBridge(bridgeAddress);
    require(bridge.messageSender() == bridgeLinkAddress);
    require(bridge.messageSourceChainId() == bridgeChainId);

    VersionRegistry registry = VersionRegistry(versionRegistry);
    registry.overrideOwnership(domainRegistrar, domainRegistrarNode, owner);
  }
}
