// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../../../VersionVerificationManager.sol";
import "../../../PackageOwnershipManager.sol";
import "../ITokenBridge.sol";
import "../VerificationRootBridgeLink.sol";
import "../../interfaces/IVerificationRootBridgeLink.sol";

contract VerificationRootBridgeLinkMock is VerificationRootBridgeLink {
  constructor(
    address owner,
    address _bridge,
    bytes32 _bridgeChainId,
    uint256 _relayVerificationRootGasLimit
  )
    VerificationRootBridgeLink(
      owner,
      _bridge,
      _bridgeChainId,
      _relayVerificationRootGasLimit
    )
  {}

  function relayVerificationRoot(bytes32 verificationRoot) public override {
    assert(msg.sender == verificationRootRelayer);

    IVerificationRootBridgeLink(bridgeLink).receiveVerificationRoot(
      verificationRoot
    );
  }

  function receiveVerificationRoot(bytes32 verificationRoot) public override {
    assert(msg.sender == bridgeLink);

    VersionVerificationManager(versionVerificationManager)
      .updateVerificationRoot(verificationRoot);
  }
}
