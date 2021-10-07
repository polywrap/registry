import React from "react";
import { SupportedNetwork } from "../../constants";
import { useWeb3 } from "../../hooks/useWeb3";

const ChainSpecificView: React.FC<{
  chainName: SupportedNetwork;
  children: React.ReactNode;
}> = ({ chainName, children }) => {
  const [web3] = useWeb3();

  return web3 && web3.networkName && web3.networkName === chainName ? (
    <>{children}</>
  ) : (
    <></>
  );
};

export default ChainSpecificView;
