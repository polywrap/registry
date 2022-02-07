import "./App.scss";
import { Web3ApiProvider } from "@web3api/react";
import { useEffect, useState } from "react";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ToastProvider } from "react-toast-notifications";
import Sidebar from "../sidebar/Sidebar";
import { PackageOwner, PolywrapVotingSystem } from "@polywrap/registry-js";
import React from "react";
import { PolywrapRegistryContext } from "../../providers/PolywrapRegistryContext";
import { getPolywrapRegistryContracts } from "../../constants";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import ImplementationRegistryPage from "../pages/implementation-registry/ImplementationRegistryPage";
import VersionPublishPage from "../pages/version-publish/VersionPublishPage";
import WrappersPage from "../pages/wrappers/WrappersPage";
import { useWeb3 } from "../../hooks/useWeb3";
import { Web3Context } from "../../providers/Web3Context";
import { LoggerContext } from "../../providers/loggerContext";

import winston from "winston";

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(winston.format.simple()),
    }),
  ],
});

const App: React.FC = () => {
  const [web3, setWeb3] = useWeb3();
  const [registry, setRegistry] = useState<
    | {
        packageOwner: PackageOwner;
        polywrapVotingSystem: PolywrapVotingSystem;
      }
    | undefined
  >();
  const [redirects, setRedirects] = useState<any[]>();

  useEffect(() => {
    if (!web3) {
      return;
    }
    const registryContracts = getPolywrapRegistryContracts(
      web3.provider,
      web3.networkName
    );
    const packageOwner = new PackageOwner(web3.signer, registryContracts);

    const polywrapVotingSystem = new PolywrapVotingSystem(
      web3.signer,
      registryContracts
    );

    setRegistry({
      packageOwner,
      polywrapVotingSystem,
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
  }, [web3, web3?.networkName]);

  return (
    <div className="App">
      <ToastProvider>
        <LoggerContext.Provider value={logger}>
          <Web3ApiProvider plugins={redirects}>
            <Web3Context.Provider value={[web3, setWeb3]}>
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
        </LoggerContext.Provider>
      </ToastProvider>
    </div>
  );
};

export default App;
