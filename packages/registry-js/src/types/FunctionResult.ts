export type TData<TReturn> = TReturn | undefined;
export type TError = Error | undefined;

export type FunctionResult<TReturn> = [TError, TData<TReturn>];
