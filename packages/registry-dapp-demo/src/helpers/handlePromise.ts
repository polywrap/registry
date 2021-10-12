export const handlePromise = async <TError, TData>(
  promise: Promise<TData>
): Promise<[TError | undefined, TData | undefined]> => {
  let error: TError | undefined = undefined;
  let data: TData | undefined = undefined;

  const result = await promise.catch((err: TError) => {
    error = err;
  });

  data = result as TData | undefined;

  return [error, data];
};
