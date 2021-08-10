// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./VersionResolver.sol";

abstract contract VersionVerification is VersionResolver {
  address public trustedVerificationRootUpdater;

  bytes32 public verificationRoot;

  function setTrustedVerificationRootUpdater(
    address _trustedVerificationRootUpdater
  ) public onlyOwner {
    trustedVerificationRootUpdater = _trustedVerificationRootUpdater;
  }

  function updateVerificationRoot(bytes32 root) public {
    require(msg.sender == trustedVerificationRootUpdater);

    verificationRoot = root;
  }

  function publishVersion(
    bytes32 packageId,
    //Hash of patchNodeId and location
    bytes32 proposedVersionId,
    uint256 majorVersion,
    uint256 minorVersion,
    uint256 patchVersion,
    string memory location,
    bytes32[] memory proof,
    uint256 verifiedVersionIndex
  ) public {
    require(
      proveVerifiedVersion(
        verifiedVersionIndex,
        proof,
        proposedVersionId,
        verificationRoot
      ),
      "Invalid proof"
    );

    internalPublishVersion(
      packageId,
      proposedVersionId,
      majorVersion,
      minorVersion,
      patchVersion,
      location
    );
  }

  function proveVerifiedVersion(
    uint256 index,
    bytes32[] memory proof,
    bytes32 leaf,
    bytes32 root
  ) private pure returns (bool) {
    bytes32 hash = leaf;

    for (uint256 i = 0; i < proof.length; i++) {
      bytes32 proofElement = proof[i];

      if (index % 2 == 0) {
        hash = keccak256(abi.encodePacked(hash, proofElement));
      } else {
        hash = keccak256(abi.encodePacked(proofElement, hash));
      }

      index = index / 2;
    }

    return hash == root;
  }
}
