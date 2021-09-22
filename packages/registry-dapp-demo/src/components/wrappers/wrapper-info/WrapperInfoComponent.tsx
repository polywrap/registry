import "./WrapperInfoComponent.scss";
import { useWeb3ApiClient } from "@web3api/react";
import { PackageOwner } from "@polywrap/registry-js";
import { useToasts } from "react-toast-notifications";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import Loader from "react-loader-spinner";
import useConstant from "use-constant";
import { useState } from "react";

const WrapperInfoComponent: React.FC<{
  packageOwner: PackageOwner;
}> = ({ packageOwner }) => {
  const client = useWeb3ApiClient();
  const { addToast, removeToast } = useToasts();

  const [domainName, setDomainName] = useState("");
  const [isApiRegistered, setIsApiRegistered] = useState<boolean | undefined>();
  const [isApiRegisteredLoading, setIsApiRegisteredLoading] = useState(false);

  const checkIfApiRegisteredDebounced = useConstant(() => {
    const checkIfApiRegistered = async (domain: string) => {
      if (!domain || !domain.endsWith(".eth")) {
        setIsApiRegistered(undefined);
        return;
      }

      setIsApiRegisteredLoading(true);

      // versionRegistry
      //   .checkIfApiRegistered(domain, client)
      //   .then((isRegistered) => {
      //     setIsApiRegistered(isRegistered);
      //   })
      //   .finally(() => {
      //     setIsApiRegisteredLoading(false);
      //   });
    };

    return AwesomeDebouncePromise(checkIfApiRegistered, 350);
  });

  const apiRegisteredInfo = !isApiRegisteredLoading ? (
    isApiRegistered !== undefined && domainName ? (
      isApiRegistered ? (
        <span className="api-registered-message">
          Package is already registered
        </span>
      ) : (
        <span className="api-not-registered-message">
          Package is not yet registered
        </span>
      )
    ) : (
      <div className="empty-api-registered-container"></div>
    )
  ) : (
    <Loader type="TailSpin" color="#00BFFF" height={20} width={20} />
  );

  return (
    <div className="WrapperInfoComponent widget">
      <div>
        <h4 className="component-title">Polywrap Registry</h4>
      </div>

      <div className="api-to-register">
        <input
          type="text"
          value={domainName}
          placeholder="ENS domain..."
          onChange={async (e) => {
            setDomainName(e.target.value);
            await checkIfApiRegisteredDebounced(e.target.value);
          }}
        />

        <button
          className="register-api"
          onClick={async () => {
            addToast("Waiting for transaction to complete...", {
              appearance: "info",
              id: "registerAPI",
              autoDismiss: false,
            });

            // versionRegistry
            //   .registerAPI(apiToRegister, client!)
            //   .then(() => {
            //     addToast(`Registered ${apiToRegister}`, {
            //       appearance: "success",
            //       autoDismiss: true,
            //     });
            //   })
            //   .catch((errors: { message: string }[]) => {
            //     for (const error of errors) {
            //       if (error.message.includes("Package is already registered")) {
            //         addToast("Package is already registered", {
            //           appearance: "error",
            //           autoDismiss: true,
            //         });
            //       } else if (error.message.includes("Resolver not set")) {
            //         addToast("ENS Resolver not set", {
            //           appearance: "error",
            //           autoDismiss: true,
            //         });
            //       } else if (error.message.includes("execution reverted")) {
            //         addToast("RPC Error: execution reverted", {
            //           appearance: "error",
            //           autoDismiss: true,
            //         });
            //       } else {
            //         addToast(error.message, {
            //           appearance: "error",
            //           autoDismiss: true,
            //         });
            //       }

            //       console.error(error);
            //     }
            //   })
            //   .finally(() => {
            //     removeToast("registerAPI");
            //   });
          }}
        >
          Find
        </button>
      </div>

      <div>
        <h3>Info</h3>
        <div>ENS domain</div>
        <div>Name: test.eth</div>
        <div>Owner: 0x0</div>
        <div>Controller: 0x0</div>
        <div>Polywrap owner: 0x0</div>
        <div>Polywrapper</div>
        <div>
          Owner: 0x0 <button>Update owner</button>
        </div>
        <div>
          <select>
            <option selected value="xdai">
              xDAI
            </option>
          </select>
          <button>Relay ownership</button>
        </div>
        <div>Laterst version</div>
        <div>Id:</div>
        <div>Number:</div>
        <div>IPFS:</div>

        <button>Manage versions</button>
      </div>

      <div>{apiRegisteredInfo}</div>
    </div>
  );
};

export default WrapperInfoComponent;
