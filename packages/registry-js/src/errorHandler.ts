import { errors } from "ethers";
import { isPromise } from "./helpers/isPromise";
import {
  BaseContractError,
  BaseTransactionError,
  ContractCallResult,
  ErrorResponseBody,
  TransactionError,
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
            const error: TransactionError = {
              ...baseError,
              revertMessage: revertMessage,
            };
            return [error, undefined];
          } else {
            return [errorObj as BaseTransactionError, undefined];
          }
        } else {
          return [errorObj as BaseContractError, undefined];
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
