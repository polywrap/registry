import { Logger } from "winston";
import { errors } from "ethers";
import { getLogger, LogLevel } from "./logger";
import {
  ContractCallResult,
  ErrorResponseBody,
} from "./helpers/contractResultTypes";
import { isPromise } from "./utils";
import { BaseContractError, BaseTransactionError } from ".";

export abstract class ErrorHandler {
  protected abstract logger: Logger;

  static errorHandler(logLevel: LogLevel) {
    return function (
      target: unknown,
      key: string | symbol,
      descriptor: PropertyDescriptor
    ): PropertyDescriptor {
      const original = descriptor.value;

      descriptor.value = function <TArgs extends Array<unknown>, TReturn>(
        ...args: TArgs[]
      ): ContractCallResult<TReturn> {
        try {
          const res = original.apply(this, args);

          if (isPromise(res)) {
            const result = (res.then(
              (res: any) => res
            ) as unknown) as ContractCallResult<TReturn>;
            return result;
          } else {
            return res as ContractCallResult<TReturn>;
          }
        } catch (err) {
          const errorObj = err as Record<string, any>;

          const logger = ((this as unknown) as ErrorHandler).logger;
          const log = getLogger(logger, logLevel);
          log(`Error: ${errorObj["message"]}`);

          if (errorObj["code"] in errors) {
            if ("tx" in errorObj) {
              const baseError = errorObj as BaseTransactionError;
              const responseBody = JSON.parse(
                baseError.error.error.body
              ) as ErrorResponseBody;
              if (
                responseBody.error.message.startsWith("execution reverted: ")
              ) {
                const revertMessage = responseBody.error.message
                  .substring(20)
                  .trim();
                const error = { ...baseError, revertMessage: revertMessage };
                return {
                  data: null,
                  error: error,
                };
              } else {
                const error = errorObj as BaseTransactionError;
                return {
                  data: null,
                  error: error,
                };
              }
            } else {
              return {
                data: null,
                error: errorObj as BaseContractError,
              };
            }
          }

          throw err;
        }
      };

      return descriptor;
    };
  }
}
