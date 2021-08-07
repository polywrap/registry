// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./IVersionRegistryBridgeLink.sol";
import "./IVotingMachineBridgeLink.sol";

interface IBridge {
  function requireToPassMessage(
    address _contract,
    bytes calldata _data,
    uint256 _gas
  ) external returns (bytes32);
}

contract VersionRegistryBridgeLink is
  IVersionRegistryBridgeLink,
  OwnableUpgradeable
{
  constructor(
    address bridgeAddress,
    address votingMachineBridgeLinkAddres,
    uint256 gasLimit
  ) {
    initialize(bridgeAddress, votingMachineBridgeLinkAddres, gasLimit);
  }

  function initialize(
    address bridgeAddress,
    address votingMachineBridgeLinkAddres,
    uint256 gasLimit
  ) public initializer {
    __Ownable_init();

    setBridgeInfo(bridgeAddress, votingMachineBridgeLinkAddres, gasLimit);
  }

  address public bridgeAddress;
  address public votingMachineBridgeLinkAddres;
  uint256 public gasLimit;

  function setBridgeInfo(
    address _bridgeAddress,
    address _votingMachineBridgeLinkAddres,
    uint256 _gasLimit
  ) public onlyOwner {
    bridgeAddress = _bridgeAddress;
    votingMachineBridgeLinkAddres = _votingMachineBridgeLinkAddres;
    gasLimit = _gasLimit;
  }

  function setVotingPeriodResult(uint256 votingPeriodId, bytes32 merkleRoot)
    public
    override
  {
    bytes4 methodSelector = IVotingMachineBridgeLink(address(0))
      .setVotingPeriodResult
      .selector;
    bytes memory data = abi.encodeWithSelector(
      methodSelector,
      votingPeriodId,
      merkleRoot
    );
    IBridge(bridgeAddress).requireToPassMessage(
      votingMachineBridgeLinkAddres,
      data,
      gasLimit
    );
  }
}
