/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BytesLike,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  OwnershipBridgeLink,
  OwnershipBridgeLinkInterface,
} from "../OwnershipBridgeLink";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_bridge",
        type: "address",
      },
      {
        internalType: "address",
        name: "_packageOwnershipManager",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_blockchainName",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_bridgeChainId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_relayOwnershipGasLimit",
        type: "uint256",
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
    inputs: [],
    name: "blockchainName",
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
    inputs: [],
    name: "bridge",
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
    name: "bridgeChainId",
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
    inputs: [],
    name: "bridgeLink",
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
        name: "_bridge",
        type: "address",
      },
      {
        internalType: "address",
        name: "_packageOwnershipManager",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_blockchainName",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_bridgeChainId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_relayOwnershipGasLimit",
        type: "uint256",
      },
    ],
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
    name: "packageOwnershipManager",
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
        name: "domainRegistrar",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "domainRegistrarNode",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "domainRegistrar",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "domainRegistrarNode",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "relayOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "relayOwnershipGasLimit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
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
        name: "_blockchainName",
        type: "bytes32",
      },
    ],
    name: "updateBlockchainName",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_bridge",
        type: "address",
      },
    ],
    name: "updateBridge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_bridgeChainId",
        type: "bytes32",
      },
    ],
    name: "updateBridgeChainId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_bridgeLink",
        type: "address",
      },
    ],
    name: "updateBridgeLink",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_packageOwnershipManager",
        type: "address",
      },
    ],
    name: "updatePackageOwnershipManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_relayOwnershipGasLimit",
        type: "uint256",
      },
    ],
    name: "updateRelayOwnershipGasLimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620021be380380620021be83398181016040528101906200003791906200059d565b6200004c85858585856200005760201b60201c565b50505050506200075e565b600060019054906101000a900460ff16806200007e575060008054906101000a900460ff16155b620000c0576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620000b79062000646565b60405180910390fd5b60008060019054906101000a900460ff16159050801562000111576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b62000121620001e260201b60201c565b85606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555084606760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550836068819055508260698190555081606a819055508015620001da5760008060016101000a81548160ff0219169083151502179055505b505050505050565b600060019054906101000a900460ff168062000209575060008054906101000a900460ff16155b6200024b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620002429062000646565b60405180910390fd5b60008060019054906101000a900460ff1615905080156200029c576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b620002ac620002e160201b60201c565b620002bc620003c060201b60201c565b8015620002de5760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff168062000308575060008054906101000a900460ff16155b6200034a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620003419062000646565b60405180910390fd5b60008060019054906101000a900460ff1615905080156200039b576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b8015620003bd5760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff1680620003e7575060008054906101000a900460ff16155b62000429576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620004209062000646565b60405180910390fd5b60008060019054906101000a900460ff1615905080156200047a576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b60006200048c6200055060201b60201c565b905080603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35080156200054d5760008060016101000a81548160ff0219169083151502179055505b50565b600033905090565b600081519050620005698162000710565b92915050565b60008151905062000580816200072a565b92915050565b600081519050620005978162000744565b92915050565b600080600080600060a08688031215620005b657600080fd5b6000620005c68882890162000558565b9550506020620005d98882890162000558565b9450506040620005ec888289016200056f565b9350506060620005ff888289016200056f565b9250506080620006128882890162000586565b9150509295509295909350565b60006200062e602e8362000668565b91506200063b82620006c1565b604082019050919050565b6000602082019050818103600083015262000661816200061f565b9050919050565b600082825260208201905092915050565b6000620006868262000697565b9050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b6200071b8162000679565b81146200072757600080fd5b50565b62000735816200068d565b81146200074157600080fd5b50565b6200074f81620006b7565b81146200075b57600080fd5b50565b611a50806200076e6000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c80638da5cb5b116100a2578063d788018111610071578063d788018114610281578063e78cea921461029d578063ec9f4e5c146102bb578063f2fde38b146102d7578063fbe972d8146102f357610116565b80638da5cb5b1461020b578063c97a51bd14610229578063cef79e2414610245578063cf9cdb251461026357610116565b80636eb38212116100e95780636eb382121461018d578063715018a6146101a957806372576767146101b357806373e7d117146101d157806375ec7627146101ef57610116565b80630d9f552e1461011b5780634c8d9af1146101375780635310b5611461015557806354576c2614610171575b600080fd5b6101356004803603810190610130919061148a565b61030f565b005b61013f6103cf565b60405161014c91906116ec565b60405180910390f35b61016f600480360381019061016a91906115a5565b6103f5565b005b61018b60048036038101906101869190611553565b6106f1565b005b6101a760048036038101906101a2919061148a565b610777565b005b6101b1610837565b005b6101bb610974565b6040516101c89190611745565b60405180910390f35b6101d961097a565b6040516101e6919061183c565b60405180910390f35b610209600480360381019061020491906115f4565b610980565b005b610213610a06565b60405161022091906116ec565b60405180910390f35b610243600480360381019061023e9190611553565b610a30565b005b61024d610ab6565b60405161025a91906116ec565b60405180910390f35b61026b610adc565b6040516102789190611745565b60405180910390f35b61029b600480360381019061029691906115a5565b610ae2565b005b6102a5610cc6565b6040516102b291906116ec565b60405180910390f35b6102d560048036038101906102d091906114dc565b610cec565b005b6102f160048036038101906102ec919061148a565b610e69565b005b61030d6004803603810190610308919061148a565b611015565b005b6103176110d5565b73ffffffffffffffffffffffffffffffffffffffff16610335610a06565b73ffffffffffffffffffffffffffffffffffffffff161461038b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103829061181c565b60405180910390fd5b80606660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b606660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610479577f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b6000606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050606660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1663d67bdd256040518163ffffffff1660e01b815260040160206040518083038186803b15801561051f57600080fd5b505afa158015610533573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061055791906114b3565b73ffffffffffffffffffffffffffffffffffffffff16146105a1577f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b6069548173ffffffffffffffffffffffffffffffffffffffff16639e307dff6040518163ffffffff1660e01b815260040160206040518083038186803b1580156105ea57600080fd5b505afa1580156105fe573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610622919061157c565b14610656577f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b606760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e7da1cd66068548686866040518563ffffffff1660e01b81526004016106b99493929190611797565b600060405180830381600087803b1580156106d357600080fd5b505af11580156106e7573d6000803e3d6000fd5b5050505050505050565b6106f96110d5565b73ffffffffffffffffffffffffffffffffffffffff16610717610a06565b73ffffffffffffffffffffffffffffffffffffffff161461076d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107649061181c565b60405180910390fd5b8060688190555050565b61077f6110d5565b73ffffffffffffffffffffffffffffffffffffffff1661079d610a06565b73ffffffffffffffffffffffffffffffffffffffff16146107f3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107ea9061181c565b60405180910390fd5b80606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b61083f6110d5565b73ffffffffffffffffffffffffffffffffffffffff1661085d610a06565b73ffffffffffffffffffffffffffffffffffffffff16146108b3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108aa9061181c565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff16603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a36000603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b60685481565b606a5481565b6109886110d5565b73ffffffffffffffffffffffffffffffffffffffff166109a6610a06565b73ffffffffffffffffffffffffffffffffffffffff16146109fc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109f39061181c565b60405180910390fd5b80606a8190555050565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b610a386110d5565b73ffffffffffffffffffffffffffffffffffffffff16610a56610a06565b73ffffffffffffffffffffffffffffffffffffffff1614610aac576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610aa39061181c565b60405180910390fd5b8060698190555050565b606760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60695481565b606760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610b66577f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b6000635310b56160e01b9050600081858585604051602401610b8a93929190611760565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050509050606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663dc8601b3606660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1683606a546040518463ffffffff1660e01b8152600401610c6c93929190611707565b602060405180830381600087803b158015610c8657600080fd5b505af1158015610c9a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cbe919061157c565b505050505050565b606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060019054906101000a900460ff1680610d12575060008054906101000a900460ff16155b610d51576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d48906117fc565b60405180910390fd5b60008060019054906101000a900460ff161590508015610da1576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b610da96110dd565b85606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555084606760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550836068819055508260698190555081606a819055508015610e615760008060016101000a81548160ff0219169083151502179055505b505050505050565b610e716110d5565b73ffffffffffffffffffffffffffffffffffffffff16610e8f610a06565b73ffffffffffffffffffffffffffffffffffffffff1614610ee5576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610edc9061181c565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610f55576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f4c906117dc565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff16603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a380603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b61101d6110d5565b73ffffffffffffffffffffffffffffffffffffffff1661103b610a06565b73ffffffffffffffffffffffffffffffffffffffff1614611091576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110889061181c565b60405180910390fd5b80606760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600033905090565b600060019054906101000a900460ff1680611103575060008054906101000a900460ff16155b611142576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611139906117fc565b60405180910390fd5b60008060019054906101000a900460ff161590508015611192576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b61119a6111c6565b6111a261129f565b80156111c35760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff16806111ec575060008054906101000a900460ff16155b61122b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611222906117fc565b60405180910390fd5b60008060019054906101000a900460ff16159050801561127b576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b801561129c5760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff16806112c5575060008054906101000a900460ff16155b611304576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112fb906117fc565b60405180910390fd5b60008060019054906101000a900460ff161590508015611354576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b600061135e6110d5565b905080603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a350801561141e5760008060016101000a81548160ff0219169083151502179055505b50565b600081359050611430816119d5565b92915050565b600081519050611445816119d5565b92915050565b60008135905061145a816119ec565b92915050565b60008151905061146f816119ec565b92915050565b60008135905061148481611a03565b92915050565b60006020828403121561149c57600080fd5b60006114aa84828501611421565b91505092915050565b6000602082840312156114c557600080fd5b60006114d384828501611436565b91505092915050565b600080600080600060a086880312156114f457600080fd5b600061150288828901611421565b955050602061151388828901611421565b94505060406115248882890161144b565b93505060606115358882890161144b565b925050608061154688828901611475565b9150509295509295909350565b60006020828403121561156557600080fd5b60006115738482850161144b565b91505092915050565b60006020828403121561158e57600080fd5b600061159c84828501611460565b91505092915050565b6000806000606084860312156115ba57600080fd5b60006115c88682870161144b565b93505060206115d98682870161144b565b92505060406115ea86828701611421565b9150509250925092565b60006020828403121561160657600080fd5b600061161484828501611475565b91505092915050565b61162681611884565b82525050565b61163581611896565b82525050565b600061164682611857565b6116508185611862565b93506116608185602086016118ca565b611669816118fd565b840191505092915050565b6000611681602683611873565b915061168c8261190e565b604082019050919050565b60006116a4602e83611873565b91506116af8261195d565b604082019050919050565b60006116c7602083611873565b91506116d2826119ac565b602082019050919050565b6116e6816118c0565b82525050565b6000602082019050611701600083018461161d565b92915050565b600060608201905061171c600083018661161d565b818103602083015261172e818561163b565b905061173d60408301846116dd565b949350505050565b600060208201905061175a600083018461162c565b92915050565b6000606082019050611775600083018661162c565b611782602083018561162c565b61178f604083018461161d565b949350505050565b60006080820190506117ac600083018761162c565b6117b9602083018661162c565b6117c6604083018561162c565b6117d3606083018461161d565b95945050505050565b600060208201905081810360008301526117f581611674565b9050919050565b6000602082019050818103600083015261181581611697565b9050919050565b60006020820190508181036000830152611835816116ba565b9050919050565b600060208201905061185160008301846116dd565b92915050565b600081519050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600061188f826118a0565b9050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60005b838110156118e85780820151818401526020810190506118cd565b838111156118f7576000848401525b50505050565b6000601f19601f8301169050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b6119de81611884565b81146119e957600080fd5b50565b6119f581611896565b8114611a0057600080fd5b50565b611a0c816118c0565b8114611a1757600080fd5b5056fea264697066735822122058795dfb830fc43acb57b6033783929aa512e60e60d12f7c6e2143d51b5e8f4364736f6c63430008040033";

export class OwnershipBridgeLink__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _bridge: string,
    _packageOwnershipManager: string,
    _blockchainName: BytesLike,
    _bridgeChainId: BytesLike,
    _relayOwnershipGasLimit: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<OwnershipBridgeLink> {
    return super.deploy(
      _bridge,
      _packageOwnershipManager,
      _blockchainName,
      _bridgeChainId,
      _relayOwnershipGasLimit,
      overrides || {}
    ) as Promise<OwnershipBridgeLink>;
  }
  getDeployTransaction(
    _bridge: string,
    _packageOwnershipManager: string,
    _blockchainName: BytesLike,
    _bridgeChainId: BytesLike,
    _relayOwnershipGasLimit: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _bridge,
      _packageOwnershipManager,
      _blockchainName,
      _bridgeChainId,
      _relayOwnershipGasLimit,
      overrides || {}
    );
  }
  attach(address: string): OwnershipBridgeLink {
    return super.attach(address) as OwnershipBridgeLink;
  }
  connect(signer: Signer): OwnershipBridgeLink__factory {
    return super.connect(signer) as OwnershipBridgeLink__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): OwnershipBridgeLinkInterface {
    return new utils.Interface(_abi) as OwnershipBridgeLinkInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): OwnershipBridgeLink {
    return new Contract(address, _abi, signerOrProvider) as OwnershipBridgeLink;
  }
}
