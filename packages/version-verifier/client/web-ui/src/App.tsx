import "./App.scss";
import { Web3ApiProvider } from "@web3api/react";
import { useEffect, useState } from "react";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ToastProvider } from "react-toast-notifications";
import Logo from "./logo.png";
import { getClientInfo, getClientLogs } from "./services/verifier-client-api";
import { Log, LogFilterOptions, LogLevel } from "./types";
import { classByLogLevel } from "./helpers/classByLogLevel";

function App(): JSX.Element {
  const ethereum = (window as any).ethereum;
  const [clientStatus, setClientStatus] = useState("Loading...");
  const [logs, setLogs] = useState<Log[]>([]);
  const [logFilterOptions, setLogFilterOptions] = useState<LogFilterOptions>({
    page: 1,
    limit: 50,
    filterBy: LogLevel.all,
    search: "",
  });

  useEffect(() => {
    (async () => {
      if (ethereum) {
        await ethereum.request({ method: "eth_requestAccounts" });
      } else {
        throw Error("Please install Metamask.");
      }
    })();
  }, [ethereum]);

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
  }, []);

  useEffect(() => {
    const logFetcher = () => {
      getClientLogs(logFilterOptions)
        .then((logs) => {
          setLogs(logs);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    logFetcher();

    const logFetcherId = setInterval(logFetcher, 10000);
    return () => {
      clearInterval(logFetcherId);
    };
  }, [logFilterOptions]);

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

  function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setLogFilterOptions((options: LogFilterOptions) => {
      const newOptions = { ...options };
      newOptions.search = e.target.value;
      return newOptions;
    });
  }

  function onLogLevel(e: React.ChangeEvent<HTMLInputElement>) {
    setLogFilterOptions((options: LogFilterOptions) => {
      const newOptions = { ...options };
      newOptions.filterBy = e.target.value as LogLevel;
      return newOptions;
    });
  }

  function onChangeRecords(e: React.ChangeEvent<HTMLSelectElement>) {
    setLogFilterOptions((options: LogFilterOptions) => {
      const newOptions = { ...options };
      newOptions.limit = +e.target.value;
      return newOptions;
    });
  }

  return (
    <div className="App">
      <ToastProvider>
        <Web3ApiProvider plugins={redirects}>
          <div>
            <img src={Logo} className="main__logo" />
            <h3 className="title">Verifier node</h3>
          </div>
          <div className="widget-container">Status: {clientStatus}</div>
          <br />
          <div className="main-container">
            <div className="widget-container" style={{ width: "100%" }}>
              <div
                style={{
                  display: "inline-block",
                  float: "left",
                  width: "100px",
                }}
              >
                <label>
                  <input
                    style={{ display: "inline-block" }}
                    type="search"
                    name="search"
                    placeholder="Search"
                    value={logFilterOptions.search}
                    onChange={onSearch}
                  />
                </label>
              </div>
              <div
                style={{
                  display: "inline-block",
                }}
              >
                <label className="log-level">
                  <input
                    type="radio"
                    name="logLevel"
                    value={LogLevel.all}
                    checked={logFilterOptions.filterBy === LogLevel.all}
                    onChange={onLogLevel}
                  />
                  All
                </label>
                <label className="log-level">
                  <input
                    type="radio"
                    name="logLevel"
                    value={LogLevel.debug}
                    checked={logFilterOptions.filterBy === LogLevel.debug}
                    onChange={onLogLevel}
                  />
                  Debug
                </label>
                <label className="log-level">
                  <input
                    type="radio"
                    name="logLevel"
                    value={LogLevel.info}
                    checked={logFilterOptions.filterBy === LogLevel.info}
                    onChange={onLogLevel}
                  />
                  Info
                </label>
                <label className="log-level">
                  <input
                    type="radio"
                    name="logLevel"
                    value={LogLevel.warn}
                    checked={logFilterOptions.filterBy === LogLevel.warn}
                    onChange={onLogLevel}
                  />
                  Warn
                </label>
                <label className="log-level">
                  <input
                    type="radio"
                    name="logLevel"
                    value={LogLevel.error}
                    checked={logFilterOptions.filterBy === LogLevel.error}
                    onChange={onLogLevel}
                  />
                  Error
                </label>
              </div>
              <div
                style={{
                  display: "inline-block",
                  float: "right",
                  width: "100px",
                }}
              >
                <label style={{ margin: 0, flexBasis: "100px" }}>Records</label>
              </div>
              <div
                style={{
                  display: "inline-block",
                  float: "right",
                  width: "100px",
                }}
              >
                <select
                  name="limit"
                  id="limit"
                  value={logFilterOptions.limit}
                  onChange={onChangeRecords}
                >
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                </select>
              </div>
            </div>
            <br />
            <br />

            {logs &&
              logs.map((log, i) => (
                <div key={i}>
                  <div
                    className="widget-container"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div
                      style={{ display: "inline-block", verticalAlign: "top" }}
                    >
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                    <div
                      style={{
                        display: "inline-block",
                        marginLeft: "5rem",
                        verticalAlign: "top",
                      }}
                    >
                      <button
                        className={classByLogLevel(log.level as LogLevel)}
                        style={{ width: "100px" }}
                      >
                        {log.level}
                      </button>
                    </div>
                    <div
                      style={{
                        display: "inline-block",
                        marginLeft: "5rem",
                        maxWidth: "55%",
                        verticalAlign: "top",
                      }}
                    >
                      {log.message}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Web3ApiProvider>
      </ToastProvider>
    </div>
  );
}

export default App;
