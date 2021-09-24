// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./registry/Registry.sol";

contract VersionVerificationManager is OwnableUpgradeable {
  event VersionPublished(
    bytes32 indexed packageId,
    bytes32 indexed verifiedVersionId,
    bytes32 indexed patchNodeId,
    uint256 major,
    uint256 minor,
    uint256 patch,
    string location
  );

  address public registry;
  address public verificationRootUpdater;

  bytes32 public verificationRoot;

  constructor(
    address owner,
    address _registry
  ) {
    initialize(_registry);
    transferOwnership(owner);
  }

  function initialize(address _registry) public initializer {
    __Ownable_init();

    registry = _registry;
  }

  function updateRegistry(address _registry) public onlyOwner {
    registry = _registry;
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
    bool[] memory sides
  ) public packageOwner(packageId) {
    bytes32 verifiedVersionId = getVerifiedVersionId(patchNodeId, location);

    require(
      _isValidProof(proof, sides, verifiedVersionId, verificationRoot),
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
      verifiedVersionId,
      patchNodeId,
      majorVersion,
      minorVersion,
      patchVersion,
      location
    );
  }

  function getVerifiedVersionId(bytes32 patchNodeId, string memory location)
    private
    pure
    returns (bytes32)
  {
    bytes32 verifiedVersionId = keccak256(
      abi.encodePacked(patchNodeId, keccak256(abi.encodePacked(location)))
    );
    return verifiedVersionId;
  }

  function isValidProof(
    bytes32[] memory proof,
    bool[] memory sides,
    bytes32 patchNodeId,
    string memory location
  ) public view returns (bool) {
    bytes32 verifiedVersionId = getVerifiedVersionId(patchNodeId, location);
    return _isValidProof(proof, sides, verifiedVersionId, verificationRoot);
  }

  function _isValidProof(
    bytes32[] memory proof,
    bool[] memory sides,
    bytes32 verifiedVersionId,
    bytes32 root
  ) private pure returns (bool) {
    bytes32 hash = verifiedVersionId;

    for (uint256 i = 0; i < proof.length; i++) {
      bytes32 proofElement = proof[i];

      if (sides[i]) {
        hash = keccak256(abi.encodePacked(proofElement, hash));
      } else {
        hash = keccak256(abi.encodePacked(hash, proofElement));
      }
    }

    return hash == root;
  }

  modifier packageOwner(bytes32 packageId) {
    require(
      getPackageOwner(packageId) == msg.sender,
      "You do not have access to the domain of this package"
    );
    _;
  }

  function getPackageOwner(bytes32 packageId) private view returns (address) {
    return Registry(registry).getPackageOwner(packageId);
  }
}
