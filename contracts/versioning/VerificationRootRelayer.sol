// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./token-bridge/PolywrapVerificationRootBridgeLink.sol";
import "./VerificationTreeManager.sol";

contract VerificationRootRelayer is OwnableUpgradeable {
  address public registry;
  address public bridgeLink;
  address public verificationTreeManager;
  uint256 public blocksPerRootRelay;

  uint256 public lastRootRelayBlock;

  constructor(address _registry, uint256 _blocksPerRootRelay) {
    initialize(_registry, _blocksPerRootRelay);
  }

  function initialize(address _registry, uint256 _blocksPerRootRelay)
    public
    initializer
  {
    __Ownable_init();

    registry = _registry;
    blocksPerRootRelay = _blocksPerRootRelay;
  }

  function updateBridgeLink(address _bridgeLink) public onlyOwner {
    bridgeLink = _bridgeLink;
  }

  function updateRegistry(address _registry) public onlyOwner {
    registry = _registry;
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
    assert(registry != address(0));

    if (bridgeLink == address(0)) {
      return;
    }

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
