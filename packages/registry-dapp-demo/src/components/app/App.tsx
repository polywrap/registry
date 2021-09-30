import "./App.scss";
import { Web3ApiProvider } from "@web3api/react";
import { useEffect, useState } from "react";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ToastProvider } from "react-toast-notifications";
import Sidebar from "../sidebar/Sidebar";
import { PackageOwner } from "@polywrap/registry-js";
import { ethers } from "ethers";
import React from "react";
import { PolywrapRegistryContext } from "../../providers/PolywrapRegistryContextProvider";
import { getPolywrapRegistryContracts } from "../../constants";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ImplementationRegistryPage from "../pages/implementation-registry/ImplementationRegistryPage";
import VersionPublishPage from "../pages/version-publish/VersionPublishPage";
import WrappersPage from "../pages/wrappers/WrappersPage";

const App: React.FC = () => {
  const ethereum = (window as any).ethereum;

  const [registry, setRegistry] = useState<
    | {
        packageOwner: PackageOwner;
      }
    | undefined
  >();

  useEffect(() => {
    (async () => {
      if (ethereum) {
        await ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner(0);
        console.log(signer);

        const packageOwner = new PackageOwner(
          signer,
          getPolywrapRegistryContracts(provider)
        );

        setRegistry({
          packageOwner,
        });
      } else {
        throw Error("Please install Metamask.");
      }
    })();
  }, [ethereum]);

  const redirects: any[] = [
    {
      uri: "w3://ens/ethereum.web3api.eth",
      plugin: ethereumPlugin({
        networks: {
          rinkeby: {
            provider: ethereum,
          },
        },
      }),
    },
  ];

  return (
    <div className="App">
      <ToastProvider>
        <Web3ApiProvider plugins={redirects}>
          <PolywrapRegistryContext.Provider value={registry}>
            <Sidebar />
            {registry ? (
              <Router>
                <Switch>
                  <Route exact path="/" render={() => <WrappersPage />} />
                  <Route
                    exact
                    path="/version-publish"
                    render={() => <VersionPublishPage />}
                  />
                  <Route
                    exact
                    path="/implementation-registry"
                    render={() => <ImplementationRegistryPage />}
                  />
                  <Route path="*" component={() => <div>Not Found </div>} />
                </Switch>
              </Router>
            ) : (
              <></>
            )}
          </PolywrapRegistryContext.Provider>
        </Web3ApiProvider>
      </ToastProvider>
    </div>
  );
};

export default App;
