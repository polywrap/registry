import { LeveledLogMethod, Logger } from "winston";

export type FunctionResult<TReturn> = {
  data: TReturn | null;
  error: unknown | null;
};

type MaybeAsync<T> = Promise<T> | T;

export enum LogLevel {
  debug = "debug",
  info = "info",
  warn = "warn",
  error = "error",
}

export function getLogger(
  logger: Logger,
  logLevel: LogLevel
): LeveledLogMethod {
  switch (logLevel) {
    case LogLevel.debug:
      return logger.debug;
    case LogLevel.info:
      return logger.info;
    case LogLevel.warn:
      return logger.warn;
    case LogLevel.error:
      return logger.error;
  }
}

const isPromise = <T extends unknown>(
  test?: MaybeAsync<T>
): test is Promise<T> =>
  !!test && typeof (test as Promise<T>).then === "function";

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
      ): FunctionResult<TReturn> {
        try {
          const result = original.apply(this, args);

          if (isPromise(result)) {
            return {
              data: (result.then((res: any) => res) as unknown) as TReturn,
              error: null,
            };
          } else {
            return {
              data: result,
              error: null,
            };
          }
        } catch (error) {
          const logger = ((this as unknown) as ErrorHandler).logger;
          const log = getLogger(logger, logLevel);
          log(`Error: ${error}`);
          return {
            data: null,
            error: error,
          };
        }
      };

      return descriptor;
    };
  }
}
