import { errors } from "ethers";
import {
  ContractCallResult,
  ErrorResponseBody,
  TransactionError,
} from "./types/contractResultTypes";
import { isPromise } from "./helpers/isPromise";
import { BaseContractError, BaseTransactionError, MaybeAsync } from "./types";

export function handleContractError<TArgs extends Array<unknown>, TReturn>(
  func: (...args: TArgs) => MaybeAsync<TReturn>
) {
  return (...args: TArgs): MaybeAsync<ContractCallResult<TReturn>> => {
    try {
      const res = func(...args);

      if (isPromise(res)) {
        const result = (res.then((res: any) => res) as unknown) as TReturn;
        return [result, null];
      } else {
        return [res, null];
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
            return [null, error];
          } else {
            return [null, errorObj as BaseTransactionError];
          }
        } else {
          return [null, errorObj as BaseContractError];
        }
      }

      throw err;
    }
  };
}
