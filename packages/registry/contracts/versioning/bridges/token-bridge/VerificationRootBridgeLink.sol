// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../../VersionVerificationManager.sol";
import "../../PackageOwnershipManager.sol";
import "./ITokenBridge.sol";
import "../interfaces/IVerificationRootBridgeLink.sol";

contract VerificationRootBridgeLink is
  IVerificationRootBridgeLink,
  OwnableUpgradeable
{
  address public bridge;
  address public bridgeLink;
  address public verificationRootRelayer;
  address public versionVerificationManager;
  bytes32 public bridgeChainId;
  uint256 public relayVerificationRootGasLimit;

  constructor(
    address owner,
    address _bridge,
    bytes32 _bridgeChainId,
    uint256 _relayVerificationRootGasLimit
  ) {
    initialize(_bridge, _bridgeChainId, _relayVerificationRootGasLimit);
    transferOwnership(owner);
  }

  function initialize(
    address _bridge,
    bytes32 _bridgeChainId,
    uint256 _relayVerificationRootGasLimit
  ) public initializer {
    __Ownable_init();

    bridge = _bridge;
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

  function updateVersionVerificationManager(address _versionVerificationManager)
    public
    onlyOwner
  {
    versionVerificationManager = _versionVerificationManager;
  }

  function updateBridgeChainId(bytes32 _bridgeChainId) public onlyOwner {
    bridgeChainId = _bridgeChainId;
  }

  function updateRelayVerificationRootGasLimit(
    uint256 _relayVerificationRootGasLimit
  ) public onlyOwner {
    relayVerificationRootGasLimit = _relayVerificationRootGasLimit;
  }

  function relayVerificationRoot(bytes32 verificationRoot)
    public
    virtual
    override
  {
    assert(msg.sender == verificationRootRelayer);

    bytes4 methodSelector = IVerificationRootBridgeLink(address(0))
      .receiveVerificationRoot
      .selector;
    bytes memory data = abi.encodeWithSelector(
      methodSelector,
      verificationRoot
    );
    ITokenBridge(bridge).requireToPassMessage(
      bridgeLink,
      data,
      relayVerificationRootGasLimit
    );
  }

  function receiveVerificationRoot(bytes32 verificationRoot)
    public
    virtual
    override
  {
    assert(msg.sender == bridge);

    ITokenBridge bridgeContract = ITokenBridge(bridge);
    require(bridgeContract.messageSender() == bridgeLink);
    require(bridgeContract.messageSourceChainId() == bridgeChainId);

    VersionVerificationManager(versionVerificationManager)
      .updateVerificationRoot(verificationRoot);
  }
}
