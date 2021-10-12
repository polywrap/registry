import { ethers, Signer } from "ethers";
import { EnsDomain } from "@polywrap/registry-core-js";
import { EnsApi } from "./EnsApi";

export const configureDomainForPolywrap = async (
  ensOwner: Signer,
  domainOwner: Signer,
  domain: EnsDomain,
  provider: ethers.providers.Provider
): Promise<void> => {
  const ensApi = new EnsApi(
    {
      ensRegistryL1: "0x2B2f78c5BF6D9C12Ee1225D5F374aa91204580c3",
      testEthRegistrarL1: "0xa2F6E6029638cCb484A2ccb6414499aD3e825CaC",
      testPublicResolverL1: "0xD2547e4AA4f5a2b0a512BFd45C9E3360FeEa48Df",
    },
    provider
  );

  await ensApi.registerDomainName(ensOwner, domainOwner, domain);
  await ensApi.setPolywrapOwner(domainOwner, domain);
};
