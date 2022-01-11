import { expect } from "chai";
import { ethers } from "hardhat";
import { BytesLike, formatBytes32String } from "ethers/lib/utils";
import { deployments } from "hardhat";
import { EnsApi } from "./helpers/EnsApi";
import { Signer } from "ethers";
import { PolywrapPackage } from "../helpers/PolywrapPackage";
import { buildPolywrapPackage } from "../helpers/buildPolywrapPackage";
import { EnsDomain } from "../helpers/EnsDomain";
import {
  PolywrapRegistry,
  RegistryContractAddresses,
} from "@polywrap/registry-js";
import {
  Api,
  deserializeWeb3ApiManifest,
  Uri,
  Web3ApiClient,
  Web3ApiClientConfig,
  Web3ApiManifest,
} from "@web3api/client-js";
import { JsonRpcProvider } from "@ethersproject/providers";
import { verifyPolywrapClientCanQueryPackage } from "../helpers/verifyPolywrapClientCanQueryPackage";

export class PolywrapClientCache extends Map<string, Api> {}

export class PolywrapClientConfigBuilder {
  private client: Web3ApiClient;

  constructor(client: Web3ApiClient) {
    this.client = client;
  }

  includeDefaultConfig(
    config?: Partial<Web3ApiClientConfig>
  ): PolywrapClientBuilder {
    this.client = new Web3ApiClient(config);
    return new PolywrapClientBuilder(this.client);
  }

  overrideConfig<T extends string | Uri>(
    config: Partial<Web3ApiClientConfig<T>>
  ): PolywrapClientBuilder {
    this.client = new Web3ApiClient();
    this.client["_config"] = config;

    return new PolywrapClientBuilder(this.client);
  }
}

export class PolywrapClientOverridesBuilder {
  private client: Web3ApiClient;

  constructor(client: Web3ApiClient) {
    this.client = client;
  }

  overrideInterface(
    uri: string,
    implementations: string[]
  ): PolywrapClientOverridesBuilder {
    const config = this.client["_config"];

    const interfaceImplementations = config.interfaces.find(
      (x: { interface: Uri }) =>
        x.interface.toString() === new Uri(uri).toString()
    );

    console.log(interfaceImplementations);
    interfaceImplementations.implementations = implementations.map((x) =>
      typeof x === "string" ? new Uri(x) : x
    );

    return this;
  }

  cache(cache: PolywrapClientCache): PolywrapClientOverridesBuilder {
    this.client["_apiCache"] = cache;
    return this;
  }

  buildOverrides(): PolywrapClientBuilder {
    return new PolywrapClientBuilder(this.client);
  }
}

export class PolywrapClientBuilder {
  private client: Web3ApiClient;

  constructor(client: Web3ApiClient) {
    this.client = client;
  }

  override(): PolywrapClientOverridesBuilder {
    return new PolywrapClientOverridesBuilder(this.client);
  }

  build(): Web3ApiClient {
    return this.client;
  }
}

export class PolywrapClient {
  static default(config?: Partial<Web3ApiClientConfig>): Web3ApiClient {
    return new Web3ApiClient(config);
  }

  static fromDefaultConfig(): Web3ApiClient {
    return new Web3ApiClient(config);
  }

  static fromCustomConfig(): PolywrapClientConfigBuilder {
    const client = new Web3ApiClient();

    return new PolywrapClientConfigBuilder(client);
  }
}

describe("Publishing versions", () => {
  let testPackage: PolywrapPackage;

  let registry: PolywrapRegistry;

  let ens: EnsApi;

  let owner: Signer;
  let domainOwner: Signer;
  let polywrapOwner: Signer;
  let organizationController: Signer;
  let packageController: Signer;

  let registryContractAddresses: RegistryContractAddresses;
  let provider: JsonRpcProvider;

  const testDomain = new EnsDomain("test-domain");

  const connectRegistry = (signer: Signer): PolywrapRegistry => {
    return new PolywrapRegistry(signer, registryContractAddresses);
  };

  const publishAndVerifyVersionPublished = async (
    packageId: BytesLike,
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
    expect(await registry.versionLocation(packageId, version)).to.equal(
      packageLocation
    );
    expect(
      await registry.latestPrereleaseLocation(packageId, version)
    ).to.equal(packageLocation);

    await verifyPolywrapClientCanQueryPackage(
      `ens/homestead/@${testDomain.name}/${testPackage.packageName}/${version}`,
      packageLocation
    );
  };

  before(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    domainOwner = signers[1];
    polywrapOwner = signers[2];
    organizationController = signers[3];
    packageController = signers[4];
  });

  beforeEach(async () => {
    const deploys = await deployments.fixture(["ens", "v1"]);
    registryContractAddresses = {
      polywrapRegistry: deploys["PolywrapRegistryV1"].address,
    };

    provider = (ethers.getDefaultProvider(
      "homestead"
    ) as unknown) as JsonRpcProvider;

    ens = new EnsApi(
      {
        ensRegistryL1: deploys["EnsRegistryL1"].address,
        testEthRegistrarL1: deploys["TestEthRegistrarL1"].address,
        testPublicResolverL1: deploys["TestPublicResolverL1"].address,
      },
      provider
    );

    testPackage = buildPolywrapPackage(testDomain, "test-package");

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = connectRegistry(domainOwner);

    let [error, tx] = await registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.name,
      await polywrapOwner.getAddress()
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = connectRegistry(polywrapOwner);

    [error, tx] = await registry.setOrganizationController(
      testDomain.organizationId,
      await organizationController.getAddress()
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = connectRegistry(organizationController);

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

    registry = connectRegistry(packageController);
  });
  /*
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
*/
  it("can publish production prerelease versions", async () => {
    await publishAndVerifyVersionPublished(
      testPackage.packageId,
      "1.0.0-alpha",
      "QmbGiVuJY9GDjNUc5C36aPLgezovqJsbYxj4K3AR83Xoqc"
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
  /*
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
  });*/
});
