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
  VerificationRootBridgeLinkMock,
  VerificationRootBridgeLinkMockInterface,
} from "../VerificationRootBridgeLinkMock";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_bridge",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_bridgeChainId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_relayVerificationRootGasLimit",
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
        internalType: "bytes32",
        name: "_bridgeChainId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_relayVerificationRootGasLimit",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "verificationRoot",
        type: "bytes32",
      },
    ],
    name: "receiveVerificationRoot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "verificationRoot",
        type: "bytes32",
      },
    ],
    name: "relayVerificationRoot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "relayVerificationRootGasLimit",
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
        internalType: "uint256",
        name: "_relayVerificationRootGasLimit",
        type: "uint256",
      },
    ],
    name: "updateRelayVerificationRootGasLimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_verificationRootRelayer",
        type: "address",
      },
    ],
    name: "updateVerificationRootRelayer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_versionVerificationManager",
        type: "address",
      },
    ],
    name: "updateVersionVerificationManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "verificationRootRelayer",
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
    name: "versionVerificationManager",
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
  "0x60806040523480156200001157600080fd5b5060405162001c5c38038062001c5c833981810160405281019062000037919062000555565b8282826200004d8383836200005960201b60201c565b505050505050620006ea565b600060019054906101000a900460ff168062000080575060008054906101000a900460ff16155b620000c2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620000b990620005d2565b60405180910390fd5b60008060019054906101000a900460ff16159050801562000113576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b620001236200019a60201b60201c565b83606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508260698190555081606a819055508015620001945760008060016101000a81548160ff0219169083151502179055505b50505050565b600060019054906101000a900460ff1680620001c1575060008054906101000a900460ff16155b62000203576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620001fa90620005d2565b60405180910390fd5b60008060019054906101000a900460ff16159050801562000254576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b620002646200029960201b60201c565b620002746200037860201b60201c565b8015620002965760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff1680620002c0575060008054906101000a900460ff16155b62000302576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620002f990620005d2565b60405180910390fd5b60008060019054906101000a900460ff16159050801562000353576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b8015620003755760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff16806200039f575060008054906101000a900460ff16155b620003e1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620003d890620005d2565b60405180910390fd5b60008060019054906101000a900460ff16159050801562000432576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b6000620004446200050860201b60201c565b905080603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3508015620005055760008060016101000a81548160ff0219169083151502179055505b50565b600033905090565b60008151905062000521816200069c565b92915050565b6000815190506200053881620006b6565b92915050565b6000815190506200054f81620006d0565b92915050565b6000806000606084860312156200056b57600080fd5b60006200057b8682870162000510565b93505060206200058e8682870162000527565b9250506040620005a1868287016200053e565b9150509250925092565b6000620005ba602e83620005f4565b9150620005c7826200064d565b604082019050919050565b60006020820190508181036000830152620005ed81620005ab565b9050919050565b600082825260208201905092915050565b6000620006128262000623565b9050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b620006a78162000605565b8114620006b357600080fd5b50565b620006c18162000619565b8114620006cd57600080fd5b50565b620006db8162000643565b8114620006e757600080fd5b50565b61156280620006fa6000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c80637cc41844116100a2578063c97a51bd11610071578063c97a51bd1461027d578063cf9cdb2514610299578063e78cea92146102b7578063f2fde38b146102d5578063f9e5eafd146102f157610116565b80637cc41844146102075780638da5cb5b146102255780639bd6473f14610243578063c18a0c401461025f57610116565b80636113c1bd116100e95780636113c1bd1461018d578063684560a2146101a95780636d140f00146101c55780636eb38212146101e1578063715018a6146101fd57610116565b80630d9f552e1461011b5780630e4c98071461013757806335d7d56a146101535780634c8d9af11461016f575b600080fd5b610135600480360381019061013091906111b8565b61030f565b005b610151600480360381019061014c91906111b8565b6103cf565b005b61016d60048036038101906101689190611259565b61048f565b005b610177610515565b6040516101849190611318565b60405180910390f35b6101a760048036038101906101a291906111b8565b61053b565b005b6101c360048036038101906101be91906111e1565b6105fb565b005b6101df60048036038101906101da9190611230565b61072e565b005b6101fb60048036038101906101f691906111b8565b610842565b005b610205610902565b005b61020f610a3f565b60405161021c9190611318565b60405180910390f35b61022d610a65565b60405161023a9190611318565b60405180910390f35b61025d60048036038101906102589190611230565b610a8f565b005b610267610ba3565b60405161027491906113ae565b60405180910390f35b61029760048036038101906102929190611230565b610ba9565b005b6102a1610c2f565b6040516102ae9190611333565b60405180910390f35b6102bf610c35565b6040516102cc9190611318565b60405180910390f35b6102ef60048036038101906102ea91906111b8565b610c5b565b005b6102f9610e07565b6040516103069190611318565b60405180910390f35b610317610e2d565b73ffffffffffffffffffffffffffffffffffffffff16610335610a65565b73ffffffffffffffffffffffffffffffffffffffff161461038b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103829061138e565b60405180910390fd5b80606660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6103d7610e2d565b73ffffffffffffffffffffffffffffffffffffffff166103f5610a65565b73ffffffffffffffffffffffffffffffffffffffff161461044b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104429061138e565b60405180910390fd5b80606760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b610497610e2d565b73ffffffffffffffffffffffffffffffffffffffff166104b5610a65565b73ffffffffffffffffffffffffffffffffffffffff161461050b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105029061138e565b60405180910390fd5b80606a8190555050565b606660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610543610e2d565b73ffffffffffffffffffffffffffffffffffffffff16610561610a65565b73ffffffffffffffffffffffffffffffffffffffff16146105b7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105ae9061138e565b60405180910390fd5b80606860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600060019054906101000a900460ff1680610621575060008054906101000a900460ff16155b610660576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106579061136e565b60405180910390fd5b60008060019054906101000a900460ff1615905080156106b0576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b6106b8610e35565b83606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508260698190555081606a8190555080156107285760008060016101000a81548160ff0219169083151502179055505b50505050565b606660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146107b2577f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b606860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166343ed751d826040518263ffffffff1660e01b815260040161080d9190611333565b600060405180830381600087803b15801561082757600080fd5b505af115801561083b573d6000803e3d6000fd5b5050505050565b61084a610e2d565b73ffffffffffffffffffffffffffffffffffffffff16610868610a65565b73ffffffffffffffffffffffffffffffffffffffff16146108be576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108b59061138e565b60405180910390fd5b80606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b61090a610e2d565b73ffffffffffffffffffffffffffffffffffffffff16610928610a65565b73ffffffffffffffffffffffffffffffffffffffff161461097e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109759061138e565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff16603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a36000603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b606860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b606760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610b13577f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b606660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636d140f00826040518263ffffffff1660e01b8152600401610b6e9190611333565b600060405180830381600087803b158015610b8857600080fd5b505af1158015610b9c573d6000803e3d6000fd5b5050505050565b606a5481565b610bb1610e2d565b73ffffffffffffffffffffffffffffffffffffffff16610bcf610a65565b73ffffffffffffffffffffffffffffffffffffffff1614610c25576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c1c9061138e565b60405180910390fd5b8060698190555050565b60695481565b606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610c63610e2d565b73ffffffffffffffffffffffffffffffffffffffff16610c81610a65565b73ffffffffffffffffffffffffffffffffffffffff1614610cd7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cce9061138e565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610d47576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d3e9061134e565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff16603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a380603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b606760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600033905090565b600060019054906101000a900460ff1680610e5b575060008054906101000a900460ff16155b610e9a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e919061136e565b60405180910390fd5b60008060019054906101000a900460ff161590508015610eea576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b610ef2610f1e565b610efa610ff7565b8015610f1b5760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff1680610f44575060008054906101000a900460ff16155b610f83576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f7a9061136e565b60405180910390fd5b60008060019054906101000a900460ff161590508015610fd3576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b8015610ff45760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff168061101d575060008054906101000a900460ff16155b61105c576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110539061136e565b60405180910390fd5b60008060019054906101000a900460ff1615905080156110ac576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b60006110b6610e2d565b905080603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35080156111765760008060016101000a81548160ff0219169083151502179055505b50565b600081359050611188816114e7565b92915050565b60008135905061119d816114fe565b92915050565b6000813590506111b281611515565b92915050565b6000602082840312156111ca57600080fd5b60006111d884828501611179565b91505092915050565b6000806000606084860312156111f657600080fd5b600061120486828701611179565b93505060206112158682870161118e565b9250506040611226868287016111a3565b9150509250925092565b60006020828403121561124257600080fd5b60006112508482850161118e565b91505092915050565b60006020828403121561126b57600080fd5b6000611279848285016111a3565b91505092915050565b61128b816113da565b82525050565b61129a816113ec565b82525050565b60006112ad6026836113c9565b91506112b882611420565b604082019050919050565b60006112d0602e836113c9565b91506112db8261146f565b604082019050919050565b60006112f36020836113c9565b91506112fe826114be565b602082019050919050565b61131281611416565b82525050565b600060208201905061132d6000830184611282565b92915050565b60006020820190506113486000830184611291565b92915050565b60006020820190508181036000830152611367816112a0565b9050919050565b60006020820190508181036000830152611387816112c3565b9050919050565b600060208201905081810360008301526113a7816112e6565b9050919050565b60006020820190506113c36000830184611309565b92915050565b600082825260208201905092915050565b60006113e5826113f6565b9050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b6114f0816113da565b81146114fb57600080fd5b50565b611507816113ec565b811461151257600080fd5b50565b61151e81611416565b811461152957600080fd5b5056fea26469706673582212202f8d3d70b91c368c5c6455ab06a1e99d164fb38f641bd76067fd8adf2e20be8664736f6c63430008040033";

export class VerificationRootBridgeLinkMock__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _bridge: string,
    _bridgeChainId: BytesLike,
    _relayVerificationRootGasLimit: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<VerificationRootBridgeLinkMock> {
    return super.deploy(
      _bridge,
      _bridgeChainId,
      _relayVerificationRootGasLimit,
      overrides || {}
    ) as Promise<VerificationRootBridgeLinkMock>;
  }
  getDeployTransaction(
    _bridge: string,
    _bridgeChainId: BytesLike,
    _relayVerificationRootGasLimit: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _bridge,
      _bridgeChainId,
      _relayVerificationRootGasLimit,
      overrides || {}
    );
  }
  attach(address: string): VerificationRootBridgeLinkMock {
    return super.attach(address) as VerificationRootBridgeLinkMock;
  }
  connect(signer: Signer): VerificationRootBridgeLinkMock__factory {
    return super.connect(signer) as VerificationRootBridgeLinkMock__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VerificationRootBridgeLinkMockInterface {
    return new utils.Interface(_abi) as VerificationRootBridgeLinkMockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): VerificationRootBridgeLinkMock {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as VerificationRootBridgeLinkMock;
  }
}