export type MaybeError<Data> = [
  error: Error | undefined,
  data: Data | undefined
];
