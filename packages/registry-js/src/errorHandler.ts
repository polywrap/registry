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

export function handleContractError<TArgs extends Array<unknown>, TReturn>(
  func: (...args: TArgs) => MaybeAsync<TReturn>
) {
  return (...args: TArgs): MaybeAsync<ContractCallResult<TReturn>> => {
    try {
      const res = func(...args);

      if (isPromise(res)) {
        const result = (res
          .then((res: any) => [undefined, res])
          .catch((error) => [
            error,
            undefined,
          ]) as unknown) as ContractCallResult<TReturn>;
        return result;
      } else {
        return [undefined, res];
      }
    } catch (err) {
      const errorObj = err as Record<string, any>;

      if (errorObj["code"] in errors) {
        if ("tx" in errorObj) {
          const baseError = errorObj as BaseTransactionError;
          const responseBody = JSON.parse(
            baseError.error.error.body
          ) as ErrorResponseBody;
          if (responseBody.error.message.startsWith("execution reverted: ")) {
            const revertMessage = responseBody.error.message
              .substring(20)
              .trim();
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

      throw err;
    }
  };
}

export function handleError<TArgs extends Array<unknown>, TReturn>(
  func: (...args: TArgs) => MaybeAsync<TReturn>
) {
  return (...args: TArgs): MaybeAsync<FunctionResult<TReturn>> => {
    try {
      const res = func(...args);

      if (isPromise(res)) {
        const result = (res
          .then((res: any) => [undefined, res])
          .catch((error) => [
            error,
            undefined,
          ]) as unknown) as FunctionResult<TReturn>;
        return result;
      } else {
        return [undefined, res];
      }
    } catch (err) {
      return [err as Error, undefined];
    }
  };
}
