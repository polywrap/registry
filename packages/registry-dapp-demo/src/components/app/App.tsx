import "./App.scss";
import { Web3ApiProvider } from "@web3api/react";
import { useEffect } from "react";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ToastProvider } from "react-toast-notifications";
import Sidebar from "../sidebar/Sidebar";
import Content from "./content/Content";

const App: React.FC = () => {
  const ethereum = (window as any).ethereum;

  useEffect(() => {
    (async () => {
      if (ethereum) {
        await ethereum.request({ method: "eth_requestAccounts" });
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
          <Sidebar />
          <Content />
        </Web3ApiProvider>
      </ToastProvider>
    </div>
  );
};

export default App;
