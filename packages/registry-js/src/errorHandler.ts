import { errors } from "ethers";
import { isPromise } from "./helpers/isPromise";
import {
  BaseContractError,
  BaseTransactionError,
  ContractCallResult,
  ErrorResponseBody,
  ContractError,
  TError,
} from "./types/contractResultTypes";
import { FunctionResult } from "./types/FunctionResult";
import { MaybeAsync } from "./types/MaybeAsync";

function parseContractError(errorObj: Record<string, any>): TError {
  if (errorObj["code"] in errors) {
    if ("tx" in errorObj) {
      const baseError = errorObj as BaseTransactionError;
      const responseBody = JSON.parse(
        baseError.error.error.body
      ) as ErrorResponseBody;
      if (responseBody.error.message.startsWith("execution reverted: ")) {
        const revertMessage = responseBody.error.message.substring(20).trim();
        const error: ContractError = {
          error: baseError,
          revertMessage: revertMessage,
        };
        return error;
      } else {
        const error: ContractError = {
          error: baseError,
          revertMessage: "Reverted without any message",
        };
        return error;
      }
    } else {
      if (errorObj["reason"]) {
        const error: ContractError = {
          error: errorObj as BaseContractError,
          revertMessage: errorObj["reason"],
        };
        return error;
      } else {
        const error: ContractError = {
          error: errorObj as BaseContractError,
          revertMessage: "Reverted without any message",
        };
        return error;
      }
    }
  }

  throw errorObj;
}

export function handleContractError<TArgs extends Array<unknown>, TReturn>(
  func: (...args: TArgs) => MaybeAsync<TReturn>
) {
  return (...args: TArgs): MaybeAsync<ContractCallResult<TReturn>> => {
    try {
      const res = func(...args);

      if (isPromise(res)) {
        const result = res
          .then((res: any) => [undefined, res])
          .catch((err) => {
            return [parseContractError(err), undefined];
          });
        return result as Promise<ContractCallResult<TReturn>>;
      } else {
        return [undefined, res];
      }
    } catch (err) {
      return [parseContractError(err as Record<string, unknown>), undefined];
    }
  };
}

function parseError(error: Error, funcName: string): Error {
  if (error.message) {
    return error;
  } else {
    error.message = `Error: call to the function: ${funcName} failed`;
    return error;
  }
}

export function handleError<TArgs extends Array<unknown>, TReturn>(
  func: (...args: TArgs) => MaybeAsync<TReturn>
) {
  return (...args: TArgs): MaybeAsync<FunctionResult<TReturn>> => {
    try {
      const res = func(...args);

      if (isPromise(res)) {
        const result = res
          .then((res: any) => [undefined, res])
          .catch((err) => {
            return [parseError(err, func.name), undefined];
          });
        return result as Promise<FunctionResult<TReturn>>;
      } else {
        return [undefined, res];
      }
    } catch (err) {
      return [parseError(err as Error, func.name), undefined];
    }
  };
}
