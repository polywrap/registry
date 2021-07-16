// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "../helpers/StringToAddressParser.sol";

interface TextResolverInterface {
  function setText(
    bytes32 node,
    string calldata key,
    string calldata value
  ) external;

  function text(bytes32 node, string calldata key)
    external
    view
    returns (string memory);
}

abstract contract VersionRegistry is StringToAddressParser {
  string internal constant POLYWRAP_OWNER_RECORD_NAME = "polywrap-owner";

  event OwnershipUpdated(
    bytes32 indexed registrarNode,
    bytes32 packageId,
    bytes32 registrar,
    address indexed owner
  );

  event VersionPublished(
    bytes32 indexed packageId,
    bytes32 versionId,
    uint256 major,
    uint256 minor,
    uint256 patch,
    string location
  );

  struct PackageVersion {
    bool leaf;
    uint256 latestSubVersion;
    bool created;
    string location; // empty on non-leaf nodes
  }

  struct PackageInfo {
    address owner;
    uint256 registrarNode;
    bytes32 registrar;
  }

  mapping(bytes32 => PackageVersion) public nodes;
  mapping(bytes32 => PackageInfo) public packages;

  ENS public ens;

  constructor(ENS _ens) internal {
    ens = _ens;
  }

  function updateOwnershipEns(bytes32 ensNode) public {
    bytes32 registrar = "ens";

    bytes32 packageId = keccak256(
      abi.encodePacked(keccak256(abi.encodePacked(ensNode)), registrar)
    );

    address owner = getPolywrapOwnerEns(ensNode);
    packages[packageId] = PackageInfo(owner, uint256(ensNode), registrar);

    emit OwnershipUpdated(ensNode, packageId, registrar, owner);
  }

  function publishNewVersion(
    bytes32 packageId,
    uint256 majorVersion,
    uint256 minorVersion,
    uint256 patchVersion,
    string memory location
  ) public authorized(packageId) {
    PackageVersion storage packageNode = nodes[packageId];

    if (packageNode.latestSubVersion < majorVersion) {
      packageNode.latestSubVersion = majorVersion;
    }
    packageNode.created = true;

    bytes32 majorNodeId = keccak256(abi.encodePacked(packageId, majorVersion));
    PackageVersion storage majorNode = nodes[majorNodeId];
    if (majorNode.latestSubVersion < minorVersion) {
      majorNode.latestSubVersion = minorVersion;
    }
    majorNode.created = true;

    bytes32 minorNodeId = keccak256(
      abi.encodePacked(majorNodeId, minorVersion)
    );
    PackageVersion storage minorNode = nodes[minorNodeId];

    if (minorNode.latestSubVersion < patchVersion) {
      minorNode.latestSubVersion = patchVersion;
    }
    minorNode.created = true;

    bytes32 patchNodeId = keccak256(
      abi.encodePacked(minorNodeId, patchVersion)
    );

    require(!nodes[patchNodeId].created, "Version is already published");

    nodes[patchNodeId] = PackageVersion(true, 0, true, location);

    emit VersionPublished(
      packageId,
      patchNodeId,
      majorVersion,
      minorVersion,
      patchVersion,
      location
    );
  }

  function isAuthorized(bytes32 packageId, address ownerOrManager)
    public
    view
    virtual
    returns (bool);

  modifier packageOwner(bytes32 packageId) {
    PackageInfo memory packageInfo = packages[packageId];

    require(packageInfo.registrarNode != 0, "Package is not registered");

    require(
      packageInfo.owner == msg.sender,
      "You do not have access to the domain of this package"
    );
    _;
  }

  modifier authorized(bytes32 packageId) {
    require(
      isAuthorized(packageId, msg.sender),
      "You do not have access to this package"
    );
    _;
  }

  function getPolywrapOwnerEns(bytes32 ensNode)
    internal
    view
    returns (address)
  {
    address textResolverAddr = ens.resolver(ensNode);

    require(textResolverAddr != address(0), "Resolver not set");

    TextResolverInterface ensTextResolver = TextResolverInterface(
      textResolverAddr
    );

    return
      stringToAddress(
        ensTextResolver.text(ensNode, POLYWRAP_OWNER_RECORD_NAME)
      );
  }
}
