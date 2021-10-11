import { MaybeAsync } from "../types";

export const isPromise = <T extends unknown>(
  test?: MaybeAsync<T>
): test is Promise<T> =>
  !!test && typeof (test as Promise<T>).then === "function";
