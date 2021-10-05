import { LogLevel } from "./LogLevel";

export type LogFilterOptions = {
  page: number;
  limit: number;
  filterBy?: LogLevel;
  search?: string;
};
