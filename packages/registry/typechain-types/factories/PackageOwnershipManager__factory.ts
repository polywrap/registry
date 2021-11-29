/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BytesLike,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  PackageOwnershipManager,
  PackageOwnershipManagerInterface,
} from "../PackageOwnershipManager";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_registry",
        type: "address",
      },
      {
        internalType: "bytes32[]",
        name: "_domainRegistries",
        type: "bytes32[]",
      },
      {
        internalType: "address[]",
        name: "_domainRegistryLinks",
        type: "address[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
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
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "allowedLocalDomainRegistries",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
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
        internalType: "address",
        name: "_domainRegistryLink",
        type: "address",
      },
    ],
    name: "connectDomainRegistryLink",
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
    name: "domainRegistryLinks",
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
        name: "domainRegistry",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "domainRegistryNode",
        type: "bytes32",
      },
    ],
    name: "getPolywrapOwner",
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
    name: "incomingBridgeLinks",
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
        internalType: "address",
        name: "_registry",
        type: "address",
      },
      {
        internalType: "bytes32[]",
        name: "_domainRegistries",
        type: "bytes32[]",
      },
      {
        internalType: "address[]",
        name: "_domainRegistryLinks",
        type: "address[]",
      },
    ],
    name: "initialize",
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
    name: "outgoingBridgeLinks",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "blockchainName",
        type: "bytes32",
      },
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
        name: "owner",
        type: "address",
      },
    ],
    name: "receiveOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "registry",
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
        name: "blockchainName",
        type: "bytes32",
      },
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
    ],
    name: "relayOwnership",
    outputs: [],
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
        name: "blockchainName",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "bridgeLink",
        type: "address",
      },
    ],
    name: "updateIncomingBridgeLink",
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
        internalType: "bool",
        name: "allowed",
        type: "bool",
      },
    ],
    name: "updateLocalDomainRegistryPermission",
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
        name: "blockchainName",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "bridgeLink",
        type: "address",
      },
    ],
    name: "updateOutgoingBridgeLink",
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
        name: "_registry",
        type: "address",
      },
    ],
    name: "updateRegistry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162002c8a38038062002c8a833981810160405281019062000037919062000927565b6200004a8383836200005360201b60201c565b50505062000bb8565b600060019054906101000a900460ff16806200007a575060008054906101000a900460ff16155b620000bc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620000b39062000a48565b60405180910390fd5b60008060019054906101000a900460ff1615905080156200010d576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b6200011d6200027d60201b60201c565b83606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508151835114620001a5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016200019c9062000ae0565b60405180910390fd5b60005b83518110156200025457828181518110620001c857620001c762000b02565b5b602002602001015160666000868481518110620001ea57620001e962000b02565b5b6020026020010151815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080806200024b9062000b6a565b915050620001a8565b508015620002775760008060016101000a81548160ff0219169083151502179055505b50505050565b600060019054906101000a900460ff1680620002a4575060008054906101000a900460ff16155b620002e6576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620002dd9062000a48565b60405180910390fd5b60008060019054906101000a900460ff16159050801562000337576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b620003476200037c60201b60201c565b620003576200045b60201b60201c565b8015620003795760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff1680620003a3575060008054906101000a900460ff16155b620003e5576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620003dc9062000a48565b60405180910390fd5b60008060019054906101000a900460ff16159050801562000436576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b8015620004585760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff168062000482575060008054906101000a900460ff16155b620004c4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620004bb9062000a48565b60405180910390fd5b60008060019054906101000a900460ff16159050801562000515576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b62000535620005296200055a60201b60201c565b6200056260201b60201c565b8015620005575760008060016101000a81548160ff0219169083151502179055505b50565b600033905090565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600062000669826200063c565b9050919050565b6200067b816200065c565b81146200068757600080fd5b50565b6000815190506200069b8162000670565b92915050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620006f182620006a6565b810181811067ffffffffffffffff82111715620007135762000712620006b7565b5b80604052505050565b60006200072862000628565b9050620007368282620006e6565b919050565b600067ffffffffffffffff821115620007595762000758620006b7565b5b602082029050602081019050919050565b600080fd5b6000819050919050565b62000784816200076f565b81146200079057600080fd5b50565b600081519050620007a48162000779565b92915050565b6000620007c1620007bb846200073b565b6200071c565b90508083825260208201905060208402830185811115620007e757620007e66200076a565b5b835b81811015620008145780620007ff888262000793565b845260208401935050602081019050620007e9565b5050509392505050565b600082601f830112620008365762000835620006a1565b5b815162000848848260208601620007aa565b91505092915050565b600067ffffffffffffffff8211156200086f576200086e620006b7565b5b602082029050602081019050919050565b600062000897620008918462000851565b6200071c565b90508083825260208201905060208402830185811115620008bd57620008bc6200076a565b5b835b81811015620008ea5780620008d588826200068a565b845260208401935050602081019050620008bf565b5050509392505050565b600082601f8301126200090c576200090b620006a1565b5b81516200091e84826020860162000880565b91505092915050565b60008060006060848603121562000943576200094262000632565b5b600062000953868287016200068a565b935050602084015167ffffffffffffffff81111562000977576200097662000637565b5b62000985868287016200081e565b925050604084015167ffffffffffffffff811115620009a957620009a862000637565b5b620009b786828701620008f4565b9150509250925092565b600082825260208201905092915050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b600062000a30602e83620009c1565b915062000a3d82620009d2565b604082019050919050565b6000602082019050818103600083015262000a638162000a21565b9050919050565b7f526567697374727920617272617973206d75737420686176652074686520736160008201527f6d65206c656e6774680000000000000000000000000000000000000000000000602082015250565b600062000ac8602983620009c1565b915062000ad58262000a6a565b604082019050919050565b6000602082019050818103600083015262000afb8162000ab9565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000819050919050565b600062000b778262000b60565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141562000bad5762000bac62000b31565b5b600182019050919050565b6120c28062000bc86000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c80638da5cb5b116100a2578063c7c3d18011610071578063c7c3d180146102dd578063d41b4e72146102f9578063e7da1cd614610315578063f2fde38b14610331578063fe50a1111461034d57610116565b80638da5cb5b14610243578063a485572d14610261578063a5d7a24e14610291578063c6fa176e146102ad57610116565b806356033774116100e9578063560337741461019f5780635f47a231146101cf578063715018a6146101eb578063739f0476146101f55780637b1039991461022557610116565b80631a5da6c81461011b5780631cbfb765146101375780634b5c178714610167578063511147bd14610183575b600080fd5b610135600480360381019061013091906114d7565b610369565b005b610151600480360381019061014c919061153a565b6103ad565b60405161015e9190611576565b60405180910390f35b610181600480360381019061017c9190611591565b6103e0565b005b61019d600480360381019061019891906115d1565b6104b2565b005b6101b960048036038101906101b4919061153a565b6105b3565b6040516101c6919061163f565b60405180910390f35b6101e960048036038101906101e4919061165a565b6105d3565b005b6101f3610727565b005b61020f600480360381019061020a919061153a565b6107af565b60405161021c9190611576565b60405180910390f35b61022d6107e2565b60405161023a9190611576565b60405180910390f35b61024b610808565b6040516102589190611576565b60405180910390f35b61027b6004803603810190610276919061153a565b610832565b6040516102889190611576565b60405180910390f35b6102ab60048036038101906102a691906116ad565b610865565b005b6102c760048036038101906102c291906116ad565b610969565b6040516102d49190611576565b60405180910390f35b6102f760048036038101906102f291906115d1565b610a95565b005b610313600480360381019061030e9190611909565b610b96565b005b61032f600480360381019061032a9190611994565b610da5565b005b61034b600480360381019061034691906114d7565b610f49565b005b61036760048036038101906103629190611a27565b611041565b005b80606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60686020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6103e86110ec565b73ffffffffffffffffffffffffffffffffffffffff16610406610808565b73ffffffffffffffffffffffffffffffffffffffff161461045c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161045390611ac4565b60405180910390fd5b806066600084815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b6104ba6110ec565b73ffffffffffffffffffffffffffffffffffffffff166104d8610808565b73ffffffffffffffffffffffffffffffffffffffff161461052e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161052590611ac4565b60405180910390fd5b60008383604051602001610543929190611b05565b604051602081830303815290604052805190602001209050816068600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050565b60676020528060005260406000206000915054906101000a900460ff1681565b60006069600084866040516020016105ec929190611b05565b60405160208183030381529060405280519060200120815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156106a3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161069a90611ba3565b60405180910390fd5b60006106af8484610969565b90508173ffffffffffffffffffffffffffffffffffffffff1663d78801818585846040518463ffffffff1660e01b81526004016106ee93929190611bd2565b600060405180830381600087803b15801561070857600080fd5b505af115801561071c573d6000803e3d6000fd5b505050505050505050565b61072f6110ec565b73ffffffffffffffffffffffffffffffffffffffff1661074d610808565b73ffffffffffffffffffffffffffffffffffffffff16146107a3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161079a90611ac4565b60405180910390fd5b6107ad60006110f4565b565b60666020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60696020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6067600083815260200190815260200160002060009054906101000a900460ff166108c5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108bc90611c7b565b60405180910390fd5b60006108d18383610969565b9050606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663479661488484846040518463ffffffff1660e01b815260040161093293929190611bd2565b600060405180830381600087803b15801561094c57600080fd5b505af1158015610960573d6000803e3d6000fd5b50505050505050565b6000806066600085815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610a12576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a0990611ce7565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff166331ac1d0d846040518263ffffffff1660e01b8152600401610a4b9190611d07565b602060405180830381865afa158015610a68573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a8c9190611d37565b91505092915050565b610a9d6110ec565b73ffffffffffffffffffffffffffffffffffffffff16610abb610808565b73ffffffffffffffffffffffffffffffffffffffff1614610b11576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b0890611ac4565b60405180910390fd5b60008383604051602001610b26929190611b05565b604051602081830303815290604052805190602001209050816069600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050565b600060019054906101000a900460ff1680610bbc575060008054906101000a900460ff16155b610bfb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bf290611dd6565b60405180910390fd5b60008060019054906101000a900460ff161590508015610c4b576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b610c536111ba565b83606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508151835114610cd8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ccf90611e68565b60405180910390fd5b60005b8351811015610d7d57828181518110610cf757610cf6611e88565b5b602002602001015160666000868481518110610d1657610d15611e88565b5b6020026020010151815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508080610d7590611ef0565b915050610cdb565b508015610d9f5760008060016101000a81548160ff0219169083151502179055505b50505050565b6000606860008587604051602001610dbe929190611b05565b60405160208183030381529060405280519060200120815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610e75576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e6c90611fab565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610eb157610eb0611fcb565b5b606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663479661488585856040518463ffffffff1660e01b8152600401610f1093929190611bd2565b600060405180830381600087803b158015610f2a57600080fd5b505af1158015610f3e573d6000803e3d6000fd5b505050505050505050565b610f516110ec565b73ffffffffffffffffffffffffffffffffffffffff16610f6f610808565b73ffffffffffffffffffffffffffffffffffffffff1614610fc5576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610fbc90611ac4565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415611035576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161102c9061206c565b60405180910390fd5b61103e816110f4565b50565b6110496110ec565b73ffffffffffffffffffffffffffffffffffffffff16611067610808565b73ffffffffffffffffffffffffffffffffffffffff16146110bd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110b490611ac4565b60405180910390fd5b806067600084815260200190815260200160002060006101000a81548160ff0219169083151502179055505050565b600033905090565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600060019054906101000a900460ff16806111e0575060008054906101000a900460ff16155b61121f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161121690611dd6565b60405180910390fd5b60008060019054906101000a900460ff16159050801561126f576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b6112776112a3565b61127f61137c565b80156112a05760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff16806112c9575060008054906101000a900460ff16155b611308576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112ff90611dd6565b60405180910390fd5b60008060019054906101000a900460ff161590508015611358576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b80156113795760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff16806113a2575060008054906101000a900460ff16155b6113e1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113d890611dd6565b60405180910390fd5b60008060019054906101000a900460ff161590508015611431576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b61144161143c6110ec565b6110f4565b80156114625760008060016101000a81548160ff0219169083151502179055505b50565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006114a482611479565b9050919050565b6114b481611499565b81146114bf57600080fd5b50565b6000813590506114d1816114ab565b92915050565b6000602082840312156114ed576114ec61146f565b5b60006114fb848285016114c2565b91505092915050565b6000819050919050565b61151781611504565b811461152257600080fd5b50565b6000813590506115348161150e565b92915050565b6000602082840312156115505761154f61146f565b5b600061155e84828501611525565b91505092915050565b61157081611499565b82525050565b600060208201905061158b6000830184611567565b92915050565b600080604083850312156115a8576115a761146f565b5b60006115b685828601611525565b92505060206115c7858286016114c2565b9150509250929050565b6000806000606084860312156115ea576115e961146f565b5b60006115f886828701611525565b935050602061160986828701611525565b925050604061161a868287016114c2565b9150509250925092565b60008115159050919050565b61163981611624565b82525050565b60006020820190506116546000830184611630565b92915050565b6000806000606084860312156116735761167261146f565b5b600061168186828701611525565b935050602061169286828701611525565b92505060406116a386828701611525565b9150509250925092565b600080604083850312156116c4576116c361146f565b5b60006116d285828601611525565b92505060206116e385828601611525565b9150509250929050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61173b826116f2565b810181811067ffffffffffffffff8211171561175a57611759611703565b5b80604052505050565b600061176d611465565b90506117798282611732565b919050565b600067ffffffffffffffff82111561179957611798611703565b5b602082029050602081019050919050565b600080fd5b60006117c26117bd8461177e565b611763565b905080838252602082019050602084028301858111156117e5576117e46117aa565b5b835b8181101561180e57806117fa8882611525565b8452602084019350506020810190506117e7565b5050509392505050565b600082601f83011261182d5761182c6116ed565b5b813561183d8482602086016117af565b91505092915050565b600067ffffffffffffffff82111561186157611860611703565b5b602082029050602081019050919050565b600061188561188084611846565b611763565b905080838252602082019050602084028301858111156118a8576118a76117aa565b5b835b818110156118d157806118bd88826114c2565b8452602084019350506020810190506118aa565b5050509392505050565b600082601f8301126118f0576118ef6116ed565b5b8135611900848260208601611872565b91505092915050565b6000806000606084860312156119225761192161146f565b5b6000611930868287016114c2565b935050602084013567ffffffffffffffff81111561195157611950611474565b5b61195d86828701611818565b925050604084013567ffffffffffffffff81111561197e5761197d611474565b5b61198a868287016118db565b9150509250925092565b600080600080608085870312156119ae576119ad61146f565b5b60006119bc87828801611525565b94505060206119cd87828801611525565b93505060406119de87828801611525565b92505060606119ef878288016114c2565b91505092959194509250565b611a0481611624565b8114611a0f57600080fd5b50565b600081359050611a21816119fb565b92915050565b60008060408385031215611a3e57611a3d61146f565b5b6000611a4c85828601611525565b9250506020611a5d85828601611a12565b9150509250929050565b600082825260208201905092915050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b6000611aae602083611a67565b9150611ab982611a78565b602082019050919050565b60006020820190508181036000830152611add81611aa1565b9050919050565b6000819050919050565b611aff611afa82611504565b611ae4565b82525050565b6000611b118285611aee565b602082019150611b218284611aee565b6020820191508190509392505050565b7f4f7574676f696e672072656c6179206e6f7420737570706f7274656420666f7260008201527f20646f6d61696e20726567697374727920616e6420626c6f636b636861696e00602082015250565b6000611b8d603f83611a67565b9150611b9882611b31565b604082019050919050565b60006020820190508181036000830152611bbc81611b80565b9050919050565b611bcc81611504565b82525050565b6000606082019050611be76000830186611bc3565b611bf46020830185611bc3565b611c016040830184611567565b949350505050565b7f446f6d61696e207265676973747279206973206e6f7420616c6c6f776564206660008201527f6f72206c6f63616c207570646174657300000000000000000000000000000000602082015250565b6000611c65603083611a67565b9150611c7082611c09565b604082019050919050565b60006020820190508181036000830152611c9481611c58565b9050919050565b7f446f6d61696e207265676973747279206973206e6f7420737570706f72746564600082015250565b6000611cd1602083611a67565b9150611cdc82611c9b565b602082019050919050565b60006020820190508181036000830152611d0081611cc4565b9050919050565b6000602082019050611d1c6000830184611bc3565b92915050565b600081519050611d31816114ab565b92915050565b600060208284031215611d4d57611d4c61146f565b5b6000611d5b84828501611d22565b91505092915050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b6000611dc0602e83611a67565b9150611dcb82611d64565b604082019050919050565b60006020820190508181036000830152611def81611db3565b9050919050565b7f526567697374727920617272617973206d75737420686176652074686520736160008201527f6d65206c656e6774680000000000000000000000000000000000000000000000602082015250565b6000611e52602983611a67565b9150611e5d82611df6565b604082019050919050565b60006020820190508181036000830152611e8181611e45565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000819050919050565b6000611efb82611ee6565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415611f2e57611f2d611eb7565b5b600182019050919050565b7f496e636f6d696e672072656c6179206e6f7420737570706f7274656420666f7260008201527f20646f6d61696e20726567697374727920616e6420626c6f636b636861696e00602082015250565b6000611f95603f83611a67565b9150611fa082611f39565b604082019050919050565b60006020820190508181036000830152611fc481611f88565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000612056602683611a67565b915061206182611ffa565b604082019050919050565b6000602082019050818103600083015261208581612049565b905091905056fea2646970667358221220aadbad5f83d5110972b7c9ebf2e4f13c30cd4b77de16afdae7412552a25d61ed64736f6c634300080a0033";

export class PackageOwnershipManager__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    _registry: string,
    _domainRegistries: BytesLike[],
    _domainRegistryLinks: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<PackageOwnershipManager> {
    return super.deploy(
      _registry,
      _domainRegistries,
      _domainRegistryLinks,
      overrides || {}
    ) as Promise<PackageOwnershipManager>;
  }
  getDeployTransaction(
    _registry: string,
    _domainRegistries: BytesLike[],
    _domainRegistryLinks: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _registry,
      _domainRegistries,
      _domainRegistryLinks,
      overrides || {}
    );
  }
  attach(address: string): PackageOwnershipManager {
    return super.attach(address) as PackageOwnershipManager;
  }
  connect(signer: Signer): PackageOwnershipManager__factory {
    return super.connect(signer) as PackageOwnershipManager__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PackageOwnershipManagerInterface {
    return new utils.Interface(_abi) as PackageOwnershipManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PackageOwnershipManager {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as PackageOwnershipManager;
  }
}
