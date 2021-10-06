import { errors } from "ethers";
import { HTTPMethod } from "./HTTPMethod";
import { JSONString } from "./JSONString";

export type TData<TReturn> = TReturn | null;
export type TError =
  | BaseContractError
  | BaseTransactionError
  | TransactionError
  | null;

export type ContractCallResult<TReturn> = [TData<TReturn>, TError];

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
