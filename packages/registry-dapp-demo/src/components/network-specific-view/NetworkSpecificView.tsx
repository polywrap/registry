import React from "react";
import { SupportedNetwork } from "../../constants";
import { useWeb3 } from "../../hooks/useWeb3";

const NetworkSpecificView: React.FC<{
  network: SupportedNetwork;
  children: React.ReactNode;
}> = ({ network, children }) => {
  const [web3] = useWeb3();

  return web3 && web3.networkName && web3.networkName === network ? (
    <>{children}</>
  ) : (
    <></>
  );
};

export default NetworkSpecificView;
