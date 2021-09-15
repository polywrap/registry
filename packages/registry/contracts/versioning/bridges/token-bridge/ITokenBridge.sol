// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ITokenBridge {
  function requireToPassMessage(
    address _contract,
    bytes calldata _data,
    uint256 _gas
  ) external returns (bytes32);

  function messageSender() external view returns (address);

  function messageSourceChainId() external view returns (bytes32);
}
