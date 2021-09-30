import "./App.scss";
import { Web3ApiProvider } from "@web3api/react";
import { useEffect, useState } from "react";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ToastProvider } from "react-toast-notifications";
import Sidebar from "../sidebar/Sidebar";
import { PackageOwner } from "@polywrap/registry-js";
import React from "react";
import { PolywrapRegistryContext } from "../../providers/PolywrapRegistryContext";
import { getPolywrapRegistryContracts } from "../../constants";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import ImplementationRegistryPage from "../pages/implementation-registry/ImplementationRegistryPage";
import VersionPublishPage from "../pages/version-publish/VersionPublishPage";
import WrappersPage from "../pages/wrappers/WrappersPage";
import { initWeb3 } from "../../hooks/initWeb3";
import { Web3Context } from "../../providers/Web3Context";

const App: React.FC = () => {
  const web3 = initWeb3();
  const [registry, setRegistry] = useState<
    | {
        packageOwner: PackageOwner;
      }
    | undefined
  >();
  const [redirects, setRedirects] = useState<any[]>();

  useEffect(() => {
    if (!web3) {
      return;
    }

    const packageOwner = new PackageOwner(
      web3.signer,
      getPolywrapRegistryContracts(web3.provider)
    );

    setRegistry({
      packageOwner,
    });

    setRedirects([
      {
        uri: "w3://ens/ethereum.web3api.eth",
        plugin: ethereumPlugin({
          networks: {
            rinkeby: {
              provider: web3.ethereumProvider,
            },
          },
        }),
      },
    ]);
  }, [web3]);

  return (
    <div className="App">
      <ToastProvider>
        <Web3ApiProvider plugins={redirects}>
          <Web3Context.Provider value={web3}>
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
          </Web3Context.Provider>
        </Web3ApiProvider>
      </ToastProvider>
    </div>
  );
};

export default App;
