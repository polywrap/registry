import {
  BlockchainsWithRegistry,
  EnsDomain,
  PackageOwner,
} from "@polywrap/registry-js";

export const relayOwnership = async (
  domain: EnsDomain,
  chainName: BlockchainsWithRegistry,
  packageOwner: PackageOwner
): Promise<void> => {
  await packageOwner.relayOwnership(domain, chainName);
};
