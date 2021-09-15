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
  "0x60806040523480156200001157600080fd5b5060405162002d5738038062002d578339818101604052810190620000379190620007ad565b6200004a8383836200005360201b60201c565b50505062000b6c565b600060019054906101000a900460ff16806200007a575060008054906101000a900460ff16155b620000bc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620000b39062000883565b60405180910390fd5b60008060019054906101000a900460ff1615905080156200010d576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b6200011d620002c560201b60201c565b83606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508151835114620001a5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016200019c90620008a5565b60405180910390fd5b60005b83518110156200029c57828181518110620001ec577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200260200101516066600086848151811062000232577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6020026020010151815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080806200029390620009dd565b915050620001a8565b508015620002bf5760008060016101000a81548160ff0219169083151502179055505b50505050565b600060019054906101000a900460ff1680620002ec575060008054906101000a900460ff16155b6200032e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620003259062000883565b60405180910390fd5b60008060019054906101000a900460ff1615905080156200037f576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b6200038f620003c460201b60201c565b6200039f620004a360201b60201c565b8015620003c15760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff1680620003eb575060008054906101000a900460ff16155b6200042d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620004249062000883565b60405180910390fd5b60008060019054906101000a900460ff1615905080156200047e576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b8015620004a05760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff1680620004ca575060008054906101000a900460ff16155b6200050c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620005039062000883565b60405180910390fd5b60008060019054906101000a900460ff1615905080156200055d576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b60006200056f6200063360201b60201c565b905080603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3508015620006305760008060016101000a81548160ff0219169083151502179055505b50565b600033905090565b6000620006526200064c84620008f0565b620008c7565b905080838252602082019050828560208602820111156200067257600080fd5b60005b85811015620006a657816200068b888262000725565b84526020840193506020830192505060018101905062000675565b5050509392505050565b6000620006c7620006c1846200091f565b620008c7565b90508083825260208201905082856020860282011115620006e757600080fd5b60005b858110156200071b578162000700888262000796565b845260208401935060208301925050600181019050620006ea565b5050509392505050565b600081519050620007368162000b38565b92915050565b600082601f8301126200074e57600080fd5b8151620007608482602086016200063b565b91505092915050565b600082601f8301126200077b57600080fd5b81516200078d848260208601620006b0565b91505092915050565b600081519050620007a78162000b52565b92915050565b600080600060608486031215620007c357600080fd5b6000620007d38682870162000725565b935050602084015167ffffffffffffffff811115620007f157600080fd5b620007ff8682870162000769565b925050604084015167ffffffffffffffff8111156200081d57600080fd5b6200082b868287016200073c565b9150509250925092565b600062000844602e836200094e565b9150620008518262000a9a565b604082019050919050565b60006200086b6029836200094e565b9150620008788262000ae9565b604082019050919050565b600060208201905081810360008301526200089e8162000835565b9050919050565b60006020820190508181036000830152620008c0816200085c565b9050919050565b6000620008d3620008e6565b9050620008e18282620009a7565b919050565b6000604051905090565b600067ffffffffffffffff8211156200090e576200090d62000a5a565b5b602082029050602081019050919050565b600067ffffffffffffffff8211156200093d576200093c62000a5a565b5b602082029050602081019050919050565b600082825260208201905092915050565b60006200096c826200097d565b9050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b620009b28262000a89565b810181811067ffffffffffffffff82111715620009d457620009d362000a5a565b5b80604052505050565b6000620009ea826200099d565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141562000a205762000a1f62000a2b565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b7f526567697374727920617272617973206d75737420686176652074686520736160008201527f6d65206c656e6774680000000000000000000000000000000000000000000000602082015250565b62000b43816200095f565b811462000b4f57600080fd5b50565b62000b5d8162000973565b811462000b6957600080fd5b50565b6121db8062000b7c6000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c80638da5cb5b116100a2578063c7c3d18011610071578063c7c3d180146102dd578063d41b4e72146102f9578063e7da1cd614610315578063f2fde38b14610331578063fe50a1111461034d57610116565b80638da5cb5b14610243578063a485572d14610261578063a5d7a24e14610291578063c6fa176e146102ad57610116565b806356033774116100e9578063560337741461019f5780635f47a231146101cf578063715018a6146101eb578063739f0476146101f55780637b1039991461022557610116565b80631a5da6c81461011b5780631cbfb765146101375780634b5c178714610167578063511147bd14610183575b600080fd5b610135600480360381019061013091906117a2565b610369565b005b610151600480360381019061014c9190611873565b6103ad565b60405161015e9190611bd9565b60405180910390f35b610181600480360381019061017c919061189c565b6103e0565b005b61019d60048036038101906101989190611950565b6104b2565b005b6101b960048036038101906101b49190611873565b6105b3565b6040516101c69190611bf4565b60405180910390f35b6101e960048036038101906101e4919061199f565b6105d3565b005b6101f3610727565b005b61020f600480360381019061020a9190611873565b610864565b60405161021c9190611bd9565b60405180910390f35b61022d610897565b60405161023a9190611bd9565b60405180910390f35b61024b6108bd565b6040516102589190611bd9565b60405180910390f35b61027b60048036038101906102769190611873565b6108e7565b6040516102889190611bd9565b60405180910390f35b6102ab60048036038101906102a69190611914565b61091a565b005b6102c760048036038101906102c29190611914565b610a1e565b6040516102d49190611bd9565b60405180910390f35b6102f760048036038101906102f29190611950565b610b59565b005b610313600480360381019061030e91906117f4565b610c5a565b005b61032f600480360381019061032a91906119ee565b610eb5565b005b61034b600480360381019061034691906117a2565b61107f565b005b610367600480360381019061036291906118d8565b61122b565b005b80606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60686020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6103e86112d6565b73ffffffffffffffffffffffffffffffffffffffff166104066108bd565b73ffffffffffffffffffffffffffffffffffffffff161461045c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161045390611d21565b60405180910390fd5b806066600084815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b6104ba6112d6565b73ffffffffffffffffffffffffffffffffffffffff166104d86108bd565b73ffffffffffffffffffffffffffffffffffffffff161461052e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161052590611d21565b60405180910390fd5b60008383604051602001610543929190611bad565b604051602081830303815290604052805190602001209050816068600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050565b60676020528060005260406000206000915054906101000a900460ff1681565b60006069600084866040516020016105ec929190611bad565b60405160208183030381529060405280519060200120815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156106a3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161069a90611c61565b60405180910390fd5b60006106af8484610a1e565b90508173ffffffffffffffffffffffffffffffffffffffff1663d78801818585846040518463ffffffff1660e01b81526004016106ee93929190611c2a565b600060405180830381600087803b15801561070857600080fd5b505af115801561071c573d6000803e3d6000fd5b505050505050505050565b61072f6112d6565b73ffffffffffffffffffffffffffffffffffffffff1661074d6108bd565b73ffffffffffffffffffffffffffffffffffffffff16146107a3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161079a90611d21565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff16603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a36000603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b60666020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60696020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6067600083815260200190815260200160002060009054906101000a900460ff1661097a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161097190611d01565b60405180910390fd5b60006109868383610a1e565b9050606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663479661488484846040518463ffffffff1660e01b81526004016109e793929190611c2a565b600060405180830381600087803b158015610a0157600080fd5b505af1158015610a15573d6000803e3d6000fd5b50505050505050565b6000806066600085815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610ac7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610abe90611ca1565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff166331ac1d0d846040518263ffffffff1660e01b8152600401610b009190611c0f565b60206040518083038186803b158015610b1857600080fd5b505afa158015610b2c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b5091906117cb565b91505092915050565b610b616112d6565b73ffffffffffffffffffffffffffffffffffffffff16610b7f6108bd565b73ffffffffffffffffffffffffffffffffffffffff1614610bd5576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bcc90611d21565b60405180910390fd5b60008383604051602001610bea929190611bad565b604051602081830303815290604052805190602001209050816069600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050565b600060019054906101000a900460ff1680610c80575060008054906101000a900460ff16155b610cbf576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cb690611ce1565b60405180910390fd5b60008060019054906101000a900460ff161590508015610d0f576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b610d176112de565b83606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508151835114610d9c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d9390611d41565b60405180910390fd5b60005b8351811015610e8d57828181518110610de1577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001015160666000868481518110610e26577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6020026020010151815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508080610e8590611e72565b915050610d9f565b508015610eaf5760008060016101000a81548160ff0219169083151502179055505b50505050565b6000606860008587604051602001610ece929190611bad565b60405160208183030381529060405280519060200120815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610f85576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f7c90611cc1565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610fe7577f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663479661488585856040518463ffffffff1660e01b815260040161104693929190611c2a565b600060405180830381600087803b15801561106057600080fd5b505af1158015611074573d6000803e3d6000fd5b505050505050505050565b6110876112d6565b73ffffffffffffffffffffffffffffffffffffffff166110a56108bd565b73ffffffffffffffffffffffffffffffffffffffff16146110fb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110f290611d21565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141561116b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161116290611c81565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff16603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a380603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6112336112d6565b73ffffffffffffffffffffffffffffffffffffffff166112516108bd565b73ffffffffffffffffffffffffffffffffffffffff16146112a7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161129e90611d21565b60405180910390fd5b806067600084815260200190815260200160002060006101000a81548160ff0219169083151502179055505050565b600033905090565b600060019054906101000a900460ff1680611304575060008054906101000a900460ff16155b611343576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161133a90611ce1565b60405180910390fd5b60008060019054906101000a900460ff161590508015611393576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b61139b6113c7565b6113a36114a0565b80156113c45760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff16806113ed575060008054906101000a900460ff16155b61142c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161142390611ce1565b60405180910390fd5b60008060019054906101000a900460ff16159050801561147c576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b801561149d5760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff16806114c6575060008054906101000a900460ff16155b611505576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016114fc90611ce1565b60405180910390fd5b60008060019054906101000a900460ff161590508015611555576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b600061155f6112d6565b905080603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a350801561161f5760008060016101000a81548160ff0219169083151502179055505b50565b600061163561163084611d86565b611d61565b9050808382526020820190508285602086028201111561165457600080fd5b60005b85811015611684578161166a88826116fa565b845260208401935060208301925050600181019050611657565b5050509392505050565b60006116a161169c84611db2565b611d61565b905080838252602082019050828560208602820111156116c057600080fd5b60005b858110156116f057816116d6888261178d565b8452602084019350602083019250506001810190506116c3565b5050509392505050565b60008135905061170981612160565b92915050565b60008151905061171e81612160565b92915050565b600082601f83011261173557600080fd5b8135611745848260208601611622565b91505092915050565b600082601f83011261175f57600080fd5b813561176f84826020860161168e565b91505092915050565b60008135905061178781612177565b92915050565b60008135905061179c8161218e565b92915050565b6000602082840312156117b457600080fd5b60006117c2848285016116fa565b91505092915050565b6000602082840312156117dd57600080fd5b60006117eb8482850161170f565b91505092915050565b60008060006060848603121561180957600080fd5b6000611817868287016116fa565b935050602084013567ffffffffffffffff81111561183457600080fd5b6118408682870161174e565b925050604084013567ffffffffffffffff81111561185d57600080fd5b61186986828701611724565b9150509250925092565b60006020828403121561188557600080fd5b60006118938482850161178d565b91505092915050565b600080604083850312156118af57600080fd5b60006118bd8582860161178d565b92505060206118ce858286016116fa565b9150509250929050565b600080604083850312156118eb57600080fd5b60006118f98582860161178d565b925050602061190a85828601611778565b9150509250929050565b6000806040838503121561192757600080fd5b60006119358582860161178d565b92505060206119468582860161178d565b9150509250929050565b60008060006060848603121561196557600080fd5b60006119738682870161178d565b93505060206119848682870161178d565b9250506040611995868287016116fa565b9150509250925092565b6000806000606084860312156119b457600080fd5b60006119c28682870161178d565b93505060206119d38682870161178d565b92505060406119e48682870161178d565b9150509250925092565b60008060008060808587031215611a0457600080fd5b6000611a128782880161178d565b9450506020611a238782880161178d565b9350506040611a348782880161178d565b9250506060611a45878288016116fa565b91505092959194509250565b611a5a81611def565b82525050565b611a6981611e01565b82525050565b611a7881611e0d565b82525050565b611a8f611a8a82611e0d565b611ebb565b82525050565b6000611aa2603f83611dde565b9150611aad82611f34565b604082019050919050565b6000611ac5602683611dde565b9150611ad082611f83565b604082019050919050565b6000611ae8602083611dde565b9150611af382611fd2565b602082019050919050565b6000611b0b603f83611dde565b9150611b1682611ffb565b604082019050919050565b6000611b2e602e83611dde565b9150611b398261204a565b604082019050919050565b6000611b51603083611dde565b9150611b5c82612099565b604082019050919050565b6000611b74602083611dde565b9150611b7f826120e8565b602082019050919050565b6000611b97602983611dde565b9150611ba282612111565b604082019050919050565b6000611bb98285611a7e565b602082019150611bc98284611a7e565b6020820191508190509392505050565b6000602082019050611bee6000830184611a51565b92915050565b6000602082019050611c096000830184611a60565b92915050565b6000602082019050611c246000830184611a6f565b92915050565b6000606082019050611c3f6000830186611a6f565b611c4c6020830185611a6f565b611c596040830184611a51565b949350505050565b60006020820190508181036000830152611c7a81611a95565b9050919050565b60006020820190508181036000830152611c9a81611ab8565b9050919050565b60006020820190508181036000830152611cba81611adb565b9050919050565b60006020820190508181036000830152611cda81611afe565b9050919050565b60006020820190508181036000830152611cfa81611b21565b9050919050565b60006020820190508181036000830152611d1a81611b44565b9050919050565b60006020820190508181036000830152611d3a81611b67565b9050919050565b60006020820190508181036000830152611d5a81611b8a565b9050919050565b6000611d6b611d7c565b9050611d778282611e41565b919050565b6000604051905090565b600067ffffffffffffffff821115611da157611da0611ef4565b5b602082029050602081019050919050565b600067ffffffffffffffff821115611dcd57611dcc611ef4565b5b602082029050602081019050919050565b600082825260208201905092915050565b6000611dfa82611e17565b9050919050565b60008115159050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b611e4a82611f23565b810181811067ffffffffffffffff82111715611e6957611e68611ef4565b5b80604052505050565b6000611e7d82611e37565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415611eb057611eaf611ec5565b5b600182019050919050565b6000819050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f4f7574676f696e672072656c6179206e6f7420737570706f7274656420666f7260008201527f20646f6d61696e20726567697374727920616e6420626c6f636b636861696e00602082015250565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f446f6d61696e207265676973747279206973206e6f7420737570706f72746564600082015250565b7f496e636f6d696e672072656c6179206e6f7420737570706f7274656420666f7260008201527f20646f6d61696e20726567697374727920616e6420626c6f636b636861696e00602082015250565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b7f446f6d61696e207265676973747279206973206e6f7420616c6c6f776564206660008201527f6f72206c6f63616c207570646174657300000000000000000000000000000000602082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b7f526567697374727920617272617973206d75737420686176652074686520736160008201527f6d65206c656e6774680000000000000000000000000000000000000000000000602082015250565b61216981611def565b811461217457600080fd5b50565b61218081611e01565b811461218b57600080fd5b50565b61219781611e0d565b81146121a257600080fd5b5056fea2646970667358221220006de4f91f54b34d26622dd9007c5b591c0f115ce796be2debfb20249270477964736f6c63430008040033";

export class PackageOwnershipManager__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
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
