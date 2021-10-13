import axios from "axios";
import { ClientInfo, Log, LogFilterOptions } from "../types";

export const api = axios.create({
  baseURL: `http://localhost:${process.env.REACT_APP_API_PORT}`,
  method: "GET",
});

export async function getClientInfo(): Promise<ClientInfo> {
  const response = await api({
    url: "info",
  });
  return response.data;
}

export async function getClientLogs(
  options: LogFilterOptions
): Promise<Array<Log>> {
  const response = await api({
    url: "logs",
    params: options,
  });
  return response.data;
}
