import "./App.scss";
import { Web3ApiProvider } from "@web3api/react";
import { useEffect } from "react";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ToastProvider } from "react-toast-notifications";
import Logo from "./logo.png";

function App() {
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

  const getClientInfo = async () => {
    const response = await fetch("localhost:8091/info");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  useEffect(() => {
    getClientInfo().then((info) => {
      console.log(info);
    });
  }, []);

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
          <div>
            <img src={Logo} className="main__logo" />
            <h3 className="title">Verifier client node</h3>
          </div>

          <div className="widget-container"></div>
        </Web3ApiProvider>
      </ToastProvider>
    </div>
  );
}

export default App;
