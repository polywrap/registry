import { expect } from "chai";
import { ethers } from "hardhat";
import { formatBytes32String } from "ethers/lib/utils";
import { deployments } from "hardhat";
import { Signer } from "ethers";
import { EnsDomainV1 } from "@polywrap/registry-core-js";
import { EnsApiV1 } from "@polywrap/registry-test-utils";
import { JsonRpcProvider } from "@ethersproject/providers";
import { RegistryContractAddresses } from "../../helpers/RegistryContractAddresses";
import { PolywrapRegistry } from "../../helpers/PolywrapRegistry";
import { PackageInfo } from "../../../w3";

describe("Publishing versions", () => {
  let testPackage: PackageInfo;

  let ens: EnsApiV1;

  let owner: Signer;
  let domainOwner: Signer;
  let polywrapOwner: Signer;
  let organizationController: Signer;
  let packageController: Signer;

  let registry: PolywrapRegistry;
  let registryContractAddresses: RegistryContractAddresses;

  const connectRegistry = async (signer: Signer): Promise<PolywrapRegistry> => {
    return registry.connect(
      signer.provider as JsonRpcProvider,
      await signer.getAddress(),
      registryContractAddresses
    );
  };

  const publishAndVerifyVersionPublished = async (
    packageId: string,
    version: string,
    packageLocation: string
  ): Promise<void> => {
    const [error, tx] = await registry.publishVersion(
      packageId,
      version,
      packageLocation
    );

    if (!tx) {
      throw error;
    }

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
    expect(nodeMetadata.latestPrereleaseVersion).to.equal("0");
    expect(nodeMetadata.latestReleaseVersion).to.equal("0");
  };

  before(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    domainOwner = signers[1];
    polywrapOwner = signers[2];
    organizationController = signers[3];
    packageController = signers[4];

    registry = new PolywrapRegistry();
  });

  beforeEach(async () => {
    const deploys = await deployments.fixture(["ens", "v1"]);
    registryContractAddresses = {
      polywrapRegistry: deploys["PolywrapRegistryV1"].address,
    };

    const provider = ethers.getDefaultProvider();

    ens = new EnsApiV1(
      {
        ensRegistryL1: deploys["EnsRegistryL1"].address,
        testEthRegistrarL1: deploys["TestEthRegistrarL1"].address,
        testPublicResolverL1: deploys["TestPublicResolverL1"].address,
      },
      provider
    );

    registry = await connectRegistry(owner);

    const testDomain = new EnsDomainV1("test-domain");
    testPackage = await registry.calculatePackageInfo(
      EnsDomainV1.Registry,
      testDomain.name,
      "test-package"
    );

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = await connectRegistry(domainOwner);

    let [error, tx] = await registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.name,
      await polywrapOwner.getAddress()
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = await connectRegistry(polywrapOwner);

    [error, tx] = await registry.setOrganizationController(
      testDomain.organizationId,
      await organizationController.getAddress()
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = await connectRegistry(organizationController);

    [error, tx] = await registry.registerPackage(
      testPackage.organizationId,
      testPackage.packageName,
      await polywrapOwner.getAddress(),
      await packageController.getAddress()
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = await connectRegistry(packageController);
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

    const [error, tx] = await registry.publishVersion(
      testPackage.packageId,
      `${version}+${buildMetadata}`,
      packageLocation
    );

    if (!tx) {
      throw error;
    }

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
