import { errors } from "ethers";
import { HTTPMethod, JSONString } from "./utils";

export type ContractCallResult<TReturn> = {
  data: TReturn | null;
  error: BaseContractError | BaseTransactionError | TransactionError | null;
};

export type BaseContractError = {
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
