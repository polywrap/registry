// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./bridge/IPolywrapBridgeLink.sol";

contract VerificationRootRelayer is OwnableUpgradeable {
  address public bridgeLinkAddress;
  address public versionRegistry;

  constructor(address _bridgeLinkAddress, address _versionRegistry) {
    initialize(_bridgeLinkAddress, _versionRegistry);
  }

  function initialize(address _bridgeLinkAddress, address _versionRegistry)
    public
    initializer
  {
    __Ownable_init();
    updateTrustedAddresses(_bridgeLinkAddress, _versionRegistry);
  }

  function updateTrustedAddresses(
    address _bridgeLinkAddress,
    address _versionRegistry
  ) public {
    bridgeLinkAddress = _bridgeLinkAddress;
    versionRegistry = _versionRegistry;
  }

  function relayVerificationRoot(bytes32 root) public {
    IPolywrapBridgeLink bridgeLink = IPolywrapBridgeLink(bridgeLinkAddress);
    bridgeLink.relayVerificationRoot(root);
  }
}
