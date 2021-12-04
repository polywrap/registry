import { ContractError } from "./ContractError";

export type MaybeError<Data> = [ContractError | undefined, Data | undefined];
