// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "./helpers/StringToAddressParser.sol";

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

abstract contract VersionManager is StringToAddressParser {
  string polywrapControllerRecordName = "polywrap-controller";

  event NewWeb3API(bytes32 indexed ensNode, bytes32 indexed apiId);
  event AddApiManager(bytes32 indexed apiId, address indexed manager);
  event RemoveApiManager(bytes32 indexed apiId, address indexed manager);
  event NewVersion(
    bytes32 indexed apiId,
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
  mapping(bytes32 => uint256) public registeredAPI;
  mapping(bytes32 => bool) public apiManagers;

  ENS ens;

  constructor(ENS _ens) internal {
    ens = _ens;
  }

  function registerNewWeb3API(bytes32 ensNode) public ensOwner(ensNode) {
    //Create a different hash from ens node to not conflict with subdomains
    bytes32 apiId = keccak256(abi.encodePacked(ensNode));

    require(registeredAPI[apiId] == 0, "API is already registered");

    registeredAPI[apiId] = uint256(ensNode);

    emit NewWeb3API(ensNode, apiId);
  }

  function publishNewVersion(
    bytes32 apiId,
    uint256 majorVersion,
    uint256 minorVersion,
    uint256 patchVersion,
    string memory location
  ) public authorized(apiId) {
    Web3APIVersion storage apiNode = nodes[apiId];

    if (apiNode.latestSubVersion < majorVersion) {
      apiNode.latestSubVersion = majorVersion;
    }
    apiNode.created = true;

    bytes32 majorNodeId = keccak256(abi.encodePacked(apiId, majorVersion));
    Web3APIVersion storage majorNode = nodes[majorNodeId];
    if (majorNode.latestSubVersion < minorVersion) {
      majorNode.latestSubVersion = minorVersion;
    }
    majorNode.created = true;

    bytes32 minorNodeId =
      keccak256(abi.encodePacked(majorNodeId, minorVersion));
    Web3APIVersion storage minorNode = nodes[minorNodeId];

    if (minorNode.latestSubVersion < patchVersion) {
      minorNode.latestSubVersion = patchVersion;
    }
    minorNode.created = true;

    bytes32 patchNodeId =
      keccak256(abi.encodePacked(minorNodeId, patchVersion));

    require(!nodes[patchNodeId].created, "Version is already published");

    nodes[patchNodeId] = Web3APIVersion(true, 0, true, location);

    emit NewVersion(
      apiId,
      patchNodeId,
      majorVersion,
      minorVersion,
      patchVersion,
      location
    );
  }

  function addApiManager(bytes32 apiId, address manager)
    public
    apiOwner(apiId)
  {
    bytes32 key = keccak256(abi.encodePacked(apiId, manager));

    apiManagers[key] = true;

    emit AddApiManager(apiId, manager);
  }

  function removeApiManager(bytes32 apiId, address manager)
    public
    apiOwner(apiId)
  {
    bytes32 key = keccak256(abi.encodePacked(apiId, manager));

    apiManagers[key] = false;

    emit RemoveApiManager(apiId, manager);
  }

  function isAuthorized(bytes32 apiId, address ownerOrManager)
    public
    view
    returns (bool)
  {
    uint256 ensNode = registeredAPI[apiId];

    require(ensNode != 0, "API is not registered");

    if (getPolywrapController(bytes32(ensNode)) == ownerOrManager) {
      return true;
    }

    bytes32 key = keccak256(abi.encodePacked(apiId, ownerOrManager));

    return apiManagers[key];
  }

  modifier ensOwner(bytes32 ensNode) {
    require(
      getPolywrapController(ensNode) == msg.sender,
      "You do not have access to the ENS domain"
    );
    _;
  }

  modifier apiOwner(bytes32 apiId) {
    uint256 ensNode = registeredAPI[apiId];

    require(ensNode != 0, "API is not registered");

    require(
      getPolywrapController(bytes32(ensNode)) == msg.sender,
      "You do not have access to the ENS domain of this API"
    );
    _;
  }

  modifier authorized(bytes32 apiId) {
    require(
      isAuthorized(apiId, msg.sender),
      "You do not have access to this API"
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

    TextResolverInterface ensTextResolver =
      TextResolverInterface(textResolverAddr);

    return
      stringToAddress(
        ensTextResolver.text(ensNode, polywrapControllerRecordName)
      );
  }
}
