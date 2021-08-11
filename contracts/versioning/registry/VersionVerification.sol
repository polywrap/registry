// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./VersionResolver.sol";

abstract contract VersionVerification is VersionResolver {
  address public trustedVerificationRootUpdater;

  bytes32 public verificationRoot;

  function updateTrustedVerificationRootUpdater(
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
    bytes32 patchNodeId,
    uint256 majorVersion,
    uint256 minorVersion,
    uint256 patchVersion,
    string memory location,
    bytes32[] memory proof,
    uint256 verifiedVersionIndex
  ) public {
    bytes32 proposedVersionId = keccak256(
      abi.encodePacked(patchNodeId, location)
    );

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
      patchNodeId,
      majorVersion,
      minorVersion,
      patchVersion,
      location
    );

    emit VersionPublished(
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
    bytes32 proposedVersionId,
    bytes32 root
  ) private pure returns (bool) {
    //Pass "true" to confirm version is verified
    bytes32 leaf = keccak256(abi.encodePacked(proposedVersionId, true));

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
