// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./ITokenBridge.sol";

contract TokenBridgeMock is ITokenBridge {
  address public tokenBridge;

  constructor(address _tokenBridge) {
    tokenBridge = _tokenBridge;
  }

  function requireToPassMessage(
    address _contract,
    bytes calldata _data,
    uint256 _gas
  ) public override returns (bytes32) {
    return 0x0;
  }

  function messageSender() external view override returns (address) {
    return address(0);
  }

  function messageSourceChainId() external view override returns (bytes32) {
    return bytes32("1");
  }
}
