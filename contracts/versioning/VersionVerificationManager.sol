// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./registry/Registry.sol";

contract VersionVerificationManager is OwnableUpgradeable {
  event VersionPublished(
    bytes32 indexed packageId,
    bytes32 indexed proposedVersionId,
    uint256 major,
    uint256 minor,
    uint256 patch,
    string location
  );

  address public registry;
  address public verificationRootUpdater;

  bytes32 public verificationRoot;

  function updateRegistry(address _registry) public onlyOwner {
    _registry = registry;
  }

  function updateVerificationRootUpdater(address _verificationRootUpdater)
    public
    onlyOwner
  {
    verificationRootUpdater = _verificationRootUpdater;
  }

  function updateVerificationRoot(bytes32 root) public {
    assert(msg.sender == verificationRootUpdater);

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

    bytes32 actualPatchNodeId = Registry(registry).publishVersion(
      packageId,
      majorVersion,
      minorVersion,
      patchVersion,
      location
    );

    require(
      patchNodeId == actualPatchNodeId,
      "Supplied patchNodeId does not match the calculated patchNodeId"
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
