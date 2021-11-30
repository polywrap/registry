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
  VerificationRootBridgeLink,
  VerificationRootBridgeLinkInterface,
} from "../VerificationRootBridgeLink";

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
  "0x60806040523480156200001157600080fd5b5060405162001ef638038062001ef6833981810160405281019062000037919062000584565b6200004a8383836200005360201b60201c565b50505062000719565b600060019054906101000a900460ff16806200007a575060008054906101000a900460ff16155b620000bc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620000b39062000601565b60405180910390fd5b60008060019054906101000a900460ff1615905080156200010d576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b6200011d6200019460201b60201c565b83606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508260698190555081606a8190555080156200018e5760008060016101000a81548160ff0219169083151502179055505b50505050565b600060019054906101000a900460ff1680620001bb575060008054906101000a900460ff16155b620001fd576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620001f49062000601565b60405180910390fd5b60008060019054906101000a900460ff1615905080156200024e576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b6200025e6200029360201b60201c565b6200026e6200037260201b60201c565b8015620002905760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff1680620002ba575060008054906101000a900460ff16155b620002fc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620002f39062000601565b60405180910390fd5b60008060019054906101000a900460ff1615905080156200034d576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b80156200036f5760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff168062000399575060008054906101000a900460ff16155b620003db576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620003d29062000601565b60405180910390fd5b60008060019054906101000a900460ff1615905080156200042c576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b6200044c620004406200047160201b60201c565b6200047960201b60201c565b80156200046e5760008060016101000a81548160ff0219169083151502179055505b50565b600033905090565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b6000815190506200055081620006cb565b92915050565b6000815190506200056781620006e5565b92915050565b6000815190506200057e81620006ff565b92915050565b6000806000606084860312156200059a57600080fd5b6000620005aa868287016200053f565b9350506020620005bd8682870162000556565b9250506040620005d0868287016200056d565b9150509250925092565b6000620005e9602e8362000623565b9150620005f6826200067c565b604082019050919050565b600060208201905081810360008301526200061c81620005da565b9050919050565b600082825260208201905092915050565b6000620006418262000652565b9050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b620006d68162000634565b8114620006e257600080fd5b50565b620006f08162000648565b8114620006fc57600080fd5b50565b6200070a8162000672565b81146200071657600080fd5b50565b6117cd80620007296000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c80637cc41844116100a2578063c97a51bd11610071578063c97a51bd1461027d578063cf9cdb2514610299578063e78cea92146102b7578063f2fde38b146102d5578063f9e5eafd146102f157610116565b80637cc41844146102075780638da5cb5b146102255780639bd6473f14610243578063c18a0c401461025f57610116565b80636113c1bd116100e95780636113c1bd1461018d578063684560a2146101a95780636d140f00146101c55780636eb38212146101e1578063715018a6146101fd57610116565b80630d9f552e1461011b5780630e4c98071461013757806335d7d56a146101535780634c8d9af11461016f575b600080fd5b610135600480360381019061013091906112fa565b61030f565b005b610151600480360381019061014c91906112fa565b6103cf565b005b61016d600480360381019061016891906113ed565b61048f565b005b610177610515565b60405161018491906114e5565b60405180910390f35b6101a760048036038101906101a291906112fa565b61053b565b005b6101c360048036038101906101be919061134c565b6105fb565b005b6101df60048036038101906101da919061139b565b61072e565b005b6101fb60048036038101906101f691906112fa565b6109cc565b005b610205610a8c565b005b61020f610b14565b60405161021c91906114e5565b60405180910390f35b61022d610b3a565b60405161023a91906114e5565b60405180910390f35b61025d6004803603810190610258919061139b565b610b64565b005b610267610d42565b60405161027491906115b9565b60405180910390f35b6102976004803603810190610292919061139b565b610d48565b005b6102a1610dce565b6040516102ae919061153e565b60405180910390f35b6102bf610dd4565b6040516102cc91906114e5565b60405180910390f35b6102ef60048036038101906102ea91906112fa565b610dfa565b005b6102f9610ef2565b60405161030691906114e5565b60405180910390f35b610317610f18565b73ffffffffffffffffffffffffffffffffffffffff16610335610b3a565b73ffffffffffffffffffffffffffffffffffffffff161461038b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161038290611599565b60405180910390fd5b80606660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6103d7610f18565b73ffffffffffffffffffffffffffffffffffffffff166103f5610b3a565b73ffffffffffffffffffffffffffffffffffffffff161461044b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161044290611599565b60405180910390fd5b80606760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b610497610f18565b73ffffffffffffffffffffffffffffffffffffffff166104b5610b3a565b73ffffffffffffffffffffffffffffffffffffffff161461050b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161050290611599565b60405180910390fd5b80606a8190555050565b606660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610543610f18565b73ffffffffffffffffffffffffffffffffffffffff16610561610b3a565b73ffffffffffffffffffffffffffffffffffffffff16146105b7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105ae90611599565b60405180910390fd5b80606860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600060019054906101000a900460ff1680610621575060008054906101000a900460ff16155b610660576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161065790611579565b60405180910390fd5b60008060019054906101000a900460ff1615905080156106b0576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b6106b8610f20565b83606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508260698190555081606a8190555080156107285760008060016101000a81548160ff0219169083151502179055505b50505050565b606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146107b2577f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b6000606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050606660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1663d67bdd256040518163ffffffff1660e01b815260040160206040518083038186803b15801561085857600080fd5b505afa15801561086c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108909190611323565b73ffffffffffffffffffffffffffffffffffffffff16146108b057600080fd5b6069548173ffffffffffffffffffffffffffffffffffffffff16639e307dff6040518163ffffffff1660e01b815260040160206040518083038186803b1580156108f957600080fd5b505afa15801561090d573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061093191906113c4565b1461093b57600080fd5b606860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166343ed751d836040518263ffffffff1660e01b8152600401610996919061153e565b600060405180830381600087803b1580156109b057600080fd5b505af11580156109c4573d6000803e3d6000fd5b505050505050565b6109d4610f18565b73ffffffffffffffffffffffffffffffffffffffff166109f2610b3a565b73ffffffffffffffffffffffffffffffffffffffff1614610a48576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a3f90611599565b60405180910390fd5b80606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b610a94610f18565b73ffffffffffffffffffffffffffffffffffffffff16610ab2610b3a565b73ffffffffffffffffffffffffffffffffffffffff1614610b08576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610aff90611599565b60405180910390fd5b610b126000611009565b565b606860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b606760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610be8577f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b6000636d140f0060e01b905060008183604051602401610c08919061153e565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050509050606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663dc8601b3606660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1683606a546040518463ffffffff1660e01b8152600401610cea93929190611500565b602060405180830381600087803b158015610d0457600080fd5b505af1158015610d18573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d3c91906113c4565b50505050565b606a5481565b610d50610f18565b73ffffffffffffffffffffffffffffffffffffffff16610d6e610b3a565b73ffffffffffffffffffffffffffffffffffffffff1614610dc4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610dbb90611599565b60405180910390fd5b8060698190555050565b60695481565b606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610e02610f18565b73ffffffffffffffffffffffffffffffffffffffff16610e20610b3a565b73ffffffffffffffffffffffffffffffffffffffff1614610e76576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e6d90611599565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610ee6576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610edd90611559565b60405180910390fd5b610eef81611009565b50565b606760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600033905090565b600060019054906101000a900460ff1680610f46575060008054906101000a900460ff16155b610f85576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f7c90611579565b60405180910390fd5b60008060019054906101000a900460ff161590508015610fd5576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b610fdd6110cf565b610fe56111a8565b80156110065760008060016101000a81548160ff0219169083151502179055505b50565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600060019054906101000a900460ff16806110f5575060008054906101000a900460ff16155b611134576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161112b90611579565b60405180910390fd5b60008060019054906101000a900460ff161590508015611184576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b80156111a55760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff16806111ce575060008054906101000a900460ff16155b61120d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161120490611579565b60405180910390fd5b60008060019054906101000a900460ff16159050801561125d576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b61126d611268610f18565b611009565b801561128e5760008060016101000a81548160ff0219169083151502179055505b50565b6000813590506112a081611752565b92915050565b6000815190506112b581611752565b92915050565b6000813590506112ca81611769565b92915050565b6000815190506112df81611769565b92915050565b6000813590506112f481611780565b92915050565b60006020828403121561130c57600080fd5b600061131a84828501611291565b91505092915050565b60006020828403121561133557600080fd5b6000611343848285016112a6565b91505092915050565b60008060006060848603121561136157600080fd5b600061136f86828701611291565b9350506020611380868287016112bb565b9250506040611391868287016112e5565b9150509250925092565b6000602082840312156113ad57600080fd5b60006113bb848285016112bb565b91505092915050565b6000602082840312156113d657600080fd5b60006113e4848285016112d0565b91505092915050565b6000602082840312156113ff57600080fd5b600061140d848285016112e5565b91505092915050565b61141f81611601565b82525050565b61142e81611613565b82525050565b600061143f826115d4565b61144981856115df565b9350611459818560208601611647565b6114628161167a565b840191505092915050565b600061147a6026836115f0565b91506114858261168b565b604082019050919050565b600061149d602e836115f0565b91506114a8826116da565b604082019050919050565b60006114c06020836115f0565b91506114cb82611729565b602082019050919050565b6114df8161163d565b82525050565b60006020820190506114fa6000830184611416565b92915050565b60006060820190506115156000830186611416565b81810360208301526115278185611434565b905061153660408301846114d6565b949350505050565b60006020820190506115536000830184611425565b92915050565b600060208201905081810360008301526115728161146d565b9050919050565b6000602082019050818103600083015261159281611490565b9050919050565b600060208201905081810360008301526115b2816114b3565b9050919050565b60006020820190506115ce60008301846114d6565b92915050565b600081519050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600061160c8261161d565b9050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60005b8381101561166557808201518184015260208101905061164a565b83811115611674576000848401525b50505050565b6000601f19601f8301169050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b61175b81611601565b811461176657600080fd5b50565b61177281611613565b811461177d57600080fd5b50565b6117898161163d565b811461179457600080fd5b5056fea264697066735822122022d130d5d81573130f3d5d12cb10c9742ef17b8e260d24520d559b34ef3400f464736f6c63430008040033";

export class VerificationRootBridgeLink__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _bridge: string,
    _bridgeChainId: BytesLike,
    _relayVerificationRootGasLimit: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<VerificationRootBridgeLink> {
    return super.deploy(
      _bridge,
      _bridgeChainId,
      _relayVerificationRootGasLimit,
      overrides || {}
    ) as Promise<VerificationRootBridgeLink>;
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
  attach(address: string): VerificationRootBridgeLink {
    return super.attach(address) as VerificationRootBridgeLink;
  }
  connect(signer: Signer): VerificationRootBridgeLink__factory {
    return super.connect(signer) as VerificationRootBridgeLink__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VerificationRootBridgeLinkInterface {
    return new utils.Interface(_abi) as VerificationRootBridgeLinkInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): VerificationRootBridgeLink {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as VerificationRootBridgeLink;
  }
}