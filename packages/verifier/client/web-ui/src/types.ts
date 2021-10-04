export type ClientInfo = {
  status: string;
};

export enum LogLevel {
  all = "",
  debug = "debug",
  info = "info",
  warn = "warn",
  error = "error",
}

export type Log = {
  timestamp: string;
  level: string;
  message: string;
};

export type LogFilterOptions = {
  page: number;
  limit: number;
  filterBy?: LogLevel;
  search?: string;
};
