// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./token-bridge/PolywrapVerificationRootBridgeLink.sol";

contract VerificationRootRelayer is OwnableUpgradeable {
  address public bridgeLink;
  address public registry;

  constructor(address _bridgeLink, address _registry) {
    initialize(_bridgeLink, _registry);
  }

  function initialize(address _bridgeLink, address _registry)
    public
    initializer
  {
    __Ownable_init();
    updateTrustedAddresses(_bridgeLink, _registry);
  }

  function updateTrustedAddresses(address _bridgeLink, address _registry)
    public
  {
    bridgeLink = _bridgeLink;
    registry = _registry;
  }

  function relayVerificationRoot() public {
    bytes32 verificationRoot = VersionVerification(registry).verificationRoot();

    PolywrapVerificationRootBridgeLink(bridgeLink).relayVerificationRoot(
      verificationRoot
    );
  }
}
