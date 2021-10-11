import { LeveledLogMethod, Logger } from "winston";

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
