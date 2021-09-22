import "./App.scss";
import { Web3ApiProvider } from "@web3api/react";
import { useEffect, useState } from "react";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ToastProvider } from "react-toast-notifications";
import Logo from "./logo.png";

interface Log {
  timestamp: string;
  level: string;
  message: string;
}

function App(): JSX.Element {
  const ethereum = (window as any).ethereum;
  const [clientStatus, setClientStatus] = useState("Loading...");
  const [logs, setLogs] = useState<Log[]>([]);

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
    const response = await fetch(
      `http://localhost:${process.env.REACT_APP_API_PORT}/info`
    );
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  const getClientLogs = async () => {
    const response = await fetch(
      `http://localhost:${process.env.REACT_APP_API_PORT}/logs`
    );
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  useEffect(() => {
    getClientInfo().then(
      (info) => {
        setClientStatus(info.status);
      },
      (error) => {
        console.log(error);
        setClientStatus("offline");
      }
    );
    const logFetcher = setInterval(async () => {
      try {
        const resp = await getClientLogs();
        const logs = resp["data"] as Log[];
        setLogs(logs);
      } catch (e) {
        console.log(e);
      }
    }, 5000);
    return () => {
      clearInterval(logFetcher);
    };
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
            <h3 className="title">Verifier node</h3>
          </div>

          <div className="widget-container">Status: {clientStatus}</div>
          {logs &&
            logs.map((log, i) => (
              <div key={i}>
                <p>
                  {log.timestamp} - {log.level}: {log.message}
                </p>
              </div>
            ))}
        </Web3ApiProvider>
      </ToastProvider>
    </div>
  );
}

export default App;
