// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../VersionVerification.sol";
import "./IVotingMachineBridgeLink.sol";

interface IBridge {
  function messageSender() external view returns (address);

  function messageSourceChainId() external view returns (bytes32);
}

contract VotingMachineBridgeLink is
  IVotingMachineBridgeLink,
  OwnableUpgradeable
{
  constructor(
    address _versionRegistryAddress,
    address _bridgeAddress,
    address _versionRegistryBridgeLinkAddress,
    bytes32 _bridgeChainId
  ) {
    initialize(
      _versionRegistryAddress,
      _bridgeAddress,
      _versionRegistryBridgeLinkAddress,
      _bridgeChainId
    );
  }

  function initialize(
    address _versionRegistryAddress,
    address _bridgeAddress,
    address _versionRegistryBridgeLinkAddress,
    bytes32 _bridgeChainId
  ) public initializer {
    __Ownable_init();

    setBridgeInfo(
      _versionRegistryAddress,
      _bridgeAddress,
      _versionRegistryBridgeLinkAddress,
      _bridgeChainId
    );
  }

  address public versionRegistryAddress;

  address public bridgeAddress;
  address public versionRegistryBridgeLinkAddress;
  bytes32 public bridgeChainId;

  function setBridgeInfo(
    address _versionRegistryAddress,
    address _bridgeAddress,
    address _versionRegistryBridgeLinkAddress,
    bytes32 _bridgeChainId
  ) public onlyOwner {
    versionRegistryAddress = _versionRegistryAddress;
    bridgeAddress = _bridgeAddress;
    versionRegistryBridgeLinkAddress = _versionRegistryBridgeLinkAddress;
    bridgeChainId = _bridgeChainId;
  }

  function setVotingPeriodResult(uint256 votingPeriodId, bytes32 merkleRoot)
    public
    override
  {
    require(msg.sender == bridgeAddress);

    IBridge bridge = IBridge(bridgeAddress);
    require(bridge.messageSender() == versionRegistryBridgeLinkAddress);
    require(bridge.messageSourceChainId() == bridgeChainId);

    VersionVerification registry = VersionVerification(versionRegistryAddress);

    registry.setVotingPeriodResult(votingPeriodId, merkleRoot);
  }
}
