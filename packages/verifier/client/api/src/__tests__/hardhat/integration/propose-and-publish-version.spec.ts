import { expect } from "chai";
import { ethers } from "hardhat";
import { buildDependencyContainer } from "../../../di/buildDependencyContainer";
import { VerifierClient } from "../../../services/VerifierClient";
import { EnsApi } from "../../../helpers/EnsApi";
import { buildHelpersDependencyExtensions } from "./helpers/buildHelpersDependencyExtensions";
import {
  EnsDomain,
  PackageOwner,
  RegistryAuthority,
  RegistryContracts,
  Tracer,
} from "@polywrap/registry-js";
import { deployments } from "hardhat";
import { Signer } from "ethers";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import { IpfsPublisher } from "./helpers/IpfsPublisher";
import { Logger } from "winston";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("custom-env").env(process.env.NODE_ENV);

describe("Start local chain", () => {
  let logger: Logger;
  let verifierClient: VerifierClient;
  let registryAuthority: RegistryAuthority;
  let ensApi: EnsApi;
  let registryAuthoritySigner: Signer;
  let verifierSigner: Signer;
  let packageOwnerSigner: Signer;
  let ipfsPublisher: IpfsPublisher;
  let registryContractsL1: RegistryContracts;
  let registryContractsL2: RegistryContracts;

  const configureDomainForPolywrap = async (
    packageOwnerSigner: Signer,
    domain: EnsDomain
  ) => {
    await ensApi.registerDomainName(
      registryAuthoritySigner,
      packageOwnerSigner,
      domain
    );
    await ensApi.setPolywrapOwner(packageOwnerSigner, domain);
  };

  const authorizeCurrentVerifier = async () => {
    await registryAuthority.authorizeVerifiers([
      await verifierSigner.getAddress(),
    ]);
  };

  const publishAndVerifyVersion = async (
    packageOwner: PackageOwner,
    domain: EnsDomain,
    majorNumber: number,
    minorNumber: number,
    patchNumber: number,
    packageLocation: string
  ) => {
    const proof = await packageOwner.fetchAndCalculateVerificationProof(
      domain,
      majorNumber,
      minorNumber,
      patchNumber
    );

    await packageOwner.publishVersion(
      domain,
      packageLocation,
      majorNumber,
      minorNumber,
      patchNumber,
      proof
    );

    const versionInfo = await packageOwner.getVersionNodeInfo(
      domain,
      majorNumber,
      minorNumber,
      patchNumber
    );
    const resolvedPackageLocation = await packageOwner.resolveToPackageLocation(
      domain,
      majorNumber,
      minorNumber,
      patchNumber
    );

    expect(versionInfo.location).to.eq(packageLocation);
    expect(resolvedPackageLocation).to.eq(packageLocation);
  };

  before(async () => {
    const [
      _registryAuthoritySigner,
      _verifierSigner,
      _packageOwnerSigner,
    ] = await ethers.getSigners();

    registryAuthoritySigner = _registryAuthoritySigner;
    verifierSigner = _verifierSigner;
    packageOwnerSigner = _packageOwnerSigner;

    if (process.env.ENABLE_TRACER) {
      Tracer.enableTracing("verifier-client");
    }
  });

  beforeEach(async () => {
    await deployments.fixture(["l1", "l2"]);

    const dependencyContainer = buildDependencyContainer(
      buildHelpersDependencyExtensions(
        {
          registryAuthoritySigner,
          verifierSigner,
          packageOwnerSigner,
        },
        {
          registry: await (await ethers.getContract("PolywrapRegistryL1"))
            .address,
          versionVerificationManager: await (
            await ethers.getContract("VersionVerificationManagerL2")
          ).address,
          packageOwnershipManager: await (
            await ethers.getContract("PackageOwnershipManagerL1")
          ).address,
          ensLink: await (await ethers.getContract("EnsLinkL1")).address,
        },
        {
          packageOwnershipManager: await (
            await ethers.getContract("PackageOwnershipManagerL2")
          ).address,
          versionVerificationManager: await (
            await ethers.getContract("VersionVerificationManagerL2")
          ).address,
          registrar: await (await ethers.getContract("PolywrapRegistrar"))
            .address,
          verificationTreeManager: await (
            await ethers.getContract("VerificationTreeManager")
          ).address,
          verificationRootRelayer: await (
            await ethers.getContract("VerificationRootRelayer")
          ).address,
          registry: await (await ethers.getContract("PolywrapRegistryL2"))
            .address,
          votingMachine: await (await ethers.getContract("VotingMachine"))
            .address,
        },
        {
          ensRegistryL1: await (await ethers.getContract("EnsRegistryL1"))
            .address,
          testEthRegistrarL1: await (
            await ethers.getContract("TestEthRegistrarL1")
          ).address,
          testPublicResolverL1: await (
            await ethers.getContract("TestPublicResolverL1")
          ).address,
        }
      )
    );

    verifierClient = dependencyContainer.cradle.verifierClient;
    registryAuthority = dependencyContainer.cradle.registryAuthority;
    ensApi = dependencyContainer.cradle.ensApi;
    ipfsPublisher = dependencyContainer.cradle.ipfsPublisher;
    logger = dependencyContainer.cradle.logger;
    registryContractsL1 = dependencyContainer.cradle.registryContractsL1;
    registryContractsL2 = dependencyContainer.cradle.registryContracts;
  });

  it("sanity", async () => {
    logger.info("Running sanity test!");
    const domain = new EnsDomain("test");
    const l2ChainName = "l2-chain-name";
    const polywrapBuildPath = `${__dirname}/test-build`;
    const majorNumber = 1;
    const minorNumber = 0;
    const patchNumber = 0;

    await configureDomainForPolywrap(packageOwnerSigner, domain);

    let packageOwner = new PackageOwner(
      packageOwnerSigner,
      registryContractsL1
    );

    const patchNodeId = packageOwner.calculatePatchNodeId(
      domain,
      majorNumber,
      minorNumber,
      patchNumber
    );

    const packageLocation = await ipfsPublisher.publishDir(polywrapBuildPath);

    await packageOwner.updateOwnership(domain);
    await packageOwner.relayOwnership(domain, l2ChainName);

    packageOwner = new PackageOwner(packageOwnerSigner, registryContractsL2);

    await packageOwner.proposeVersion(
      domain,
      majorNumber,
      minorNumber,
      patchNumber,
      packageLocation
    );

    await authorizeCurrentVerifier();

    const [votingResult] = await Promise.all([
      packageOwner.waitForVotingEnd(
        domain,
        majorNumber,
        minorNumber,
        patchNumber,
        packageLocation
      ),
      verifierClient.queryAndVerifyVersions(),
    ]);

    expect(votingResult.patchNodeId).to.eq(patchNodeId);
    expect(votingResult.verified).to.eq(true);

    await publishAndVerifyVersion(
      packageOwner,
      domain,
      majorNumber,
      minorNumber,
      patchNumber,
      packageLocation
    );
  });
});
