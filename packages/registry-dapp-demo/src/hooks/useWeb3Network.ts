import { useState } from "react";
import { SupportedNetwork } from "../constants";

export const useWeb3Network = (): [
  SupportedNetwork,
  (networkName: SupportedNetwork) => void
] => {
  const [networkName, setNetworkName] = useState<SupportedNetwork>("xDAI");

  return [networkName, setNetworkName];
};
