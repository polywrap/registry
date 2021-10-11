import { errors } from "ethers";
import { HTTPMethod } from "./HTTPMethod";
import { JSONString } from "./JSONString";

export type TData<TReturn> = TReturn | undefined;
export type TError =
  | BaseContractError
  | BaseTransactionError
  | TransactionError
  | undefined;

export type ContractCallResult<TReturn> = [TError, TData<TReturn>];

export type BaseContractError = {
  message: string;
  reason: string;
  code: errors;
};

export type BaseTransactionError = BaseContractError & {
  error: {
    reason: string;
    code: errors;
    error: {
      reason: string;
      code: errors;
      body: JSONString;
      error: {
        code: number;
        data: string;
      };
      requestBody: JSONString;
      requestMethod: HTTPMethod;
      url: string;
    };
  };
};

export type TransactionError = BaseTransactionError & {
  revertMessage: string;
};

export type ErrorResponseBody = {
  jsonrpc: string;
  id: number;
  error: {
    code: number;
    data: string;
    message: string;
  };
};
