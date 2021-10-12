import React from "react";
import { SupportedNetwork } from "../../constants";
import { useWeb3Context } from "../../hooks/useWeb3Context";

const NetworkSpecificView: React.FC<{
  network: SupportedNetwork;
  children: React.ReactNode;
}> = ({ network, children }) => {
  const [web3] = useWeb3Context();

  return web3 && web3.networkName && web3.networkName === network ? (
    <>{children}</>
  ) : (
    <></>
  );
};

export default NetworkSpecificView;
