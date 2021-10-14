import { errors } from "ethers";
import { isPromise } from "./helpers/isPromise";
import {
  BaseContractError,
  BaseTransactionError,
  ContractCallResult,
  ErrorResponseBody,
  ContractError,
} from "./types/contractResultTypes";
import { FunctionResult } from "./types/FunctionResult";
import { MaybeAsync } from "./types/MaybeAsync";

function parseContractError<TReturn>(
  errorObj: Record<string, any>
): ContractCallResult<TReturn> {
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
        return [error, undefined];
      } else {
        const error: ContractError = {
          error: baseError,
          revertMessage: "Reverted without any message",
        };
        return [error, undefined];
      }
    } else {
      if (errorObj["reason"]) {
        const error: ContractError = {
          error: errorObj as BaseContractError,
          revertMessage: errorObj["reason"],
        };
        return [error, undefined];
      } else {
        const error: ContractError = {
          error: errorObj as BaseContractError,
          revertMessage: "Reverted without any message",
        };
        return [error, undefined];
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
        const [error, data] = (res
          .then((res: any) => [undefined, res])
          .catch((error) => [
            error,
            undefined,
          ]) as unknown) as ContractCallResult<TReturn>;

        if (error) {
          return parseContractError(error as Record<string, unknown>);
        } else {
          return [undefined, data];
        }
      } else {
        return [undefined, res];
      }
    } catch (err) {
      return parseContractError(err as Record<string, unknown>);
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
        const [error, data] = (res
          .then((res: any) => [undefined, res])
          .catch((error) => [
            error as Error,
            undefined,
          ]) as unknown) as FunctionResult<TReturn>;
        if (error) {
          return [parseError(error, func.name), undefined];
        } else {
          return [undefined, data];
        }
      } else {
        return [undefined, res];
      }
    } catch (err) {
      return [parseError(err as Error, func.name), undefined];
    }
  };
}
