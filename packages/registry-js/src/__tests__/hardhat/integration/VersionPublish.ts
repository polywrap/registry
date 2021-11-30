import { expect } from "chai";
import { ethers } from "hardhat";
import { BytesLike, formatBytes32String } from "ethers/lib/utils";
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

  const publishAndVerifyVersionPublished = async (
    packageId: BytesLike,
    version: string,
    packageLocation: string
  ): Promise<void> => {
    const tx = await registry.publishVersion(
      packageId,
      version,
      packageLocation
    );

    await tx.wait();

    const versionNode = await registry.version(packageId, version);
    expect(versionNode.exists).to.be.true;
    expect(versionNode.leaf).to.be.true;
    expect(versionNode.location).to.equal(packageLocation);

    expect(await registry.versionExists(packageId, version)).to.be.true;
    expect(await registry.versionLocation(packageId, version)).to.equal(
      packageLocation
    );

    const nodeMetadata = await registry.versionMetadata(packageId, version);
    expect(nodeMetadata.exists).to.be.true;
    expect(nodeMetadata.leaf).to.be.true;
    expect(nodeMetadata.latestPrereleaseVersion).to.equal(0);
    expect(nodeMetadata.latestReleaseVersion).to.equal(0);
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

  it("can publish development release versions", async () => {
    await publishAndVerifyVersionPublished(
      testPackage.packageId,
      "0.0.1",
      "Qmexhq2sBHnXQbvyP2GfUdbnY7HCagH2Mw5vUNSBn2nxip"
    );

    await publishAndVerifyVersionPublished(
      testPackage.packageId,
      "0.1.0",
      "Qmexhq2sBHnXQbvyP2GfUdbnY7HCagH2Mw5vUNSBn2nxip"
    );
  });

  it("can publish production release versions", async () => {
    await publishAndVerifyVersionPublished(
      testPackage.packageId,
      "1.0.0",
      "Qmexhq2sBHnXQbvyP2GfUdbnY7HCagH2Mw5vUNSBn2nxip"
    );

    await publishAndVerifyVersionPublished(
      testPackage.packageId,
      "1.0.1",
      "Qmexhq2sBHnXQbvyP2GfUdbnY7HCagH2Mw5vUNSBn2nxip"
    );

    await publishAndVerifyVersionPublished(
      testPackage.packageId,
      "1.1.0",
      "Qmexhq2sBHnXQbvyP2GfUdbnY7HCagH2Mw5vUNSBn2nxip"
    );

    await publishAndVerifyVersionPublished(
      testPackage.packageId,
      "2.0.0",
      "Qmexhq2sBHnXQbvyP2GfUdbnY7HCagH2Mw5vUNSBn2nxip"
    );
  });

  it("can publish development prerelease versions", async () => {
    await publishAndVerifyVersionPublished(
      testPackage.packageId,
      "0.0.1-alpha",
      "Qmexhq2sBHnXQbvyP2GfUdbnY7HCagH2Mw5vUNSBn2nxip"
    );

    await publishAndVerifyVersionPublished(
      testPackage.packageId,
      "0.1.0-alpha.1.2.3",
      "Qmexhq2sBHnXQbvyP2GfUdbnY7HCagH2Mw5vUNSBn2nxip"
    );
  });

  it("can publish production prerelease versions", async () => {
    await publishAndVerifyVersionPublished(
      testPackage.packageId,
      "1.0.0-alpha",
      "Qmexhq2sBHnXQbvyP2GfUdbnY7HCagH2Mw5vUNSBn2nxip"
    );

    await publishAndVerifyVersionPublished(
      testPackage.packageId,
      "1.0.0-alpha.1",
      "Qmexhq2sBHnXQbvyP2GfUdbnY7HCagH2Mw5vUNSBn2nxip"
    );

    await publishAndVerifyVersionPublished(
      testPackage.packageId,
      "1.0.0-beta-test.1.0.0",
      "Qmexhq2sBHnXQbvyP2GfUdbnY7HCagH2Mw5vUNSBn2nxip"
    );
  });

  it("can publish version with build metadata", async () => {
    const buildMetadata = "test-metadata";
    const packageLocation = "Qmexhq2sBHnXQbvyP2GfUdbnY7HCagH2Mw5vUNSBn2nxip";
    const version = "1.0.0";

    const tx = await registry.publishVersion(
      testPackage.packageId,
      `${version}+${buildMetadata}`,
      packageLocation
    );

    await tx.wait();

    const versionNode = await registry.version(testPackage.packageId, version);
    expect(versionNode.leaf).to.be.true;
    expect(versionNode.exists).to.be.true;
    expect(versionNode.location).to.equal(packageLocation);
    expect(versionNode.buildMetadata).to.equal(
      formatBytes32String(buildMetadata)
    );

    expect(
      await registry.versionBuildMetadata(testPackage.packageId, version)
    ).to.equal(formatBytes32String(buildMetadata));
  });
});