// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./token-bridge/PolywrapVerificationRootBridgeLink.sol";
import "./VerificationTreeManager.sol";

contract VerificationRootRelayer is OwnableUpgradeable {
  address public bridgeLink;
  address public registry;
  address public verificationTreeManager;
  uint256 public blocksPerRootRelay;

  uint256 public lastRootRelayBlock;

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

  function onVersionDecided() public {
    assert(msg.sender == verificationTreeManager);

    bytes32 verificationRoot = VerificationTreeManager(verificationTreeManager)
      .calculateVerificationRoot();

    updateRegistryVerificationRoot(verificationRoot);

    if (block.number < lastRootRelayBlock + blocksPerRootRelay) {
      return;
    }

    relayVerificationRoot();
  }

  function relayVerificationRoot() public {
    bytes32 verificationRoot = VersionVerification(registry).verificationRoot();

    PolywrapVerificationRootBridgeLink(bridgeLink).relayVerificationRoot(
      verificationRoot
    );
  }

  function updateRegistryVerificationRoot(bytes32 verificationRoot) private {
    if (registry != address(0)) {
      VersionVerification(registry).updateVerificationRoot(verificationRoot);
    }
  }
}
