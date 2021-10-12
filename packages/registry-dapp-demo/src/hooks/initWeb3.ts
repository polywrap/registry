import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Web3 } from "../types/Web3";

export const initWeb3 = (): [
  Web3 | undefined,
  React.Dispatch<React.SetStateAction<Web3 | undefined>>
] => {
  const ethereum = (window as any).ethereum;
  const [web3, setWeb3] = useState<Web3>();

  useEffect(() => {
    (async () => {
      if (ethereum) {
        await ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner(0);

        const address = await signer.getAddress();
        const { chainId } = await provider.getNetwork();

        setWeb3({
          account: address,
          ethereumProvider: ethereum,
          provider: provider,
          signer: signer,
          chainId: chainId,
          networkName: "rinkeby",
        });
      } else {
        throw Error("Please install Metamask.");
      }
    })();
  }, [ethereum]);

  return [web3, setWeb3];
};
