// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./bridges/interfaces/IVerificationRootBridgeLink.sol";
import "./VerificationTreeManager.sol";
import "./VersionVerificationManager.sol";

contract VerificationRootRelayer is OwnableUpgradeable {
  address public versionVerificationManager;
  address public bridgeLink;
  address public verificationTreeManager;
  uint256 public blocksPerRootRelay;

  uint256 public lastRootRelayBlock;

  constructor(address _versionVerificationManager, uint256 _blocksPerRootRelay)
  {
    initialize(_versionVerificationManager, _blocksPerRootRelay);
  }

  function initialize(
    address _versionVerificationManager,
    uint256 _blocksPerRootRelay
  ) public initializer {
    __Ownable_init();

    versionVerificationManager = _versionVerificationManager;
    blocksPerRootRelay = _blocksPerRootRelay;
  }

  function updateBridgeLink(address _bridgeLink) public onlyOwner {
    bridgeLink = _bridgeLink;
  }

  function updateVersionVerificationManager(address _versionVerificationManager)
    public
    onlyOwner
  {
    versionVerificationManager = _versionVerificationManager;
  }

  function updateVerificationTreeManager(address _verificationTreeManager)
    public
    onlyOwner
  {
    verificationTreeManager = _verificationTreeManager;
  }

  function updateBlocksPerRootRelay(uint256 _blocksPerRootRelay)
    public
    onlyOwner
  {
    blocksPerRootRelay = _blocksPerRootRelay;
  }

  function onVersionVerified() public {
    assert(msg.sender == verificationTreeManager);

    bytes32 verificationRoot = VerificationTreeManager(verificationTreeManager)
      .calculateVerificationRoot();

    updateVerificationRoot(verificationRoot);

    if (block.number < lastRootRelayBlock + blocksPerRootRelay) {
      return;
    }

    relayVerificationRoot();
  }

  function relayVerificationRoot() public {
    assert(versionVerificationManager != address(0));

    if (bridgeLink == address(0)) {
      return;
    }

    bytes32 verificationRoot = VersionVerificationManager(
      versionVerificationManager
    ).verificationRoot();

    IVerificationRootBridgeLink(bridgeLink).relayVerificationRoot(
      verificationRoot
    );
  }

  function updateVerificationRoot(bytes32 verificationRoot) private {
    if (versionVerificationManager != address(0)) {
      VersionVerificationManager(versionVerificationManager)
        .updateVerificationRoot(verificationRoot);
    }
  }
}
