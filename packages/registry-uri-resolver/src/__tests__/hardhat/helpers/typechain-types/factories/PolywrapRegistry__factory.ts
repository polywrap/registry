/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  PolywrapRegistry,
  PolywrapRegistryInterface,
} from "../PolywrapRegistry";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "domainRegistryNode",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "packageId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "domainRegistry",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnershipUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "packageId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "major",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "minor",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "patch",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "location",
        type: "string",
      },
    ],
    name: "VersionPublished",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "packageId",
        type: "bytes32",
      },
    ],
    name: "getLatestVersionInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "majorVersion",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minorVersion",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "patchVersion",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "location",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "versionNodeId",
        type: "bytes32",
      },
    ],
    name: "getPackageLocation",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "packageId",
        type: "bytes32",
      },
    ],
    name: "getPackageOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ownershipUpdater",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "packages",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "domainRegistryNode",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "domainRegistry",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "packageId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "majorVersion",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minorVersion",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "patchVersion",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "location",
        type: "string",
      },
    ],
    name: "publishVersion",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "versionNodeId",
        type: "bytes32",
      },
    ],
    name: "resolveToLeaf",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "domainRegistry",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "domainRegistryNode",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "domainOwner",
        type: "address",
      },
    ],
    name: "updateOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_ownershipUpdater",
        type: "address",
      },
    ],
    name: "updateOwnershipUpdater",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_versionPublisher",
        type: "address",
      },
    ],
    name: "updateVersionPublisher",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "versionNodes",
    outputs: [
      {
        internalType: "bool",
        name: "leaf",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "latestSubVersion",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "created",
        type: "bool",
      },
      {
        internalType: "string",
        name: "location",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "versionPublisher",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50620000226200002860201b60201c565b6200056b565b600060019054906101000a900460ff16806200004f575060008054906101000a900460ff16155b62000091576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620000889062000549565b60405180910390fd5b60008060019054906101000a900460ff161590508015620000e2576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b620000f26200011760201b60201c565b8015620001145760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff16806200013e575060008054906101000a900460ff16155b62000180576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620001779062000549565b60405180910390fd5b60008060019054906101000a900460ff161590508015620001d1576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b620001e16200021660201b60201c565b620001f1620002f560201b60201c565b8015620002135760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff16806200023d575060008054906101000a900460ff16155b6200027f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620002769062000549565b60405180910390fd5b60008060019054906101000a900460ff161590508015620002d0576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b8015620002f25760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff16806200031c575060008054906101000a900460ff16155b6200035e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620003559062000549565b60405180910390fd5b60008060019054906101000a900460ff161590508015620003af576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b620003cf620003c3620003f460201b60201c565b620003fc60201b60201c565b8015620003f15760008060016101000a81548160ff0219169083151502179055505b50565b600033905090565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600082825260208201905092915050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b600062000531602e83620004c2565b91506200053e82620004d3565b604082019050919050565b60006020820190508181036000830152620005648162000522565b9050919050565b611e74806200057b6000396000f3fe608060405234801561001057600080fd5b50600436106101005760003560e01c806371102819116100975780638da5cb5b116100665780638da5cb5b146102c7578063c9f006b6146102e5578063ecb1b8d514610301578063f2fde38b1461031f57610100565b80637110281914610251578063715018a61461028357806371fd7f811461028d5780638129fc1c146102bd57610100565b80635ab608e3116100d35780635ab608e3146101b15780635f80affe146101cf57806366b606a51461020257806369317eb71461021e57610100565b8063233a1d9914610105578063427a94d41461013557806347966148146101655780634dc1d99d14610181575b600080fd5b61011f600480360381019061011a9190611553565b61033b565b60405161012c919061158f565b60405180910390f35b61014f600480360381019061014a9190611553565b610408565b60405161015c91906115eb565b60405180910390f35b61017f600480360381019061017a9190611632565b610448565b005b61019b60048036038101906101969190611801565b6105f2565b6040516101a8919061158f565b60405180910390f35b6101b9610910565b6040516101c691906115eb565b60405180910390f35b6101e960048036038101906101e49190611553565b610936565b6040516101f9949392919061192f565b60405180910390f35b61021c6004803603810190610217919061197b565b610aea565b005b61023860048036038101906102339190611553565b610baa565b60405161024894939291906119c3565b60405180910390f35b61026b60048036038101906102669190611553565b610c7c565b60405161027a93929190611a0f565b60405180910390f35b61028b610cc6565b005b6102a760048036038101906102a29190611553565b610d4e565b6040516102b49190611a46565b60405180910390f35b6102c5610e04565b005b6102cf610ee5565b6040516102dc91906115eb565b60405180910390f35b6102ff60048036038101906102fa919061197b565b610f0f565b005b610309610fcf565b60405161031691906115eb565b60405180910390f35b6103396004803603810190610334919061197b565b610ff5565b005b6000806065600084815260200190815260200160002090508060020160009054906101000a900460ff166103a4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161039b90611ab4565b60405180910390fd5b8060000160009054906101000a900460ff16156103c45782915050610403565b60008382600101546040516020016103dd929190611b16565b6040516020818303038152906040528051906020012090506103fe8161033b565b925050505b919050565b60006066600083815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b606760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146104a6576104a5611b42565b5b6000826040516020016104b99190611b71565b60405160208183030381529060405280519060200120846040516020016104e1929190611b8c565b60405160208183030381529060405280519060200120905060405180606001604052808373ffffffffffffffffffffffffffffffffffffffff168152602001848152602001858152506066600083815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010155604082015181600201559050508173ffffffffffffffffffffffffffffffffffffffff16837f7f290f38b12a4ba0db0dae399f91016a9fbf6c954370fc1988e92953060d5e5183876040516105e4929190611bb8565b60405180910390a350505050565b6000606860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461065257610651611b42565b5b60008686604051602001610667929190611b16565b60405160208183030381529060405280519060200120905060008186604051602001610694929190611b16565b604051602081830303815290604052805190602001209050600081866040516020016106c1929190611b16565b6040516020818303038152906040528051906020012090506000606560008b81526020019081526020016000209050600060656000868152602001908152602001600020905060006065600086815260200190815260200160002090508a83600101541015610734578a83600101819055505b60018360020160006101000a81548160ff0219169083151502179055508982600101541015610767578982600101819055505b60018260020160006101000a81548160ff021916908315150217905550888160010154101561079a578881600101819055505b60018160020160006101000a81548160ff0219169083151502179055506065600085815260200190815260200160002060020160009054906101000a900460ff161561081b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161081290611c2d565b60405180910390fd5b604051806080016040528060011515815260200160008152602001600115158152602001898152506065600086815260200190815260200160002060008201518160000160006101000a81548160ff0219169083151502179055506020820151816001015560408201518160020160006101000a81548160ff02191690831515021790555060608201518160030190805190602001906108bc929190611466565b509050508b7fa0cf073ede1b5fef0ae41259066849d8f4af26eb95525731a11b3b6cdde968588c8c8c8c6040516108f6949392919061192f565b60405180910390a283965050505050505095945050505050565b606860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008060006060600060656000878152602001908152602001600020905060008160010154905060008782604051602001610972929190611b16565b6040516020818303038152906040528051906020012090506000606560008381526020019081526020016000209050600081600101549050600083826040516020016109bf929190611b16565b604051602081830303815290604052805190602001209050600060656000838152602001908152602001600020905060008160010154905060008382604051602001610a0c929190611b16565b60405160208183030381529060405280519060200120905060006065600083815260200190815260200160002090506000816003018054610a4c90611c7c565b80601f0160208091040260200160405190810160405280929190818152602001828054610a7890611c7c565b8015610ac55780601f10610a9a57610100808354040283529160200191610ac5565b820191906000526020600020905b815481529060010190602001808311610aa857829003601f168201915b50505050509050898785839e509e509e509e5050505050505050505050509193509193565b610af26110ed565b73ffffffffffffffffffffffffffffffffffffffff16610b10610ee5565b73ffffffffffffffffffffffffffffffffffffffff1614610b66576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b5d90611cfa565b60405180910390fd5b80606860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60656020528060005260406000206000915090508060000160009054906101000a900460ff16908060010154908060020160009054906101000a900460ff1690806003018054610bf990611c7c565b80601f0160208091040260200160405190810160405280929190818152602001828054610c2590611c7c565b8015610c725780601f10610c4757610100808354040283529160200191610c72565b820191906000526020600020905b815481529060010190602001808311610c5557829003601f168201915b5050505050905084565b60666020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010154908060020154905083565b610cce6110ed565b73ffffffffffffffffffffffffffffffffffffffff16610cec610ee5565b73ffffffffffffffffffffffffffffffffffffffff1614610d42576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d3990611cfa565b60405180910390fd5b610d4c60006110f5565b565b60606000610d5b8361033b565b9050606560008281526020019081526020016000206003018054610d7e90611c7c565b80601f0160208091040260200160405190810160405280929190818152602001828054610daa90611c7c565b8015610df75780601f10610dcc57610100808354040283529160200191610df7565b820191906000526020600020905b815481529060010190602001808311610dda57829003601f168201915b5050505050915050919050565b600060019054906101000a900460ff1680610e2a575060008054906101000a900460ff16155b610e69576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e6090611d8c565b60405180910390fd5b60008060019054906101000a900460ff161590508015610eb9576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b610ec16111bb565b8015610ee25760008060016101000a81548160ff0219169083151502179055505b50565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b610f176110ed565b73ffffffffffffffffffffffffffffffffffffffff16610f35610ee5565b73ffffffffffffffffffffffffffffffffffffffff1614610f8b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f8290611cfa565b60405180910390fd5b80606760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b606760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610ffd6110ed565b73ffffffffffffffffffffffffffffffffffffffff1661101b610ee5565b73ffffffffffffffffffffffffffffffffffffffff1614611071576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161106890611cfa565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156110e1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110d890611e1e565b60405180910390fd5b6110ea816110f5565b50565b600033905090565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600060019054906101000a900460ff16806111e1575060008054906101000a900460ff16155b611220576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161121790611d8c565b60405180910390fd5b60008060019054906101000a900460ff161590508015611270576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b6112786112a4565b61128061137d565b80156112a15760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff16806112ca575060008054906101000a900460ff16155b611309576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161130090611d8c565b60405180910390fd5b60008060019054906101000a900460ff161590508015611359576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b801561137a5760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff16806113a3575060008054906101000a900460ff16155b6113e2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113d990611d8c565b60405180910390fd5b60008060019054906101000a900460ff161590508015611432576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b61144261143d6110ed565b6110f5565b80156114635760008060016101000a81548160ff0219169083151502179055505b50565b82805461147290611c7c565b90600052602060002090601f01602090048101928261149457600085556114db565b82601f106114ad57805160ff19168380011785556114db565b828001600101855582156114db579182015b828111156114da5782518255916020019190600101906114bf565b5b5090506114e891906114ec565b5090565b5b808211156115055760008160009055506001016114ed565b5090565b6000604051905090565b600080fd5b600080fd5b6000819050919050565b6115308161151d565b811461153b57600080fd5b50565b60008135905061154d81611527565b92915050565b60006020828403121561156957611568611513565b5b60006115778482850161153e565b91505092915050565b6115898161151d565b82525050565b60006020820190506115a46000830184611580565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006115d5826115aa565b9050919050565b6115e5816115ca565b82525050565b600060208201905061160060008301846115dc565b92915050565b61160f816115ca565b811461161a57600080fd5b50565b60008135905061162c81611606565b92915050565b60008060006060848603121561164b5761164a611513565b5b60006116598682870161153e565b935050602061166a8682870161153e565b925050604061167b8682870161161d565b9150509250925092565b6000819050919050565b61169881611685565b81146116a357600080fd5b50565b6000813590506116b58161168f565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61170e826116c5565b810181811067ffffffffffffffff8211171561172d5761172c6116d6565b5b80604052505050565b6000611740611509565b905061174c8282611705565b919050565b600067ffffffffffffffff82111561176c5761176b6116d6565b5b611775826116c5565b9050602081019050919050565b82818337600083830152505050565b60006117a461179f84611751565b611736565b9050828152602081018484840111156117c0576117bf6116c0565b5b6117cb848285611782565b509392505050565b600082601f8301126117e8576117e76116bb565b5b81356117f8848260208601611791565b91505092915050565b600080600080600060a0868803121561181d5761181c611513565b5b600061182b8882890161153e565b955050602061183c888289016116a6565b945050604061184d888289016116a6565b935050606061185e888289016116a6565b925050608086013567ffffffffffffffff81111561187f5761187e611518565b5b61188b888289016117d3565b9150509295509295909350565b6118a181611685565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b838110156118e15780820151818401526020810190506118c6565b838111156118f0576000848401525b50505050565b6000611901826118a7565b61190b81856118b2565b935061191b8185602086016118c3565b611924816116c5565b840191505092915050565b60006080820190506119446000830187611898565b6119516020830186611898565b61195e6040830185611898565b818103606083015261197081846118f6565b905095945050505050565b60006020828403121561199157611990611513565b5b600061199f8482850161161d565b91505092915050565b60008115159050919050565b6119bd816119a8565b82525050565b60006080820190506119d860008301876119b4565b6119e56020830186611898565b6119f260408301856119b4565b8181036060830152611a0481846118f6565b905095945050505050565b6000606082019050611a2460008301866115dc565b611a316020830185611580565b611a3e6040830184611580565b949350505050565b60006020820190508181036000830152611a6081846118f6565b905092915050565b7f496e76616c6964204e6f64650000000000000000000000000000000000000000600082015250565b6000611a9e600c836118b2565b9150611aa982611a68565b602082019050919050565b60006020820190508181036000830152611acd81611a91565b9050919050565b6000819050919050565b611aef611aea8261151d565b611ad4565b82525050565b6000819050919050565b611b10611b0b82611685565b611af5565b82525050565b6000611b228285611ade565b602082019150611b328284611aff565b6020820191508190509392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b6000611b7d8284611ade565b60208201915081905092915050565b6000611b988285611ade565b602082019150611ba88284611ade565b6020820191508190509392505050565b6000604082019050611bcd6000830185611580565b611bda6020830184611580565b9392505050565b7f56657273696f6e20697320616c7265616479207075626c697368656400000000600082015250565b6000611c17601c836118b2565b9150611c2282611be1565b602082019050919050565b60006020820190508181036000830152611c4681611c0a565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680611c9457607f821691505b60208210811415611ca857611ca7611c4d565b5b50919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b6000611ce46020836118b2565b9150611cef82611cae565b602082019050919050565b60006020820190508181036000830152611d1381611cd7565b9050919050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b6000611d76602e836118b2565b9150611d8182611d1a565b604082019050919050565b60006020820190508181036000830152611da581611d69565b9050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000611e086026836118b2565b9150611e1382611dac565b604082019050919050565b60006020820190508181036000830152611e3781611dfb565b905091905056fea2646970667358221220c723f41eb3d8615dc041810d8eaf52989d77eda508398242df83b2879888385964736f6c634300080a0033";

type PolywrapRegistryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PolywrapRegistryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PolywrapRegistry__factory extends ContractFactory {
  constructor(...args: PolywrapRegistryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<PolywrapRegistry> {
    return super.deploy(overrides || {}) as Promise<PolywrapRegistry>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): PolywrapRegistry {
    return super.attach(address) as PolywrapRegistry;
  }
  connect(signer: Signer): PolywrapRegistry__factory {
    return super.connect(signer) as PolywrapRegistry__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PolywrapRegistryInterface {
    return new utils.Interface(_abi) as PolywrapRegistryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PolywrapRegistry {
    return new Contract(address, _abi, signerOrProvider) as PolywrapRegistry;
  }
}
