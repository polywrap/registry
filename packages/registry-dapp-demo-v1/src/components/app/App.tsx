import "./App.scss";
import { Web3ApiProvider } from "@web3api/react";
import { useEffect, useState } from "react";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ToastProvider } from "react-toast-notifications";
import Sidebar from "../sidebar/Sidebar";
import {
  getContractAddressesForNetwork,
  PolywrapRegistry,
} from "@polywrap/registry-js";
import React from "react";
import { PolywrapRegistryContext } from "../../providers/PolywrapRegistryContext";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import WrappersPage from "../pages/wrappers/WrappersPage";
import { useWeb3 } from "../../hooks/useWeb3";
import { Web3Context } from "../../providers/Web3Context";

const App: React.FC = () => {
  const [web3, setWeb3] = useWeb3();
  const [registry, setRegistry] = useState<PolywrapRegistry | undefined>();
  const [redirects, setRedirects] = useState<any[]>();

  useEffect(() => {
    if (!web3) {
      return;
    }

    setRegistry(
      new PolywrapRegistry(
        web3.signer,
        getContractAddressesForNetwork("rinkeby")
      )
    );

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
  }, [web3, web3?.networkName]);

  return (
    <div className="App">
      <ToastProvider>
        <Web3ApiProvider plugins={redirects}>
          <Web3Context.Provider value={[web3, setWeb3]}>
            <PolywrapRegistryContext.Provider value={registry}>
              <Sidebar />
              {registry ? (
                <Router>
                  <Switch>
                    <Route exact path="/" render={() => <WrappersPage />} />
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
