import { expect } from "chai";
import { ethers } from "hardhat";
import { deployments } from "hardhat";
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

  const testDomain = "test-domain.eth";
  const domainRegistry = "ens";

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

    registry = await connectRegistry(domainOwner);

    const organizationId = await registry.calculateOrganizationId(
      domainRegistry,
      testDomain
    );

    await ens.registerDomainName(owner, domainOwner, testDomain);

    let [error, tx] = await registry.claimOrganizationOwnership(
      domainRegistry,
      testDomain,
      await organizationOwner.getAddress()
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = await connectRegistry(organizationOwner);

    [error, tx] = await registry.setOrganizationController(
      organizationId,
      await organizationController.getAddress()
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = await connectRegistry(organizationController);
  });

  it("can register package", async () => {
    const organizationId = await registry.calculateOrganizationId(
      domainRegistry,
      testDomain
    );

    const testPackage = await registry.calculatePackageInfo(
      domainRegistry,
      testDomain,
      "test-package"
    );
    const packageOwnerAddress = await packageOwner.getAddress();
    const packageControllerAddress = await packageController.getAddress();

    registry = await connectRegistry(organizationController);

    const [error, tx] = await registry.registerPackage(
      organizationId,
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
    const organizationId = await registry.calculateOrganizationId(
      domainRegistry,
      testDomain
    );

    const testPackage1 = await registry.calculatePackageInfo(
      domainRegistry,
      testDomain,
      "test-package1"
    );
    const testPackage2 = await registry.calculatePackageInfo(
      domainRegistry,
      testDomain,
      "test-package2"
    );
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();
    const packageControllerAddress1 = await packageController.getAddress();
    const packageControllerAddress2 = await packageController2.getAddress();

    registry = await connectRegistry(organizationController);

    let [error, tx] = await registry.registerPackage(
      organizationId,
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
      organizationId,
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
    const organizationId = await registry.calculateOrganizationId(
      domainRegistry,
      testDomain
    );

    const testDomain2 = "test-domain2.eth";

    const organizationId2 = await registry.calculateOrganizationId(
      domainRegistry,
      testDomain2
    );

    const testPackage1 = await registry.calculatePackageInfo(
      domainRegistry,
      testDomain,
      "test-package"
    );
    const testPackage2 = await registry.calculatePackageInfo(
      domainRegistry,
      testDomain2,
      "test-package"
    );

    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();
    const packageControllerAddress1 = await packageController.getAddress();
    const packageControllerAddress2 = await packageController2.getAddress();

    await ens.registerDomainName(owner, domainOwner, testDomain2);

    registry = await connectRegistry(domainOwner);

    let [error, tx] = await registry.claimOrganizationOwnership(
      domainRegistry,
      testDomain2,
      await organizationOwner2.getAddress()
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = await connectRegistry(organizationOwner2);

    [error, tx] = await registry.setOrganizationController(
      organizationId2,
      await organizationController2.getAddress()
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = await connectRegistry(organizationController);

    [error, tx] = await registry.registerPackage(
      organizationId,
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
      organizationId2,
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
    const organizationId = await registry.calculateOrganizationId(
      domainRegistry,
      testDomain
    );

    const testPackage1 = await registry.calculatePackageInfo(
      domainRegistry,
      testDomain,
      "test-package"
    );
    const testPackage2 = await registry.calculatePackageInfo(
      domainRegistry,
      testDomain,
      "test-package"
    );
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();
    const packageControllerAddress1 = await packageController.getAddress();
    const packageControllerAddress2 = await packageController2.getAddress();

    registry = await connectRegistry(organizationController);

    let [error, tx] = await registry.registerPackage(
      organizationId,
      testPackage1.packageName,
      packageOwnerAddress1,
      packageControllerAddress1
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    [error, tx] = await registry.registerPackage(
      organizationId,
      testPackage2.packageName,
      packageOwnerAddress2,
      packageControllerAddress2
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;
  });

  it("forbids non organization controller from registering packages", async () => {
    const organizationId = await registry.calculateOrganizationId(
      domainRegistry,
      testDomain
    );

    const testPackage = await registry.calculatePackageInfo(
      domainRegistry,
      testDomain,
      "test-package"
    );
    const packageOwnerAddress = await packageOwner.getAddress();
    const packageControllerAddress = await packageController.getAddress();

    registry = await connectRegistry(organizationOwner);

    let [error, tx] = await registry.registerPackage(
      organizationId,
      testPackage.packageName,
      packageOwnerAddress,
      packageControllerAddress
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;

    registry = await connectRegistry(randomAcc);

    [error, tx] = await registry.registerPackage(
      organizationId,
      testPackage.packageName,
      packageOwnerAddress,
      packageControllerAddress
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;
  });
});
