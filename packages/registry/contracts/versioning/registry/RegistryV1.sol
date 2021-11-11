// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

abstract contract RegistryV1 is OwnableUpgradeable {
  event OwnershipUpdated(
    bytes32 indexed domainRegistryNode,
    bytes32 packageId,
    bytes32 domainRegistry,
    address indexed owner
  );

  event VersionPublished(
    bytes32 indexed packageId,
    bytes32 indexed versionId,
    string location
  );

  struct VersionNode {
    bool leaf;
    bytes32 latestSubVersion;
    bool created;
    string location; // empty on non-leaf nodes
    bytes32 packageId;
  }

  struct PackageInfo {
    address owner;
    bytes32 domainRegistryNode;
    bytes32 domainRegistry;
  }

  mapping(bytes32 => PackageInfo) public packages;
  mapping(bytes32 => VersionNode) public versionNodes;
  address public ownershipUpdater;
  address public versionPublisher;

  constructor() {
    initialize();
  }

  function initialize() public initializer {
    __Ownable_init();
  }

  function updateOwnershipUpdater(address _ownershipUpdater) public onlyOwner {
    ownershipUpdater = _ownershipUpdater;
  }

  function updateVersionPublisher(address _versionPublisher) public onlyOwner {
    versionPublisher = _versionPublisher;
  }

  function updateOwnership(
    bytes32 domainRegistry,
    bytes32 domainRegistryNode,
    address domainOwner
  ) public {
    assert(msg.sender == ownershipUpdater);

    bytes32 packageId = keccak256(
      abi.encodePacked(
        keccak256(abi.encodePacked(domainRegistryNode)),
        domainRegistry
      )
    );

    packages[packageId] = PackageInfo(
      domainOwner,
      domainRegistryNode,
      domainRegistry
    );

    emit OwnershipUpdated(
      domainRegistryNode,
      packageId,
      domainRegistry,
      domainOwner
    );
  }

  function publishVersion(
    bytes32 packageId,
    bytes32 parentNodeId,
    bytes memory version,
    string memory location
  ) public returns (bytes32) {
    // assert(msg.sender == versionPublisher);
    
    bytes32 lastNodeId;

    VersionNode storage lastNode = versionNodes[packageId];
    lastNode.created = true;
    VersionNode storage currentNode = lastNode;
    lastNodeId = packageId;

    uint256 cnt = 0;
    uint256 pointer;
    assembly {
      pointer := version
    }
    bytes32 identifier;

    while(cnt < version.length) {
      assembly {
        pointer := add(pointer, 32)
        identifier := mload(pointer)
      }
      cnt += 32;
      bytes32 nodeId = keccak256(abi.encodePacked(lastNodeId, identifier));
      lastNodeId = nodeId;
      currentNode = versionNodes[nodeId];
      if (hasLowerPrecedence(lastNode.latestSubVersion, identifier)) {
        lastNode.latestSubVersion = identifier;
      }
      currentNode.created = true;
      lastNode = currentNode;
    }
    
    if(currentNode.created) {
      currentNode.leaf = true;
      currentNode.location = location;
    }

    emit VersionPublished(
      packageId,
      lastNodeId,
      location
    );

    return lastNodeId;
  }

  function hasLowerPrecedence(bytes32 a, bytes32 b) private returns(bool) {
    bool aAlphaNumeric = false;
    bool bAlphaNumeric = false;
    uint8 aI = 0;
    uint8 bI = 0;

    for(uint8 i = 0; i < 32; i++) {
      if(a[i] != 0x0) {
        aI = i;
        break;
      }
    }

    for(uint8 i = 0; i < 32; i++) {
      if(b[i] != 0x0) {
        bI = i;
        break;
      }
    }
    for(uint8 i = 0; i + aI < 32 && i + bI < 32; i++) {
      if(!(a[i+aI] >= 0x30 && a[i+aI] <= 0x39)) {
        aAlphaNumeric = true;
      }
      if(!(b[i+bI] >= 0x30 && b[i+bI] <= 0x39)) {
        bAlphaNumeric = true;
      }

      if(a[i+aI] < b[i+bI]) {
        for(uint8 j = i + 1; j + aI < 32 && j + bI < 32; j++) {
          if(!(a[j+aI] >= 0x30 && a[j+aI] <= 0x39)) {
            aAlphaNumeric = true;
          }
          if(!(b[j+bI] >= 0x30 && b[j+bI] <= 0x39)) {
            bAlphaNumeric = true;
          }
        }

        return (!aAlphaNumeric && aI <= bI) || aAlphaNumeric && bAlphaNumeric;
      } else if(a[i+aI] > b[i+bI]) {
        for(uint8 j = i + 1; j + aI < 32 && j + bI < 32; j++) {
          if(!(a[j+aI] >= 0x30 && a[j+aI] <= 0x39)) {
            aAlphaNumeric = true;
          }
          if(!(b[j+bI] >= 0x30 && b[j+bI] <= 0x39)) {
            bAlphaNumeric = true;
          }
        }

        return aAlphaNumeric && !bAlphaNumeric;
      }
    }
  }

  function getPackageOwner(bytes32 packageId) public view returns (address) {
    return packages[packageId].owner;
  }
}
