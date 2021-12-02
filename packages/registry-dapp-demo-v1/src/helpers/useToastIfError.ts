import { useToasts } from "react-toast-notifications";

type ToastIfErrorFunc = <TData>(
  promise: Promise<[string | undefined, TData | undefined]>
) => Promise<TData | undefined>;

export const useToastIfError = (): ToastIfErrorFunc => {
  const { addToast } = useToasts();

  return async <TData>(
    promise: Promise<[string | undefined, TData | undefined]>
  ): Promise<TData | undefined> => {
    const [error, data] = await promise;

    if (error) {
      console.error(error);
      addToast(`Custom error: ${error}`, {
        appearance: "error",
        autoDismiss: true,
      });
    } else if (!data) {
      addToast(`Unexpected error`, {
        appearance: "error",
        autoDismiss: true,
      });
    }

    return data;
  };
};
