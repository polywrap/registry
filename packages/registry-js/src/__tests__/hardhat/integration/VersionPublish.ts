import { expect } from "chai";
import { ethers } from "hardhat";
import { formatBytes32String } from "ethers/lib/utils";
import { deployments } from "hardhat";
import { PolywrapRegistry, RegistryContractAddresses } from "../../../v1";
import { EnsApi } from "./helpers/EnsApi";
import { Signer } from "ethers";
import { EnsDomain } from "../../../v1/types/EnsDomain";
import { buildPolywrapPackage } from "../../../v1/buildPolywrapPackage";
import { PolywrapPackage } from "../../../v1/types/PolywrapPackage";

describe("Publishing versions", () => {
  let testPackage: PolywrapPackage;

  let registry: PolywrapRegistry;

  let ens: EnsApi;

  let owner: Signer;
  let domainOwner: Signer;
  let polywrapOwner: Signer;
  let organizationController: Signer;
  let packageController: Signer;
  let randomAcc: Signer;

  let registryContractAddresses: RegistryContractAddresses;

  const connectRegistry = (signer: Signer): PolywrapRegistry => {
    return new PolywrapRegistry(signer, registryContractAddresses);
  };

  before(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    domainOwner = signers[1];
    polywrapOwner = signers[2];
    organizationController = signers[3];
    packageController = signers[4];
    randomAcc = signers[5];
  });

  beforeEach(async () => {
    const deploys = await deployments.fixture(["ens", "v1"]);
    registryContractAddresses = {
      polywrapRegistry: deploys["PolywrapRegistryV1"].address,
    };

    const provider = ethers.getDefaultProvider();

    ens = new EnsApi(
      {
        ensRegistryL1: deploys["EnsRegistryL1"].address,
        testEthRegistrarL1: deploys["TestEthRegistrarL1"].address,
        testPublicResolverL1: deploys["TestPublicResolverL1"].address,
      },
      provider
    );

    const testDomain = new EnsDomain("test-domain");
    testPackage = buildPolywrapPackage(testDomain, "test-package");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = connectRegistry(domainOwner);

    let tx = await registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.name,
      await polywrapOwner.getAddress()
    );

    await tx.wait();

    registry = connectRegistry(polywrapOwner);

    tx = await registry.setOrganizationController(
      testDomain.organizationId,
      await organizationController.getAddress()
    );

    await tx.wait();

    registry = connectRegistry(organizationController);

    tx = await registry.registerPackage(
      testPackage.organizationId,
      formatBytes32String(testPackage.packageName),
      await polywrapOwner.getAddress(),
      await packageController.getAddress()
    );

    await tx.wait();

    registry = connectRegistry(packageController);
  });

  it("can publish a development version", async () => {
    const packageLocation = "ss";

    const tx = await registry.publishVersion(
      testPackage.packageId,
      "0.1.0",
      packageLocation
    );

    await tx.wait();

    const versionNode = await registry.version(testPackage.packageId, "0.1.0");
    expect(versionNode.exists).to.be.true;
    expect(versionNode.leaf).to.be.true;
    expect(versionNode.location).to.equal(packageLocation);
  });

  it("can publish production release versions", async () => {
    const packageLocation = "Qmexhq2sBHnXQbvyP2GfUdbnY7HCagH2Mw5vUNSBn2nxip";

    const tx = await registry.publishVersion(
      testPackage.packageId,
      "1.0.0",
      packageLocation
    );

    await tx.wait();

    const versionNode = await registry.version(testPackage.packageId, "1.0.0");
    expect(versionNode.leaf).to.be.true;
    expect(versionNode.exists).to.be.true;
    expect(versionNode.location).to.equal(packageLocation);
  });

  it("can publish development release versions", async () => {
    const packageLocation = "Qmexhq2sBHnXQbvyP2GfUdbnY7HCagH2Mw5vUNSBn2nxip";

    const tx = await registry.publishVersion(
      testPackage.packageId,
      "0.0.1",
      packageLocation
    );

    await tx.wait();

    const versionNode = await registry.version(testPackage.packageId, "0.0.1");
    expect(versionNode.leaf).to.be.true;
    expect(versionNode.exists).to.be.true;
    expect(versionNode.location).to.equal(packageLocation);
  });

  it("can publish production prerelease versions", async () => {
    const packageLocation = "Qmexhq2sBHnXQbvyP2GfUdbnY7HCagH2Mw5vUNSBn2nxip";

    const tx = await registry.publishVersion(
      testPackage.packageId,
      "1.0.0-alpha",
      packageLocation
    );

    await tx.wait();

    const versionNode = await registry.version(
      testPackage.packageId,
      "1.0.0-alpha"
    );
    expect(versionNode.leaf).to.be.true;
    expect(versionNode.exists).to.be.true;
    expect(versionNode.location).to.equal(packageLocation);
  });

  it("can publish development prerelease versions", async () => {
    const packageLocation = "Qmexhq2sBHnXQbvyP2GfUdbnY7HCagH2Mw5vUNSBn2nxip";

    const tx = await registry.publishVersion(
      testPackage.packageId,
      "0.0.1-alpha",
      packageLocation
    );

    await tx.wait();

    const versionNode = await registry.version(
      testPackage.packageId,
      "0.0.1-alpha"
    );
    expect(versionNode.leaf).to.be.true;
    expect(versionNode.exists).to.be.true;
    expect(versionNode.location).to.equal(packageLocation);
  });

  it("can publish version with build metadata", async () => {
    const buildMetadata = "test-metadata";
    const packageLocation = "Qmexhq2sBHnXQbvyP2GfUdbnY7HCagH2Mw5vUNSBn2nxip";

    const tx = await registry.publishVersion(
      testPackage.packageId,
      `1.0.0+${buildMetadata}`,
      packageLocation
    );

    await tx.wait();

    const versionNode = await registry.version(testPackage.packageId, "1.0.0");
    expect(versionNode.leaf).to.be.true;
    expect(versionNode.exists).to.be.true;
    expect(versionNode.location).to.equal(packageLocation);
    expect(versionNode.buildMetadata).to.equal(
      formatBytes32String(buildMetadata)
    );
  });
});
