pragma solidity ^0.8.4;

interface IVerificationRootBridgeLink {
  function relayVerificationRoot(bytes32 verificationRoot) external;

  function receiveVerificationRoot(bytes32 verificationRoot) external;
}
