import { expect } from "chai";
import { ethers } from "hardhat";
import { deployments } from "hardhat";
import { EnsDomainV1 } from "@polywrap/registry-core-js";
import { EnsApiV1 } from "@polywrap/registry-test-utils";
import { Signer } from "ethers";
import { PolywrapRegistry } from "../../helpers/PolywrapRegistry";
import { RegistryContractAddresses } from "../../helpers/RegistryContractAddresses";
import { JsonRpcProvider } from "@ethersproject/providers";

describe("Registering packages", () => {
  let registry: PolywrapRegistry;

  let ens: EnsApiV1;

  let owner: Signer;
  let domainOwner: Signer;
  let organizationOwner: Signer;
  let organizationOwner2: Signer;
  let organizationController: Signer;
  let organizationController2: Signer;
  let packageOwner: Signer;
  let packageOwner2: Signer;
  let packageController: Signer;
  let packageController2: Signer;
  let randomAcc: Signer;

  let registryContractAddresses: RegistryContractAddresses;

  const testDomain = new EnsDomainV1("test-domain");

  const connectRegistry = async (signer: Signer): Promise<PolywrapRegistry> => {
    return registry.connect(
      signer.provider as JsonRpcProvider,
      await signer.getAddress(),
      registryContractAddresses
    );
  };

  before(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    domainOwner = signers[1];
    organizationOwner = signers[2];
    organizationOwner2 = signers[3];
    organizationController = signers[4];
    organizationController2 = signers[5];
    packageOwner = signers[6];
    packageOwner2 = signers[7];
    packageController = signers[8];
    packageController2 = signers[9];
    randomAcc = signers[10];

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

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = await connectRegistry(domainOwner);

    let [error, tx] = await registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.name,
      await organizationOwner.getAddress()
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = await connectRegistry(organizationOwner);

    [error, tx] = await registry.setOrganizationController(
      testDomain.organizationId,
      await organizationController.getAddress()
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = await connectRegistry(organizationController);
  });

  it("can register package", async () => {
    const testPackage = await registry.calculatePackageInfo(
      EnsDomainV1.Registry,
      testDomain.name,
      "test-package"
    );
    const packageOwnerAddress = await packageOwner.getAddress();
    const packageControllerAddress = await packageController.getAddress();

    registry = await connectRegistry(organizationController);

    const [error, tx] = await registry.registerPackage(
      testDomain.organizationId,
      testPackage.packageName,
      packageOwnerAddress,
      packageControllerAddress
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    const packageInfo = await registry.getPackage(testPackage.packageId);
    expect(packageInfo.exists).to.be.true;
    expect(packageInfo.owner).to.equal(packageOwnerAddress);
    expect(packageInfo.controller).to.equal(packageControllerAddress);

    expect(await registry.packageExists(testPackage.packageId)).to.equal(true);
    expect(await registry.packageOwner(testPackage.packageId)).to.equal(
      packageOwnerAddress
    );
    expect(await registry.packageController(testPackage.packageId)).to.equal(
      packageControllerAddress
    );
    expect(
      await registry.packageOrganizationId(testPackage.packageId)
    ).to.equal(testPackage.organizationId);
  });

  it("can register multiple packages for same organization", async () => {
    const testPackage1 = await registry.calculatePackageInfo(
      EnsDomainV1.Registry,
      testDomain.name,
      "test-package1"
    );
    const testPackage2 = await registry.calculatePackageInfo(
      EnsDomainV1.Registry,
      testDomain.name,
      "test-package2"
    );
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();
    const packageControllerAddress1 = await packageController.getAddress();
    const packageControllerAddress2 = await packageController2.getAddress();

    registry = await connectRegistry(organizationController);

    let [error, tx] = await registry.registerPackage(
      testDomain.organizationId,
      testPackage1.packageName,
      packageOwnerAddress1,
      packageControllerAddress1
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    expect(await registry.packageExists(testPackage1.packageId)).to.equal(true);

    expect(await registry.packageOwner(testPackage1.packageId)).to.equal(
      packageOwnerAddress1
    );

    [error, tx] = await registry.registerPackage(
      testDomain.organizationId,
      testPackage2.packageName,
      packageOwnerAddress2,
      packageControllerAddress2
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    expect(await registry.packageExists(testPackage2.packageId)).to.equal(true);

    expect(await registry.packageOwner(testPackage2.packageId)).to.equal(
      packageOwnerAddress2
    );
  });

  it("can register packages for multiple organizations", async () => {
    const testDomain2 = new EnsDomainV1("test-domain2");
    const testPackage1 = await registry.calculatePackageInfo(
      EnsDomainV1.Registry,
      testDomain.name,
      "test-package"
    );
    const testPackage2 = await registry.calculatePackageInfo(
      EnsDomainV1.Registry,
      testDomain2.name,
      "test-package"
    );
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();
    const packageControllerAddress1 = await packageController.getAddress();
    const packageControllerAddress2 = await packageController2.getAddress();

    await ens.registerDomainName(owner, domainOwner, testDomain2);

    registry = await connectRegistry(domainOwner);

    let [error, tx] = await registry.claimOrganizationOwnership(
      testDomain2.registry,
      testDomain2.name,
      await organizationOwner2.getAddress()
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = await connectRegistry(organizationOwner2);

    [error, tx] = await registry.setOrganizationController(
      testDomain2.organizationId,
      await organizationController2.getAddress()
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = await connectRegistry(organizationController);

    [error, tx] = await registry.registerPackage(
      testDomain.organizationId,
      testPackage1.packageName,
      packageOwnerAddress1,
      packageControllerAddress1
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    expect(await registry.packageExists(testPackage1.packageId)).to.equal(true);

    expect(await registry.packageOwner(testPackage1.packageId)).to.equal(
      packageOwnerAddress1
    );

    registry = await connectRegistry(organizationController2);

    [error, tx] = await registry.registerPackage(
      testDomain2.organizationId,
      testPackage2.packageName,
      packageOwnerAddress2,
      packageControllerAddress2
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    expect(await registry.packageExists(testPackage2.packageId)).to.equal(true);

    expect(await registry.packageOwner(testPackage2.packageId)).to.equal(
      packageOwnerAddress2
    );
  });

  it("forbids registering multiple packages with the same name for the same organization", async () => {
    const testPackage1 = await registry.calculatePackageInfo(
      EnsDomainV1.Registry,
      testDomain.name,
      "test-package"
    );
    const testPackage2 = await registry.calculatePackageInfo(
      EnsDomainV1.Registry,
      testDomain.name,
      "test-package"
    );
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();
    const packageControllerAddress1 = await packageController.getAddress();
    const packageControllerAddress2 = await packageController2.getAddress();

    registry = await connectRegistry(organizationController);

    let [error, tx] = await registry.registerPackage(
      testDomain.organizationId,
      testPackage1.packageName,
      packageOwnerAddress1,
      packageControllerAddress1
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    [error, tx] = await registry.registerPackage(
      testDomain.organizationId,
      testPackage2.packageName,
      packageOwnerAddress2,
      packageControllerAddress2
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;
  });

  it("forbids non organization controller from registering packages", async () => {
    const testPackage = await registry.calculatePackageInfo(
      EnsDomainV1.Registry,
      testDomain.name,
      "test-package"
    );
    const packageOwnerAddress = await packageOwner.getAddress();
    const packageControllerAddress = await packageController.getAddress();

    registry = await connectRegistry(organizationOwner);

    let [error, tx] = await registry.registerPackage(
      testDomain.organizationId,
      testPackage.packageName,
      packageOwnerAddress,
      packageControllerAddress
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;

    registry = await connectRegistry(randomAcc);

    [error, tx] = await registry.registerPackage(
      testDomain.organizationId,
      testPackage.packageName,
      packageOwnerAddress,
      packageControllerAddress
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;
  });
});
