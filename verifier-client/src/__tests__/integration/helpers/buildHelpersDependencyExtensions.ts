import * as awilix from 'awilix';
import { ethers } from 'ethers';
import { NameAndRegistrationPair } from 'awilix';
import { PackageOwner } from './PackageOwner';
import { RegistryAuthority } from './RegistryAuthority';
import { EnsApi } from './ens/EnsApi';
import { create } from 'ipfs-http-client';

export const buildHelpersDependencyExtensions = (): NameAndRegistrationPair<any> => {
  return {
    ipfsClient: awilix.asFunction(() => {
      return create({
        url: process.env.IPFS_URI
      });
    }),
    verifierSigner: awilix.asFunction(({ ethersProvider }) => {
      return new ethers.Wallet(process.env.VERIFIER_PRIVATE_KEY!, ethersProvider);
    }),
    authority: awilix.asFunction(({ ethersProvider }) => {
      return new RegistryAuthority(ethersProvider, process.env.REGISTRY_AUTHORITY_PRIVATE_KEY!);
    }),
    packageOwner: awilix.asFunction(({ ethersProvider }) => {
      return new PackageOwner(ethersProvider, process.env.PACKAGE_OWNER_PRIVATE_KEY!);
    }),
    ensApi: awilix.asClass(EnsApi)
  };
};