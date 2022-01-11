import * as Types from "./";
import { Client, InvokeApiResult } from "@web3api/core-js";
export declare type UInt = number;
export declare type UInt8 = number;
export declare type UInt16 = number;
export declare type UInt32 = number;
export declare type Int = number;
export declare type Int8 = number;
export declare type Int16 = number;
export declare type Int32 = number;
export declare type Bytes = Uint8Array;
export declare type BigInt = string;
export declare type Json = string;
export declare type String = string;
export declare type Boolean = boolean;
export interface UriResolver_MaybeUriOrManifest {
    uri?: String | null;
    manifest?: String | null;
}
export interface Ethereum_Connection {
    node?: String | null;
    networkNameOrChainId?: String | null;
}
export interface Ethereum_TxOverrides {
    gasLimit?: BigInt | null;
    gasPrice?: BigInt | null;
    value?: BigInt | null;
}
export interface Ethereum_StaticTxResult {
    result: String;
    error: Boolean;
}
export interface Ethereum_TxRequest {
    to?: String | null;
    from?: String | null;
    nonce?: UInt32 | null;
    gasLimit?: BigInt | null;
    gasPrice?: BigInt | null;
    data?: String | null;
    value?: BigInt | null;
    chainId?: UInt32 | null;
    type?: UInt32 | null;
}
export interface Ethereum_TxReceipt {
    to: String;
    from: String;
    contractAddress: String;
    transactionIndex: UInt32;
    root?: String | null;
    gasUsed: BigInt;
    logsBloom: String;
    transactionHash: String;
    logs: Array<Types.Ethereum_Log>;
    blockNumber: BigInt;
    blockHash: String;
    confirmations: UInt32;
    cumulativeGasUsed: BigInt;
    effectiveGasPrice: BigInt;
    byzantium: Boolean;
    type: UInt32;
    status?: UInt32 | null;
}
export interface Ethereum_Log {
    blockNumber: BigInt;
    blockHash: String;
    transactionIndex: UInt32;
    removed: Boolean;
    address: String;
    data: String;
    topics: Array<String>;
    transactionHash: String;
    logIndex: UInt32;
}
export interface Ethereum_EventNotification {
    data: String;
    address: String;
    log: Types.Ethereum_Log;
}
export interface Ethereum_Network {
    name: String;
    chainId: Int;
    ensAddress?: String | null;
}
interface UriResolver_Query_Input_tryResolveUri extends Record<string, unknown> {
    authority: String;
    path: String;
}
interface UriResolver_Query_Input_getFile extends Record<string, unknown> {
    path: String;
}
export declare const UriResolver_Query: {
    tryResolveUri: (input: UriResolver_Query_Input_tryResolveUri, client: Client) => Promise<InvokeApiResult<Types.UriResolver_MaybeUriOrManifest | null>>;
    getFile: (input: UriResolver_Query_Input_getFile, client: Client) => Promise<InvokeApiResult<Bytes | null>>;
};
interface Ethereum_Query_Input_callContractView extends Record<string, unknown> {
    address: String;
    method: String;
    args?: Array<String> | null;
    connection?: Types.Ethereum_Connection | null;
}
interface Ethereum_Query_Input_callContractStatic extends Record<string, unknown> {
    address: String;
    method: String;
    args?: Array<String> | null;
    connection?: Types.Ethereum_Connection | null;
    txOverrides?: Types.Ethereum_TxOverrides | null;
}
interface Ethereum_Query_Input_encodeParams extends Record<string, unknown> {
    types: Array<String>;
    values: Array<String>;
}
interface Ethereum_Query_Input_encodeFunction extends Record<string, unknown> {
    method: String;
    args?: Array<String> | null;
}
interface Ethereum_Query_Input_getSignerAddress extends Record<string, unknown> {
    connection?: Types.Ethereum_Connection | null;
}
interface Ethereum_Query_Input_getSignerBalance extends Record<string, unknown> {
    blockTag?: BigInt | null;
    connection?: Types.Ethereum_Connection | null;
}
interface Ethereum_Query_Input_getSignerTransactionCount extends Record<string, unknown> {
    blockTag?: BigInt | null;
    connection?: Types.Ethereum_Connection | null;
}
interface Ethereum_Query_Input_getGasPrice extends Record<string, unknown> {
    connection?: Types.Ethereum_Connection | null;
}
interface Ethereum_Query_Input_estimateTransactionGas extends Record<string, unknown> {
    tx: Types.Ethereum_TxRequest;
    connection?: Types.Ethereum_Connection | null;
}
interface Ethereum_Query_Input_estimateContractCallGas extends Record<string, unknown> {
    address: String;
    method: String;
    args?: Array<String> | null;
    connection?: Types.Ethereum_Connection | null;
    txOverrides?: Types.Ethereum_TxOverrides | null;
}
interface Ethereum_Query_Input_checkAddress extends Record<string, unknown> {
    address: String;
}
interface Ethereum_Query_Input_toWei extends Record<string, unknown> {
    eth: String;
}
interface Ethereum_Query_Input_toEth extends Record<string, unknown> {
    wei: BigInt;
}
interface Ethereum_Query_Input_awaitTransaction extends Record<string, unknown> {
    txHash: String;
    confirmations: UInt32;
    timeout: UInt32;
    connection?: Types.Ethereum_Connection | null;
}
interface Ethereum_Query_Input_waitForEvent extends Record<string, unknown> {
    address: String;
    event: String;
    args?: Array<String> | null;
    timeout?: UInt32 | null;
    connection?: Types.Ethereum_Connection | null;
}
interface Ethereum_Query_Input_getNetwork extends Record<string, unknown> {
    connection?: Types.Ethereum_Connection | null;
}
export declare const Ethereum_Query: {
    callContractView: (input: Ethereum_Query_Input_callContractView, client: Client) => Promise<InvokeApiResult<String>>;
    callContractStatic: (input: Ethereum_Query_Input_callContractStatic, client: Client) => Promise<InvokeApiResult<Types.Ethereum_StaticTxResult>>;
    encodeParams: (input: Ethereum_Query_Input_encodeParams, client: Client) => Promise<InvokeApiResult<String>>;
    encodeFunction: (input: Ethereum_Query_Input_encodeFunction, client: Client) => Promise<InvokeApiResult<String>>;
    getSignerAddress: (input: Ethereum_Query_Input_getSignerAddress, client: Client) => Promise<InvokeApiResult<String>>;
    getSignerBalance: (input: Ethereum_Query_Input_getSignerBalance, client: Client) => Promise<InvokeApiResult<BigInt>>;
    getSignerTransactionCount: (input: Ethereum_Query_Input_getSignerTransactionCount, client: Client) => Promise<InvokeApiResult<BigInt>>;
    getGasPrice: (input: Ethereum_Query_Input_getGasPrice, client: Client) => Promise<InvokeApiResult<BigInt>>;
    estimateTransactionGas: (input: Ethereum_Query_Input_estimateTransactionGas, client: Client) => Promise<InvokeApiResult<BigInt>>;
    estimateContractCallGas: (input: Ethereum_Query_Input_estimateContractCallGas, client: Client) => Promise<InvokeApiResult<BigInt>>;
    checkAddress: (input: Ethereum_Query_Input_checkAddress, client: Client) => Promise<InvokeApiResult<Boolean>>;
    toWei: (input: Ethereum_Query_Input_toWei, client: Client) => Promise<InvokeApiResult<BigInt>>;
    toEth: (input: Ethereum_Query_Input_toEth, client: Client) => Promise<InvokeApiResult<String>>;
    awaitTransaction: (input: Ethereum_Query_Input_awaitTransaction, client: Client) => Promise<InvokeApiResult<Types.Ethereum_TxReceipt>>;
    waitForEvent: (input: Ethereum_Query_Input_waitForEvent, client: Client) => Promise<InvokeApiResult<Types.Ethereum_EventNotification>>;
    getNetwork: (input: Ethereum_Query_Input_getNetwork, client: Client) => Promise<InvokeApiResult<Types.Ethereum_Network>>;
};
export {};
