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
  string internal constant POLYWRAP_CONTROLLER_RECORD_NAME =
    "polywrap-controller";

  event PackageRegistered(
    bytes32 indexed ensNode,
    bytes32 indexed packageId,
    address indexed controller
  );

  event ControllerChanged(
    bytes32 indexed ensNode,
    bytes32 indexed packageId,
    address indexed controller
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
    address controller;
    uint256 ensNode;
  }

  mapping(bytes32 => PackageVersion) public nodes;
  mapping(bytes32 => PackageInfo) public packages;

  ENS internal ens;

  constructor(ENS _ens) internal {
    ens = _ens;
  }

  function registerPackage(bytes32 ensNode) public {
    //Create a different hash from ens node to not conflict with subdomains
    bytes32 packageId = keccak256(abi.encodePacked(ensNode));

    require(packages[packageId].ensNode == 0, "Package is already registered");

    address controller = getPolywrapController(ensNode);
    packages[packageId] = PackageInfo(controller, uint256(ensNode));

    emit PackageRegistered(ensNode, packageId, controller);
  }

  function updateOwnership(bytes32 packageId) public {
    PackageInfo memory packageInfo = packages[packageId];

    require(packageInfo.ensNode != 0, "Pacakage is not registered");

    address controller = getPolywrapController(bytes32(packageInfo.ensNode));
    packages[packageId].controller = controller;
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

    require(packageInfo.ensNode != 0, "Package is not registered");

    require(
      packageInfo.controller == msg.sender,
      "You do not have access to the ENS domain of this package"
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

  function getPolywrapController(bytes32 ensNode)
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
        ensTextResolver.text(ensNode, POLYWRAP_CONTROLLER_RECORD_NAME)
      );
  }
}
