import "./ImplementationsComponent.scss";
import React, { useState } from "react";
import { useWeb3ApiClient } from "@web3api/react";
import { getImplementations } from "../../../../web3api/implementationRegistry";
import { speak } from "../../../../web3api/testInterface";
import Loader from "react-loader-spinner";
import { useToasts } from "react-toast-notifications";

const ImplementationsComponent: React.FC = () => {
  const client = useWeb3ApiClient();
  const { addToast, removeToast } = useToasts();

  const [areImplementationsLoading, setAreImplementationsLoading] = useState(
    false
  );
  const [interfaceUri, setInterfaceUri] = useState("");
  const [implementationsList, setImplementationsList] = useState<string[]>([]);

  const implementationElements = implementationsList.map((implementation) => (
    <div key={implementation} className="implementation">
      <div className="implementation-title">{implementation}</div>
      <div className="implementation-body">
        <button
          onClick={async () => {
            addToast("Waiting for the package to respond...", {
              appearance: "info",
              id: "speak",
              autoDismiss: false,
            });

            await speak(implementation, client)
              .then((result) => {
                addToast(result, {
                  appearance: "success",
                  autoDismiss: true,
                });
              })
              .catch((errors: { message: string }[]) => {
                for (const error of errors) {
                  addToast(error.message, {
                    appearance: "error",
                    autoDismiss: true,
                  });
                  console.error(error);
                }
              })
              .finally(() => {
                removeToast("speak");
              });
          }}
        >
          Speak
        </button>
      </div>
    </div>
  ));

  const implementations = areImplementationsLoading ? (
    <div className="implementations-loading">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  ) : (
    <div className="implementations">{implementationElements}</div>
  );

  return (
    <div className="ImplementationsComponent">
      <div>
        <h4 className="component-title">Find Implementations</h4>
      </div>

      <div>
        <input
          type="text"
          placeholder="Interface domain..."
          value={interfaceUri}
          onChange={(e) => setInterfaceUri(e.target.value)}
        />

        <button
          className="find-implementations"
          onClick={async () => {
            setAreImplementationsLoading(true);

            await getImplementations(interfaceUri, client)
              .then((result) => {
                setImplementationsList(result);
              })
              .catch((err) => console.error(err))
              .finally(() => {
                setAreImplementationsLoading(false);
              });
          }}
        >
          Find implementations
        </button>

        <button
          className="all-speak-btn"
          onClick={async () => {
            for (const implementation of implementationsList) {
              await speak(implementation, client)
                .then((result) => {
                  addToast(result, {
                    appearance: "success",
                    autoDismiss: true,
                  });
                })
                .catch((errors: { message: string }[]) => {
                  for (const error of errors) {
                    addToast(error.message, {
                      appearance: "error",
                      autoDismiss: true,
                    });
                    console.error(error);
                  }
                })
                .finally(() => {
                  removeToast("speak");
                });
            }
          }}
        >
          All speak
        </button>
      </div>

      {implementations}
    </div>
  );
};

export default ImplementationsComponent;
