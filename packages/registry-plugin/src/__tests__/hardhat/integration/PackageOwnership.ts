import { expect } from "chai";
import { ethers } from "hardhat";
import { deployments } from "hardhat";
import { Signer } from "ethers";
import { EnsApiV1 } from "@polywrap/registry-test-utils";
import { RegistryContractAddresses } from "../../helpers/RegistryContractAddresses";
import { PolywrapRegistry } from "../../helpers/PolywrapRegistry";
import { JsonRpcProvider } from "@ethersproject/providers";

describe("Package ownership", () => {
  let ens: EnsApiV1;

  let owner: Signer;
  let domainOwner: Signer;
  let organizationOwner: Signer;
  let organizationController: Signer;
  let packageOwner: Signer;
  let packageOwner2: Signer;
  let packageController: Signer;
  let packageController2: Signer;
  let randomAcc: Signer;

  let registry: PolywrapRegistry;
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
    organizationController = signers[4];
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

    ens = new EnsApiV1(
      {
        ensRegistryL1: deploys["EnsRegistryL1"].address,
        testEthRegistrarL1: deploys["TestEthRegistrarL1"].address,
        testPublicResolverL1: deploys["TestPublicResolverL1"].address,
      },
      ethers.getDefaultProvider()
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

  it("allows organization controller to set package owner", async () => {
    const organizationId = await registry.calculateOrganizationId(
      domainRegistry,
      testDomain
    );

    const testPackage = await registry.calculatePackageInfo(
      domainRegistry,
      testDomain,
      "test-package"
    );
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();
    const packageControllerAddress = await packageController.getAddress();

    let [error, tx] = await registry.registerPackage(
      organizationId,
      testPackage.packageName,
      packageOwnerAddress1,
      packageControllerAddress
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    expect(await registry.packageOwner(testPackage.packageId)).to.equal(
      packageOwnerAddress1
    );

    [error, tx] = await registry.setPackageOwner(
      testPackage.packageId,
      packageOwnerAddress2
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    expect(await registry.packageOwner(testPackage.packageId)).to.equal(
      packageOwnerAddress2
    );
  });

  it("forbids non organization controller from setting package owner", async () => {
    const organizationId = await registry.calculateOrganizationId(
      domainRegistry,
      testDomain
    );

    const testPackage = await registry.calculatePackageInfo(
      domainRegistry,
      testDomain,
      "test-package"
    );
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();
    const packageControllerAddress = await packageController.getAddress();

    let [error, tx] = await registry.registerPackage(
      organizationId,
      testPackage.packageName,
      packageOwnerAddress1,
      packageControllerAddress
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = await connectRegistry(organizationOwner);

    [error, tx] = await registry.setPackageOwner(
      testPackage.packageId,
      packageOwnerAddress2
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;

    registry = await connectRegistry(packageOwner);

    [error, tx] = await registry.setPackageOwner(
      testPackage.packageId,
      packageOwnerAddress2
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;

    registry = await connectRegistry(packageController);

    [error, tx] = await registry.setPackageOwner(
      testPackage.packageId,
      packageOwnerAddress2
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;

    registry = await connectRegistry(randomAcc);

    [error, tx] = await registry.setPackageOwner(
      testPackage.packageId,
      packageOwnerAddress2
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;
  });

  it("allows package owner to transfer package ownership", async () => {
    const organizationId = await registry.calculateOrganizationId(
      domainRegistry,
      testDomain
    );

    const testPackage = await registry.calculatePackageInfo(
      domainRegistry,
      testDomain,
      "test-package"
    );
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();
    const packageControllerAddress = await packageController.getAddress();

    let [error, tx] = await registry.registerPackage(
      organizationId,
      testPackage.packageName,
      packageOwnerAddress1,
      packageControllerAddress
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    expect(await registry.packageOwner(testPackage.packageId)).to.equal(
      packageOwnerAddress1
    );

    registry = await connectRegistry(packageOwner);

    [error, tx] = await registry.transferPackageOwnership(
      testPackage.packageId,
      packageOwnerAddress2
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    expect(await registry.packageOwner(testPackage.packageId)).to.equal(
      packageOwnerAddress2
    );
  });

  it("forbids non package owner from transferring package ownership", async () => {
    const organizationId = await registry.calculateOrganizationId(
      domainRegistry,
      testDomain
    );

    const testPackage = await registry.calculatePackageInfo(
      domainRegistry,
      testDomain,
      "test-package"
    );
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();
    const packageControllerAddress = await packageController.getAddress();

    let [error, tx] = await registry.registerPackage(
      organizationId,
      testPackage.packageName,
      packageOwnerAddress1,
      packageControllerAddress
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = await connectRegistry(organizationOwner);

    [error, tx] = await registry.transferPackageOwnership(
      testPackage.packageId,
      packageOwnerAddress2
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;

    registry = await connectRegistry(organizationController);

    [error, tx] = await registry.transferPackageOwnership(
      testPackage.packageId,
      packageOwnerAddress2
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;

    registry = await connectRegistry(packageController);

    [error, tx] = await registry.transferPackageOwnership(
      testPackage.packageId,
      packageOwnerAddress2
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;

    registry = await connectRegistry(randomAcc);

    [error, tx] = await registry.transferPackageOwnership(
      testPackage.packageId,
      packageOwnerAddress2
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;
  });

  it("allows package owner to set package controller", async () => {
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
    const packageControllerAddress1 = await packageController.getAddress();
    const packageControllerAddress2 = await packageController2.getAddress();

    let [error, tx] = await registry.registerPackage(
      organizationId,
      testPackage.packageName,
      packageOwnerAddress,
      packageControllerAddress1
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = await connectRegistry(packageOwner);

    [error, tx] = await registry.setPackageController(
      testPackage.packageId,
      packageControllerAddress2
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    expect(await registry.packageController(testPackage.packageId)).to.equal(
      packageControllerAddress2
    );
  });

  it("forbids non package owner from setting package controller", async () => {
    const organizationId = await registry.calculateOrganizationId(
      domainRegistry,
      testDomain
    );

    const testPackage = await registry.calculatePackageInfo(
      domainRegistry,
      testDomain,
      "test-package"
    );
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageControllerAddress = await packageController.getAddress();
    const packageControllerAddress2 = await packageController2.getAddress();

    let [error, tx] = await registry.registerPackage(
      organizationId,
      testPackage.packageName,
      packageOwnerAddress1,
      packageControllerAddress
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = await connectRegistry(organizationOwner);

    [error, tx] = await registry.setPackageController(
      testPackage.packageId,
      packageControllerAddress2
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;

    registry = await connectRegistry(organizationController);

    [error, tx] = await registry.setPackageController(
      testPackage.packageId,
      packageControllerAddress2
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;

    registry = await connectRegistry(packageController);

    [error, tx] = await registry.setPackageController(
      testPackage.packageId,
      packageControllerAddress2
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;

    registry = await connectRegistry(randomAcc);

    [error, tx] = await registry.setPackageController(
      testPackage.packageId,
      packageControllerAddress2
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;
  });

  it("allows package controller to transfer package control", async () => {
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
    const packageControllerAddress2 = await packageController2.getAddress();

    let [error, tx] = await registry.registerPackage(
      organizationId,
      testPackage.packageName,
      packageOwnerAddress,
      packageControllerAddress
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = await connectRegistry(packageController);

    [error, tx] = await registry.transferPackageControl(
      testPackage.packageId,
      packageControllerAddress2
    );

    if (!tx) {
      throw error;
    }

    await tx.wait();

    expect(await registry.packageController(testPackage.packageId)).to.equal(
      packageControllerAddress2
    );
  });

  it("forbids non package controller from transferring package control", async () => {
    const organizationId = await registry.calculateOrganizationId(
      domainRegistry,
      testDomain
    );

    const testPackage = await registry.calculatePackageInfo(
      domainRegistry,
      testDomain,
      "test-package"
    );
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageControllerAddress = await packageController.getAddress();
    const packageControllerAddress2 = await packageController2.getAddress();

    let [error, tx] = await registry.registerPackage(
      organizationId,
      testPackage.packageName,
      packageOwnerAddress1,
      packageControllerAddress
    );

    if (!tx) {
      throw error;
    }

    if (!tx) {
      throw error;
    }

    await tx.wait();

    registry = await connectRegistry(organizationOwner);

    [error, tx] = await registry.transferPackageControl(
      testPackage.packageId,
      packageControllerAddress2
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;

    registry = await connectRegistry(organizationController);

    [error, tx] = await registry.transferPackageControl(
      testPackage.packageId,
      packageControllerAddress2
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;

    registry = await connectRegistry(packageOwner);

    [error, tx] = await registry.transferPackageControl(
      testPackage.packageId,
      packageControllerAddress2
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;

    registry = await connectRegistry(randomAcc);

    [error, tx] = await registry.transferPackageControl(
      testPackage.packageId,
      packageControllerAddress2
    );

    expect(tx).to.be.undefined;
    expect(error).to.not.be.undefined;
  });
});
