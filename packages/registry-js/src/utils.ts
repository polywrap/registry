export type JSONString = string;

export enum HTTPMethod {
  GET,
  POST,
  PUT,
  DELETE,
  PATCH,
}

export type MaybeAsync<T> = Promise<T> | T;

export const isPromise = <T extends unknown>(
  test?: MaybeAsync<T>
): test is Promise<T> =>
  !!test && typeof (test as Promise<T>).then === "function";
