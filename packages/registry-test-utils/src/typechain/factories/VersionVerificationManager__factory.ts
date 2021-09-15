/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  VersionVerificationManager,
  VersionVerificationManagerInterface,
} from "../VersionVerificationManager";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_registry",
        type: "address",
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "packageId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "verifiedVersionId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "patchNodeId",
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
        internalType: "address",
        name: "_registry",
        type: "address",
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
        name: "packageId",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "patchNodeId",
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
      {
        internalType: "bytes32[]",
        name: "proof",
        type: "bytes32[]",
      },
      {
        internalType: "bool[]",
        name: "sides",
        type: "bool[]",
      },
    ],
    name: "publishVersion",
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
        name: "_registry",
        type: "address",
      },
    ],
    name: "updateRegistry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "root",
        type: "bytes32",
      },
    ],
    name: "updateVerificationRoot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_verificationRootUpdater",
        type: "address",
      },
    ],
    name: "updateVerificationRootUpdater",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "verificationRoot",
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
    name: "verificationRootUpdater",
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
  "0x60806040523480156200001157600080fd5b50604051620021b4380380620021b483398181016040528101906200003791906200050d565b62000048816200004f60201b60201c565b5062000630565b600060019054906101000a900460ff168062000076575060008054906101000a900460ff16155b620000b8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620000af9062000560565b60405180910390fd5b60008060019054906101000a900460ff16159050801562000109576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b620001196200018060201b60201c565b81606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080156200017c5760008060016101000a81548160ff0219169083151502179055505b5050565b600060019054906101000a900460ff1680620001a7575060008054906101000a900460ff16155b620001e9576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620001e09062000560565b60405180910390fd5b60008060019054906101000a900460ff1615905080156200023a576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b6200024a6200027f60201b60201c565b6200025a6200035e60201b60201c565b80156200027c5760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff1680620002a6575060008054906101000a900460ff16155b620002e8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620002df9062000560565b60405180910390fd5b60008060019054906101000a900460ff16159050801562000339576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b80156200035b5760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff168062000385575060008054906101000a900460ff16155b620003c7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620003be9062000560565b60405180910390fd5b60008060019054906101000a900460ff16159050801562000418576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b60006200042a620004ee60201b60201c565b905080603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3508015620004eb5760008060016101000a81548160ff0219169083151502179055505b50565b600033905090565b600081519050620005078162000616565b92915050565b6000602082840312156200052057600080fd5b60006200053084828501620004f6565b91505092915050565b600062000548602e8362000582565b91506200055582620005c7565b604082019050919050565b600060208201905081810360008301526200057b8162000539565b9050919050565b600082825260208201905092915050565b6000620005a082620005a7565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b620006218162000593565b81146200062d57600080fd5b50565b611b7480620006406000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80637b103999116100715780637b1039991461012a5780638da5cb5b14610148578063b61d211b14610166578063c4d66de814610184578063ce749723146101a0578063f2fde38b146101bc576100a9565b80630d032de8146100ae5780631a5da6c8146100cc57806338a34cf6146100e857806343ed751d14610104578063715018a614610120575b600080fd5b6100b66101d8565b6040516100c39190611577565b60405180910390f35b6100e660048036038101906100e191906111fb565b6101de565b005b61010260048036038101906100fd91906111fb565b61029e565b005b61011e6004803603810190610119919061124d565b61035e565b005b6101286103ec565b005b610132610529565b60405161013f919061155c565b60405180910390f35b61015061054f565b60405161015d919061155c565b60405180910390f35b61016e610579565b60405161017b919061155c565b60405180910390f35b61019e600480360381019061019991906111fb565b61059f565b005b6101ba60048036038101906101b5919061129f565b6106c2565b005b6101d660048036038101906101d191906111fb565b610921565b005b60675481565b6101e6610acd565b73ffffffffffffffffffffffffffffffffffffffff1661020461054f565b73ffffffffffffffffffffffffffffffffffffffff161461025a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102519061164c565b60405180910390fd5b80606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6102a6610acd565b73ffffffffffffffffffffffffffffffffffffffff166102c461054f565b73ffffffffffffffffffffffffffffffffffffffff161461031a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103119061164c565b60405180910390fd5b80606660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b606660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146103e2577f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b8060678190555050565b6103f4610acd565b73ffffffffffffffffffffffffffffffffffffffff1661041261054f565b73ffffffffffffffffffffffffffffffffffffffff1614610468576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161045f9061164c565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff16603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a36000603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b606660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060019054906101000a900460ff16806105c5575060008054906101000a900460ff16155b610604576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105fb9061162c565b60405180910390fd5b60008060019054906101000a900460ff161590508015610654576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b61065c610ad5565b81606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080156106be5760008060016101000a81548160ff0219169083151502179055505b5050565b873373ffffffffffffffffffffffffffffffffffffffff166106e382610bbe565b73ffffffffffffffffffffffffffffffffffffffff1614610739576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107309061160c565b60405180910390fd5b6000888560405160200161074d9190611545565b60405160208183030381529060405280519060200120604051602001610774929190611519565b60405160208183030381529060405280519060200120905061079a848483606754610c72565b6107d9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107d09061168c565b60405180910390fd5b6000606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16634dc1d99d8c8b8b8b8b6040518663ffffffff1660e01b815260040161083e959493929190611592565b602060405180830381600087803b15801561085857600080fd5b505af115801561086c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108909190611276565b9050808a146108d4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108cb9061166c565b60405180910390fd5b89828c7f5875b5d75244d9184a17c71dedfa3481a6b268409027ba8fb88b3d8098dc206b8c8c8c8c60405161090c94939291906116ac565b60405180910390a45050505050505050505050565b610929610acd565b73ffffffffffffffffffffffffffffffffffffffff1661094761054f565b73ffffffffffffffffffffffffffffffffffffffff161461099d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109949061164c565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610a0d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a04906115ec565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff16603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a380603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600033905090565b600060019054906101000a900460ff1680610afb575060008054906101000a900460ff16155b610b3a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b319061162c565b60405180910390fd5b60008060019054906101000a900460ff161590508015610b8a576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b610b92610d8e565b610b9a610e67565b8015610bbb5760008060016101000a81548160ff0219169083151502179055505b50565b6000606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663427a94d4836040518263ffffffff1660e01b8152600401610c1b9190611577565b60206040518083038186803b158015610c3357600080fd5b505afa158015610c47573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c6b9190611224565b9050919050565b60008083905060005b8651811015610d7f576000878281518110610cbf577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200260200101519050868281518110610d02577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001015115610d3f578083604051602001610d22929190611519565b604051602081830303815290604052805190602001209250610d6b565b8281604051602001610d52929190611519565b6040516020818303038152906040528051906020012092505b508080610d7790611892565b915050610c7b565b50828114915050949350505050565b600060019054906101000a900460ff1680610db4575060008054906101000a900460ff16155b610df3576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610dea9061162c565b60405180910390fd5b60008060019054906101000a900460ff161590508015610e43576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b8015610e645760008060016101000a81548160ff0219169083151502179055505b50565b600060019054906101000a900460ff1680610e8d575060008054906101000a900460ff16155b610ecc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ec39061162c565b60405180910390fd5b60008060019054906101000a900460ff161590508015610f1c576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b6000610f26610acd565b905080603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3508015610fe65760008060016101000a81548160ff0219169083151502179055505b50565b6000610ffc610ff78461171d565b6116f8565b9050808382526020820190508285602086028201111561101b57600080fd5b60005b8581101561104b5781611031888261117d565b84526020840193506020830192505060018101905061101e565b5050509392505050565b600061106861106384611749565b6116f8565b9050808382526020820190508285602086028201111561108757600080fd5b60005b858110156110b7578161109d8882611192565b84526020840193506020830192505060018101905061108a565b5050509392505050565b60006110d46110cf84611775565b6116f8565b9050828152602081018484840111156110ec57600080fd5b6110f784828561181f565b509392505050565b60008135905061110e81611ae2565b92915050565b60008151905061112381611ae2565b92915050565b600082601f83011261113a57600080fd5b813561114a848260208601610fe9565b91505092915050565b600082601f83011261116457600080fd5b8135611174848260208601611055565b91505092915050565b60008135905061118c81611af9565b92915050565b6000813590506111a181611b10565b92915050565b6000815190506111b681611b10565b92915050565b600082601f8301126111cd57600080fd5b81356111dd8482602086016110c1565b91505092915050565b6000813590506111f581611b27565b92915050565b60006020828403121561120d57600080fd5b600061121b848285016110ff565b91505092915050565b60006020828403121561123657600080fd5b600061124484828501611114565b91505092915050565b60006020828403121561125f57600080fd5b600061126d84828501611192565b91505092915050565b60006020828403121561128857600080fd5b6000611296848285016111a7565b91505092915050565b600080600080600080600080610100898b0312156112bc57600080fd5b60006112ca8b828c01611192565b98505060206112db8b828c01611192565b97505060406112ec8b828c016111e6565b96505060606112fd8b828c016111e6565b955050608061130e8b828c016111e6565b94505060a089013567ffffffffffffffff81111561132b57600080fd5b6113378b828c016111bc565b93505060c089013567ffffffffffffffff81111561135457600080fd5b6113608b828c01611153565b92505060e089013567ffffffffffffffff81111561137d57600080fd5b6113898b828c01611129565b9150509295985092959890939650565b6113a2816117cd565b82525050565b6113b1816117eb565b82525050565b6113c86113c3826117eb565b6118db565b82525050565b60006113d9826117a6565b6113e381856117b1565b93506113f381856020860161182e565b6113fc81611943565b840191505092915050565b6000611412826117a6565b61141c81856117c2565b935061142c81856020860161182e565b80840191505092915050565b60006114456026836117b1565b915061145082611954565b604082019050919050565b60006114686034836117b1565b9150611473826119a3565b604082019050919050565b600061148b602e836117b1565b9150611496826119f2565b604082019050919050565b60006114ae6020836117b1565b91506114b982611a41565b602082019050919050565b60006114d1603e836117b1565b91506114dc82611a6a565b604082019050919050565b60006114f4600d836117b1565b91506114ff82611ab9565b602082019050919050565b61151381611815565b82525050565b600061152582856113b7565b60208201915061153582846113b7565b6020820191508190509392505050565b60006115518284611407565b915081905092915050565b60006020820190506115716000830184611399565b92915050565b600060208201905061158c60008301846113a8565b92915050565b600060a0820190506115a760008301886113a8565b6115b4602083018761150a565b6115c1604083018661150a565b6115ce606083018561150a565b81810360808301526115e081846113ce565b90509695505050505050565b6000602082019050818103600083015261160581611438565b9050919050565b600060208201905081810360008301526116258161145b565b9050919050565b600060208201905081810360008301526116458161147e565b9050919050565b60006020820190508181036000830152611665816114a1565b9050919050565b60006020820190508181036000830152611685816114c4565b9050919050565b600060208201905081810360008301526116a5816114e7565b9050919050565b60006080820190506116c1600083018761150a565b6116ce602083018661150a565b6116db604083018561150a565b81810360608301526116ed81846113ce565b905095945050505050565b6000611702611713565b905061170e8282611861565b919050565b6000604051905090565b600067ffffffffffffffff82111561173857611737611914565b5b602082029050602081019050919050565b600067ffffffffffffffff82111561176457611763611914565b5b602082029050602081019050919050565b600067ffffffffffffffff8211156117905761178f611914565b5b61179982611943565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b60006117d8826117f5565b9050919050565b60008115159050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b8381101561184c578082015181840152602081019050611831565b8381111561185b576000848401525b50505050565b61186a82611943565b810181811067ffffffffffffffff8211171561188957611888611914565b5b80604052505050565b600061189d82611815565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156118d0576118cf6118e5565b5b600182019050919050565b6000819050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f596f7520646f206e6f7420686176652061636365737320746f2074686520646f60008201527f6d61696e206f662074686973207061636b616765000000000000000000000000602082015250565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b7f537570706c6965642070617463684e6f6465496420646f6573206e6f74206d6160008201527f746368207468652063616c63756c617465642070617463684e6f646549640000602082015250565b7f496e76616c69642070726f6f6600000000000000000000000000000000000000600082015250565b611aeb816117cd565b8114611af657600080fd5b50565b611b02816117df565b8114611b0d57600080fd5b50565b611b19816117eb565b8114611b2457600080fd5b50565b611b3081611815565b8114611b3b57600080fd5b5056fea2646970667358221220a0cf12ab548e43622f029c75c3b8049338c5f8065093b316bedaa280845eaa0664736f6c63430008040033";

export class VersionVerificationManager__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _registry: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<VersionVerificationManager> {
    return super.deploy(
      _registry,
      overrides || {}
    ) as Promise<VersionVerificationManager>;
  }
  getDeployTransaction(
    _registry: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_registry, overrides || {});
  }
  attach(address: string): VersionVerificationManager {
    return super.attach(address) as VersionVerificationManager;
  }
  connect(signer: Signer): VersionVerificationManager__factory {
    return super.connect(signer) as VersionVerificationManager__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VersionVerificationManagerInterface {
    return new utils.Interface(_abi) as VersionVerificationManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): VersionVerificationManager {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as VersionVerificationManager;
  }
}
