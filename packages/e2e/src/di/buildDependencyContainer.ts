import * as awilix from "awilix";
import { ethers } from "ethers";
import { NameAndRegistrationPair } from "awilix";

export const buildDependencyContainer = (
  extensionsAndOverrides?: NameAndRegistrationPair<any>
): awilix.AwilixContainer<any> => {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
  });

  container.register({
    ethersProvider: awilix.asFunction(() => {
      return ethers.providers.getDefaultProvider(
        `${process.env.PROVIDER_NETWORK}`
      );
    }),
    ...extensionsAndOverrides,
  });

  return container;
};
