import { Interface } from "ethers/lib/utils";
import {
  PolywrapRegistryV1,
  PolywrapRegistryV1__factory,
} from "../../typechain-types";
import { ContractError } from "../types/ContractError";
import { handlePromiseError } from "./handlePromiseError";

export const handleContractError = async <TData>(
  promise: Promise<TData>
): Promise<[ContractError | undefined, TData | undefined]> => {
  const [error, data] = await handlePromiseError(promise);

  if (!error) {
    return [undefined, data];
  }

  const strError = (error as any).toString();
  if (!strError) {
    throw Error("An unexpected error occurred");
  }

  const match = strError.match(/"originalError":({[^}]+})/);
  if (!match) {
    return [
      {
        originalError: strError,
        message: "Reverted without a revert reason",
        customError: undefined,
      },
      undefined,
    ];
  }

  const parsedError = JSON.parse(match[1]);

  const iface = new Interface(PolywrapRegistryV1__factory.abi);

  if (!parsedError.data || !iface.getError(parsedError.data)) {
    return [
      {
        originalError: strError,
        message: "Reverted without a revert reason",
        customError: undefined,
      },
      undefined,
    ];
  }

  const customErrorName = iface.getError(parsedError.data).name;

  return [
    {
      originalError: strError,
      message: `Reverted with custom error: ${customErrorName}`,
      customError: customErrorName,
    },
    undefined,
  ];
};
