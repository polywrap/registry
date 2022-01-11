export const schema: string = `### Web3API Header START ###
scalar UInt
scalar UInt8
scalar UInt16
scalar UInt32
scalar Int
scalar Int8
scalar Int16
scalar Int32
scalar Bytes
scalar BigInt
scalar JSON

directive @imported(
  uri: String!
  namespace: String!
  nativeType: String!
) on OBJECT | ENUM

directive @imports(
  types: [String!]!
) on OBJECT

directive @capability(
  type: String!
  uri: String!
  namespace: String!
) repeatable on OBJECT

directive @enabled_interface on OBJECT
### Web3API Header END ###

type Query implements UriResolver_Query @imports(
  types: [
    "UriResolver_Query",
    "UriResolver_MaybeUriOrManifest",
    "Ethereum_Query",
    "Ethereum_Connection",
    "Ethereum_TxOverrides",
    "Ethereum_StaticTxResult",
    "Ethereum_TxRequest",
    "Ethereum_TxReceipt",
    "Ethereum_Log",
    "Ethereum_EventNotification",
    "Ethereum_Network"
  ]
) {
  tryResolveUri(
    authority: String!
    path: String!
  ): UriResolver_MaybeUriOrManifest

  getFile(
    path: String!
  ): Bytes
}

### Imported Queries START ###

type UriResolver_Query @imported(
  uri: "ens/uri-resolver.core.web3api.eth",
  namespace: "UriResolver",
  nativeType: "Query"
) {
  tryResolveUri(
    authority: String!
    path: String!
  ): UriResolver_MaybeUriOrManifest

  getFile(
    path: String!
  ): Bytes
}

type Ethereum_Query @imported(
  uri: "ens/ethereum.web3api.eth",
  namespace: "Ethereum",
  nativeType: "Query"
) {
  callContractView(
    address: String!
    method: String!
    args: [String!]
    connection: Ethereum_Connection
  ): String!

  callContractStatic(
    address: String!
    method: String!
    args: [String!]
    connection: Ethereum_Connection
    txOverrides: Ethereum_TxOverrides
  ): Ethereum_StaticTxResult!

  encodeParams(
    types: [String!]!
    values: [String!]!
  ): String!

  encodeFunction(
    method: String!
    args: [String!]
  ): String!

  getSignerAddress(
    connection: Ethereum_Connection
  ): String!

  getSignerBalance(
    blockTag: BigInt
    connection: Ethereum_Connection
  ): BigInt!

  getSignerTransactionCount(
    blockTag: BigInt
    connection: Ethereum_Connection
  ): BigInt!

  getGasPrice(
    connection: Ethereum_Connection
  ): BigInt!

  estimateTransactionGas(
    tx: Ethereum_TxRequest!
    connection: Ethereum_Connection
  ): BigInt!

  estimateContractCallGas(
    address: String!
    method: String!
    args: [String!]
    connection: Ethereum_Connection
    txOverrides: Ethereum_TxOverrides
  ): BigInt!

  checkAddress(
    address: String!
  ): Boolean!

  toWei(
    eth: String!
  ): BigInt!

  toEth(
    wei: BigInt!
  ): String!

  awaitTransaction(
    txHash: String!
    confirmations: UInt32!
    timeout: UInt32!
    connection: Ethereum_Connection
  ): Ethereum_TxReceipt!

  waitForEvent(
    address: String!
    event: String!
    args: [String!]
    timeout: UInt32
    connection: Ethereum_Connection
  ): Ethereum_EventNotification!

  getNetwork(
    connection: Ethereum_Connection
  ): Ethereum_Network!
}

### Imported Queries END ###

### Imported Objects START ###

type UriResolver_MaybeUriOrManifest @imported(
  uri: "ens/uri-resolver.core.web3api.eth",
  namespace: "UriResolver",
  nativeType: "MaybeUriOrManifest"
) {
  uri: String
  manifest: String
}

type Ethereum_Connection @imported(
  uri: "ens/ethereum.web3api.eth",
  namespace: "Ethereum",
  nativeType: "Connection"
) {
  node: String
  networkNameOrChainId: String
}

type Ethereum_TxOverrides @imported(
  uri: "ens/ethereum.web3api.eth",
  namespace: "Ethereum",
  nativeType: "TxOverrides"
) {
  gasLimit: BigInt
  gasPrice: BigInt
  value: BigInt
}

type Ethereum_StaticTxResult @imported(
  uri: "ens/ethereum.web3api.eth",
  namespace: "Ethereum",
  nativeType: "StaticTxResult"
) {
  result: String!
  error: Boolean!
}

type Ethereum_TxRequest @imported(
  uri: "ens/ethereum.web3api.eth",
  namespace: "Ethereum",
  nativeType: "TxRequest"
) {
  to: String
  from: String
  nonce: UInt32
  gasLimit: BigInt
  gasPrice: BigInt
  data: String
  value: BigInt
  chainId: UInt32
  type: UInt32
}

type Ethereum_TxReceipt @imported(
  uri: "ens/ethereum.web3api.eth",
  namespace: "Ethereum",
  nativeType: "TxReceipt"
) {
  to: String!
  from: String!
  contractAddress: String!
  transactionIndex: UInt32!
  root: String
  gasUsed: BigInt!
  logsBloom: String!
  transactionHash: String!
  logs: [Ethereum_Log!]!
  blockNumber: BigInt!
  blockHash: String!
  confirmations: UInt32!
  cumulativeGasUsed: BigInt!
  effectiveGasPrice: BigInt!
  byzantium: Boolean!
  type: UInt32!
  status: UInt32
}

type Ethereum_Log @imported(
  uri: "ens/ethereum.web3api.eth",
  namespace: "Ethereum",
  nativeType: "Log"
) {
  blockNumber: BigInt!
  blockHash: String!
  transactionIndex: UInt32!
  removed: Boolean!
  address: String!
  data: String!
  topics: [String!]!
  transactionHash: String!
  logIndex: UInt32!
}

type Ethereum_EventNotification @imported(
  uri: "ens/ethereum.web3api.eth",
  namespace: "Ethereum",
  nativeType: "EventNotification"
) {
  data: String!
  address: String!
  log: Ethereum_Log!
}

type Ethereum_Network @imported(
  uri: "ens/ethereum.web3api.eth",
  namespace: "Ethereum",
  nativeType: "Network"
) {
  name: String!
  chainId: Int!
  ensAddress: String
}

### Imported Objects END ###
`;
