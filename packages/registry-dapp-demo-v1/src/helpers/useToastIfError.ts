import { ContractError } from "@polywrap/registry-js/bin/v1/types/ContractError";
import { useToasts } from "react-toast-notifications";

type ToastIfErrorFunc = <TData>(
  promise: Promise<[ContractError | undefined, TData | undefined]>
) => Promise<TData | undefined>;

export const useToastIfError = (): ToastIfErrorFunc => {
  const { addToast } = useToasts();

  return async <TData>(
    promise: Promise<[ContractError | undefined, TData | undefined]>
  ): Promise<TData | undefined> => {
    const [error, data] = await promise;

    if (error) {
      console.error(error);
      addToast(`${error.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }

    return data;
  };
};
