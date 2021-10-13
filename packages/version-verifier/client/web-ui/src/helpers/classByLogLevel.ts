import { LogLevel } from "../types";

export function classByLogLevel(loglevel: LogLevel): string {
  switch (loglevel) {
    case LogLevel.all:
      return "";
    case LogLevel.debug:
      return "log-level-debug";
    case LogLevel.info:
      return "log-level-info";
    case LogLevel.warn:
      return "log-level-warn";
    case LogLevel.error:
      return "log-level-error";
  }
}
