import "./App.scss";
import { Web3ApiProvider } from "@web3api/react";
import { useEffect, useState } from "react";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ToastProvider } from "react-toast-notifications";
import Sidebar from "../sidebar/Sidebar";
import Content from "./content/Content";
import { PackageOwner, RegistryContracts } from "@polywrap/registry-js";
import { ethers } from "ethers";

const App: React.FC = () => {
  const ethereum = (window as any).ethereum;

  const [packageOwner, setPackageOwner] = useState<PackageOwner | undefined>();

  useEffect(() => {
    (async () => {
      if (ethereum) {
        await ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner(0);
        console.log(signer);

        const packageOwner1 = new PackageOwner(
          signer,
          RegistryContracts.fromAddresses(
            {
              versionVerificationManagerL2:
                "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
              packageOwnershipManagerL1:
                "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
              registrar: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
              verificationTreeManager:
                "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
              registryL1: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
              registryL2: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
              votingMachine: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
            },
            provider
          )
        );

        setPackageOwner(packageOwner1);
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
          <Content packageOwner={packageOwner!} />
        </Web3ApiProvider>
      </ToastProvider>
    </div>
  );
};

export default App;
