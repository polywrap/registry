// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/profiles/TextResolver.sol";
import "./NodeIdResolver.sol";
import "./StringToAddressParser.sol";

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

abstract contract VersionManager is NodeIdResolver, StringToAddressParser {
  string polywrapControllerRecordName = "polywrap-controller";

  event NewWeb3API(bytes32 indexed ensNode);
  event NewVersion(
    bytes32 indexed ensNode,
    bytes32 versionId,
    uint256 major,
    uint256 minor,
    uint256 patch,
    string location
  );

  struct Web3APIVersion {
    bool leaf;
    uint256 latestSubVersion;
    bool created;
    string location; // empty on non-leaf nodes
  }

  mapping(bytes32 => Web3APIVersion) public nodes;
  mapping(bytes32 => bool) public registeredAPI;

  ENS ens;

  constructor(ENS _ens) internal {
    ens = _ens;
  }

  function registerNewWeb3API(bytes32 ensNode) public authorised(ensNode) {
    require(!registeredAPI[ensNode], "API is already registered");

    registeredAPI[ensNode] = true;

    emit NewWeb3API(ensNode);
  }

  function publishNewVersion(
    bytes32 ensNode,
    uint256 majorVersion,
    uint256 minorVersion,
    uint256 patchVersion,
    string memory location
  ) public authorised(ensNode) {
    Web3APIVersion storage latestNode = nodes[ensNode];

    if (latestNode.latestSubVersion < majorVersion) {
      latestNode.latestSubVersion = majorVersion;
    }
    latestNode.created = true;

    bytes32 majorNodeId = getMajorNodeId(ensNode, majorVersion);
    Web3APIVersion storage majorNode = nodes[majorNodeId];
    if (majorNode.latestSubVersion < minorVersion) {
      majorNode.latestSubVersion = minorVersion;
    }
    majorNode.created = true;

    bytes32 minorNodeId = getMinorNodeId(majorNodeId, minorVersion);
    Web3APIVersion storage minorNode = nodes[minorNodeId];

    if (majorNode.latestSubVersion < minorVersion) {
      majorNode.latestSubVersion = minorVersion;
    }
    majorNode.created = true;

    if (minorNode.latestSubVersion < patchVersion) {
      minorNode.latestSubVersion = patchVersion;
    }
    minorNode.created = true;

    bytes32 patchNodeId = getPatchNodeId(minorNodeId, patchVersion);

    require(!nodes[patchNodeId].created, "Version is already published");

    nodes[patchNodeId] = Web3APIVersion(true, 0, true, location);

    emit NewVersion(
      ensNode,
      patchNodeId,
      majorVersion,
      minorVersion,
      patchVersion,
      location
    );
  }

  modifier authorised(bytes32 ensNode) {
    address textResolverAddr = ens.resolver(ensNode);

    require(textResolverAddr != address(0), "Resolver not set");

    TextResolverInterface ensTextResolver =
      TextResolverInterface(textResolverAddr);

    require(
      bytesToAddress(
        ensTextResolver.text(ensNode, polywrapControllerRecordName)
      ) == msg.sender,
      "You do not have access to the specified ENS domain"
    );
    _;
  }
}
