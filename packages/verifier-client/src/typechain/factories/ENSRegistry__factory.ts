/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ENSRegistry, ENSRegistryInterface } from "../ENSRegistry";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "label",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "NewOwner",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "resolver",
        type: "address",
      },
    ],
    name: "NewResolver",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "ttl",
        type: "uint64",
      },
    ],
    name: "NewTTL",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
        name: "node",
        type: "bytes32",
      },
    ],
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
        name: "node",
        type: "bytes32",
      },
    ],
    name: "recordExists",
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
        name: "node",
        type: "bytes32",
      },
    ],
    name: "resolver",
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
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "setOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "resolver",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "ttl",
        type: "uint64",
      },
    ],
    name: "setRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "resolver",
        type: "address",
      },
    ],
    name: "setResolver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "label",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "setSubnodeOwner",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "label",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "resolver",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "ttl",
        type: "uint64",
      },
    ],
    name: "setSubnodeRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32",
      },
      {
        internalType: "uint64",
        name: "ttl",
        type: "uint64",
      },
    ],
    name: "setTTL",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32",
      },
    ],
    name: "ttl",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50336000808060001b815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550611219806100776000396000f3fe608060405234801561001057600080fd5b50600436106100b45760003560e01c80635b0fc9c3116100715780635b0fc9c3146101b15780635ef2c7f0146101cd578063a22cb465146101e9578063cf40882314610205578063e985e9c514610221578063f79fe53814610251576100b4565b80630178b8bf146100b957806302571be3146100e957806306ab59231461011957806314ab90381461014957806316a25cbd146101655780631896f70a14610195575b600080fd5b6100d360048036038101906100ce9190610e6c565b610281565b6040516100e091906110b5565b60405180910390f35b61010360048036038101906100fe9190610e6c565b6102c0565b60405161011091906110b5565b60405180910390f35b610133600480360381019061012e9190610f34565b610343565b60405161014091906110eb565b60405180910390f35b610163600480360381019061015e9190610ffa565b6104c6565b005b61017f600480360381019061017a9190610e6c565b610644565b60405161018c9190611106565b60405180910390f35b6101af60048036038101906101aa9190610e95565b610677565b005b6101cb60048036038101906101c69190610e95565b61080d565b005b6101e760048036038101906101e29190610f83565b610959565b005b61020360048036038101906101fe9190610e30565b61097b565b005b61021f600480360381019061021a9190610ed1565b610a78565b005b61023b60048036038101906102369190610df4565b610a93565b60405161024891906110d0565b60405180910390f35b61026b60048036038101906102669190610e6c565b610b27565b60405161027891906110d0565b60405180910390f35b600080600083815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60008060008084815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690503073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141561033957600091505061033e565b809150505b919050565b600083600080600083815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690503373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614806104405750600160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff165b61044957600080fd5b6000868660405160200161045e929190611089565b6040516020818303038152906040528051906020012090506104808186610b95565b85877fce0457fe73731f824cc272376169235128c118b49d344817417c6d108d155e82876040516104b191906110b5565b60405180910390a38093505050509392505050565b81600080600083815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690503373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614806105c15750600160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff165b6105ca57600080fd5b837f1d4f9bbfc9cab89d66e1a1562f2233ccbf1308cb4f63de2ead5787adddb8fa68846040516105fa9190611106565b60405180910390a28260008086815260200190815260200160002060010160146101000a81548167ffffffffffffffff021916908367ffffffffffffffff16021790555050505050565b600080600083815260200190815260200160002060010160149054906101000a900467ffffffffffffffff169050919050565b81600080600083815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690503373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614806107725750600160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff165b61077b57600080fd5b837f335721b01866dc23fbee8b6b2c7b1e14d6f05c28cd35a2c934239f94095602a0846040516107ab91906110b5565b60405180910390a28260008086815260200190815260200160002060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050565b81600080600083815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690503373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614806109085750600160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff165b61091157600080fd5b61091b8484610b95565b837fd4735d920b0f87494915f556dd9b54c8f309026070caea5c737245152564d2668460405161094b91906110b5565b60405180910390a250505050565b6000610966868686610343565b9050610973818484610bed565b505050505050565b80600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051610a6c91906110d0565b60405180910390a35050565b610a82848461080d565b610a8d848383610bed565b50505050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b60008073ffffffffffffffffffffffffffffffffffffffff1660008084815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b8060008084815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b60008084815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614610ce2578160008085815260200190815260200160002060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550827f335721b01866dc23fbee8b6b2c7b1e14d6f05c28cd35a2c934239f94095602a083604051610cd991906110b5565b60405180910390a25b60008084815260200190815260200160002060010160149054906101000a900467ffffffffffffffff1667ffffffffffffffff168167ffffffffffffffff1614610d9b578060008085815260200190815260200160002060010160146101000a81548167ffffffffffffffff021916908367ffffffffffffffff160217905550827f1d4f9bbfc9cab89d66e1a1562f2233ccbf1308cb4f63de2ead5787adddb8fa6882604051610d929190611106565b60405180910390a25b505050565b600081359050610daf81611187565b92915050565b600081359050610dc48161119e565b92915050565b600081359050610dd9816111b5565b92915050565b600081359050610dee816111cc565b92915050565b60008060408385031215610e0757600080fd5b6000610e1585828601610da0565b9250506020610e2685828601610da0565b9150509250929050565b60008060408385031215610e4357600080fd5b6000610e5185828601610da0565b9250506020610e6285828601610db5565b9150509250929050565b600060208284031215610e7e57600080fd5b6000610e8c84828501610dca565b91505092915050565b60008060408385031215610ea857600080fd5b6000610eb685828601610dca565b9250506020610ec785828601610da0565b9150509250929050565b60008060008060808587031215610ee757600080fd5b6000610ef587828801610dca565b9450506020610f0687828801610da0565b9350506040610f1787828801610da0565b9250506060610f2887828801610ddf565b91505092959194509250565b600080600060608486031215610f4957600080fd5b6000610f5786828701610dca565b9350506020610f6886828701610dca565b9250506040610f7986828701610da0565b9150509250925092565b600080600080600060a08688031215610f9b57600080fd5b6000610fa988828901610dca565b9550506020610fba88828901610dca565b9450506040610fcb88828901610da0565b9350506060610fdc88828901610da0565b9250506080610fed88828901610ddf565b9150509295509295909350565b6000806040838503121561100d57600080fd5b600061101b85828601610dca565b925050602061102c85828601610ddf565b9150509250929050565b61103f81611121565b82525050565b61104e81611133565b82525050565b61105d8161113f565b82525050565b61107461106f8261113f565b61117d565b82525050565b61108381611169565b82525050565b60006110958285611063565b6020820191506110a58284611063565b6020820191508190509392505050565b60006020820190506110ca6000830184611036565b92915050565b60006020820190506110e56000830184611045565b92915050565b60006020820190506111006000830184611054565b92915050565b600060208201905061111b600083018461107a565b92915050565b600061112c82611149565b9050919050565b60008115159050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600067ffffffffffffffff82169050919050565b6000819050919050565b61119081611121565b811461119b57600080fd5b50565b6111a781611133565b81146111b257600080fd5b50565b6111be8161113f565b81146111c957600080fd5b50565b6111d581611169565b81146111e057600080fd5b5056fea264697066735822122019be9c81ed4bfdd994ff1d359f595c52cd5b3d590b634cd8cb8c47759537711e64736f6c63430008040033";

export class ENSRegistry__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ENSRegistry> {
    return super.deploy(overrides || {}) as Promise<ENSRegistry>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ENSRegistry {
    return super.attach(address) as ENSRegistry;
  }
  connect(signer: Signer): ENSRegistry__factory {
    return super.connect(signer) as ENSRegistry__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ENSRegistryInterface {
    return new utils.Interface(_abi) as ENSRegistryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ENSRegistry {
    return new Contract(address, _abi, signerOrProvider) as ENSRegistry;
  }
}