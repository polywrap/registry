import { expect } from "chai";
import { ethers } from "hardhat";
import { IPFSHTTPClient } from "ipfs-http-client";
import { buildDependencyContainer } from "../../../di/buildDependencyContainer";
import { VerifierClient } from "../../../services/VerifierClient";
import { EnsApi } from "./helpers/ens/EnsApi";
import { buildHelpersDependencyExtensions } from "./helpers/buildHelpersDependencyExtensions";
import { down, up } from "./helpers/testEnv";
import {
  EnsDomain,
  PackageOwner,
  RegistryAuthority,
} from "@polywrap/registry-js";
import { publishToIPFS } from "@polywrap/registry-test-utils";
import { deployments } from "hardhat";
import { Signer } from "ethers";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("custom-env").env("local");

describe("Start local chain", () => {
  let verifierClient: VerifierClient;
  let packageOwner: PackageOwner;
  let registryAuthority: RegistryAuthority;
  let ensApi: EnsApi;
  let registryAuthoritySigner: Signer;
  let verifierSigner: Signer;
  let packageOwnerSigner: Signer;
  let ipfsClient: IPFSHTTPClient;

  const configureDomainForPolywrap = async (domain: EnsDomain) => {
    await ensApi.registerDomainName(
      registryAuthoritySigner,
      packageOwner.signer,
      domain
    );
    await ensApi.setPolywrapOwner(packageOwner.signer, domain);
  };

  const authorizeCurrentVerifier = async () => {
    await registryAuthority.authorizeVerifiers([
      await verifierSigner.getAddress(),
    ]);
  };

  const publishAndVerifyVersion = async (
    domain: EnsDomain,
    majorNumber: number,
    minorNumber: number,
    patchNumber: number,
    packageLocation: string
  ) => {
    await packageOwner.publishVersion(
      domain,
      packageLocation,
      majorNumber,
      minorNumber,
      patchNumber
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
  });

  beforeEach(async () => {
    await up(`${__dirname}/../../..`);
    await deployments.fixture(["l1", "l2"]);

    const dependencyContainer = buildDependencyContainer(
      buildHelpersDependencyExtensions(
        {
          registryAuthoritySigner,
          verifierSigner,
          packageOwnerSigner,
        },
        {
          versionVerificationManagerL2: await (
            await ethers.getContract("VersionVerificationManagerL2")
          ).address,
          packageOwnershipManagerL1: await (
            await ethers.getContract("PackageOwnershipManagerL1")
          ).address,
          registrar: await (await ethers.getContract("PolywrapRegistrar"))
            .address,
          verificationTreeManager: await (
            await ethers.getContract("VerificationTreeManager")
          ).address,
          registryL1: await (await ethers.getContract("PolywrapRegistryL1"))
            .address,
          registryL2: await (await ethers.getContract("PolywrapRegistryL2"))
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
    packageOwner = dependencyContainer.cradle.packageOwner;
    registryAuthority = dependencyContainer.cradle.registryAuthority;
    ensApi = dependencyContainer.cradle.ensApi;
    ipfsClient = dependencyContainer.cradle.ipfsClient;
  });

  afterEach(async () => {
    await down(`${__dirname}/../../../`);
  });

  it("sanity", async () => {
    const domain = new EnsDomain("test");
    const l2ChainName = "l2-chain-name";
    const polywrapBuildPath = `${__dirname}/test-build`;
    const majorNumber = 1;
    const minorNumber = 0;
    const patchNumber = 0;
    const patchNodeId = packageOwner.calculatePatchNodeId(
      domain,
      majorNumber,
      minorNumber,
      patchNumber
    );

    await configureDomainForPolywrap(domain);

    const packageLocation = await publishToIPFS(polywrapBuildPath, ipfsClient);

    await packageOwner.updateOwnership(domain);
    await packageOwner.relayOwnership(domain, l2ChainName);

    await packageOwner.proposeVersion(
      domain,
      majorNumber,
      minorNumber,
      patchNumber,
      packageLocation
    );

    await authorizeCurrentVerifier();

    const [votingResult, _] = await Promise.all([
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
      domain,
      majorNumber,
      minorNumber,
      patchNumber,
      packageLocation
    );
  });
});
