import * as awilix from "awilix";
import { NameAndRegistrationPair } from "awilix";
import { PackageOwner, PolywrapVotingSystem } from "@polywrap/registry-js";
import { Wallet } from "ethers";
import { create } from "ipfs-http-client";
import { RegistryContracts, RegistryAuthority } from "@polywrap/registry-js";
import winston from "winston";
import { SignerConfig } from "../../config/SignerConfig";
import { EnsTestContracts, EnsApi } from "@polywrap/registry-test-utils";
import { IpfsConfig } from "../../config/IpfsConfig";

export const buildHelpersDependencyExtensions = (loggerConfig: {
  consoleLogLevel: string;
  fileLogLevel: string;
  logFileName: string;
}): NameAndRegistrationPair<any> => {
  return {
    logger: awilix
      .asFunction(() => {
        const consoleFormat = winston.format.printf(
          ({ level, message, timestamp }) =>
            `${new Date(timestamp)} - ${level} - ${message}`
        );
        const jsonFormat = winston.format.printf((object) =>
          JSON.stringify(object)
        );

        return winston.createLogger({
          transports: [
            new winston.transports.Console({
              level: loggerConfig.consoleLogLevel,
              format: winston.format.combine(
                winston.format.simple(),
                winston.format.colorize(),
                winston.format.timestamp(),
                consoleFormat
              ),
            }),
            new winston.transports.File({
              filename: loggerConfig.logFileName,
              level: loggerConfig.fileLogLevel,
              format: winston.format.combine(
                winston.format.json(),
                winston.format.timestamp(),
                jsonFormat
              ),
            }),
          ],
        });
      })
      .singleton(),
    ipfsConfig: awilix.asClass(IpfsConfig).singleton(),
    ipfsClient: awilix.asFunction(() => {
      return create({
        url: process.env.IPFS_URI,
      });
    }),
    signerConfig: awilix.asClass(SignerConfig).singleton(),
    signers: awilix.asFunction(({ signerConfig }) => ({
      verifierSigner: new Wallet(signerConfig.verifierPrivateKey),
      registryAuthoritySigner: new Wallet(
        signerConfig.registryAuthorityPrivateKey
      ),
      packageOwnerSigner: new Wallet(signerConfig.packageOwnerPrivateKey),
    })),
    registryContracts: awilix.asFunction(({ ethersProvider }) => {
      return RegistryContracts.fromDefaultLocalhost(
        ethersProvider,
        "l2-chain-name"
      );
    }),
    registryContractsL1: awilix.asFunction(({ ethersProvider }) => {
      return RegistryContracts.fromDefaultLocalhost(
        ethersProvider,
        "l1-chain-name"
      );
    }),
    verifierSigner: awilix.asFunction(({ signers }) => {
      return signers.verifierSigner;
    }),
    registryAuthoritySigner: awilix.asFunction(({ signers }) => {
      return signers.registryAuthoritySigner;
    }),
    registryAuthority: awilix.asFunction(
      ({ registryAuthoritySigner, registryContracts }) => {
        return new RegistryAuthority(
          registryAuthoritySigner,
          registryContracts.votingMachine.address
        );
      }
    ),
    packageOwnerSigner: awilix.asFunction(({ signers }) => {
      return signers.packageOwnerSigner;
    }),
    packageOwner: awilix.asFunction(
      ({ packageOwnerSigner, registryContracts }) => {
        return new PackageOwner(packageOwnerSigner, registryContracts);
      }
    ),
    ensTestContracts: awilix.asFunction(({ ethersProvider }) => {
      return EnsTestContracts.fromTestnet(ethersProvider);
    }),
    ensApi: awilix.asFunction(({ ensTestContracts }) => {
      return new EnsApi(ensTestContracts);
    }),
    polywrapVotingSystem: awilix.asFunction(
      ({ verifierSigner, registryContracts }) => {
        return new PolywrapVotingSystem(verifierSigner, registryContracts);
      }
    ),
  };
};
