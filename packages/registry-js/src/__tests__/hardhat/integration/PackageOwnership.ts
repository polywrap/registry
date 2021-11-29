import { expect } from "chai";
import { ethers } from "hardhat";
import { formatBytes32String } from "ethers/lib/utils";
import { deployments } from "hardhat";
import { PolywrapRegistry, RegistryContractAddresses } from "../../../v1";
import { EnsApi } from "./helpers/EnsApi";
import { Signer } from "ethers";
import { EnsDomain } from "../../../v1/types/EnsDomain";
import { buildPolywrapPackage } from "../../../v1/utils/buildPolywrapPackage";

describe("Package ownership", () => {
  let registry: PolywrapRegistry;

  let ens: EnsApi;

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
  const testDomain = new EnsDomain("test-domain");

  const connectRegistry = (signer: Signer): PolywrapRegistry => {
    return new PolywrapRegistry(signer, registryContractAddresses);
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

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = connectRegistry(domainOwner);

    let tx = await registry.claimOrganizationOwnership(
      testDomain.registry,
      testDomain.name,
      await organizationOwner.getAddress()
    );

    await tx.wait();

    registry = connectRegistry(organizationOwner);

    tx = await registry.setOrganizationController(
      testDomain.organizationId,
      await organizationController.getAddress()
    );

    await tx.wait();

    registry = connectRegistry(organizationController);
  });

  it("allows organization controller to set package owner", async () => {
    const testPackage = buildPolywrapPackage(testDomain, "test-package");
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();
    const packageControllerAddress = await packageController.getAddress();

    let tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage.packageName),
      packageOwnerAddress1,
      packageControllerAddress
    );

    await tx.wait();

    expect(await registry.packageOwner(testPackage.packageId)).to.equal(
      packageOwnerAddress1
    );

    tx = await registry.setPackageOwner(
      testPackage.packageId,
      packageOwnerAddress2
    );

    await tx.wait();

    expect(await registry.packageOwner(testPackage.packageId)).to.equal(
      packageOwnerAddress2
    );
  });

  it("forbids non organization controller from setting package owner", async () => {
    const testPackage = buildPolywrapPackage(testDomain, "test-package");
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();
    const packageControllerAddress = await packageController.getAddress();

    const tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage.packageName),
      packageOwnerAddress1,
      packageControllerAddress
    );

    await tx.wait();

    registry = connectRegistry(organizationOwner);

    let txPromise = registry.setPackageOwner(
      testPackage.packageId,
      packageOwnerAddress2
    );

    await expect(txPromise).to.reverted;

    registry = connectRegistry(packageOwner);

    txPromise = registry.setPackageOwner(
      testPackage.packageId,
      packageOwnerAddress2
    );

    await expect(txPromise).to.reverted;

    registry = connectRegistry(packageController);

    txPromise = registry.setPackageOwner(
      testPackage.packageId,
      packageOwnerAddress2
    );

    await expect(txPromise).to.reverted;

    registry = connectRegistry(randomAcc);

    txPromise = registry.setPackageOwner(
      testPackage.packageId,
      packageOwnerAddress2
    );

    await expect(txPromise).to.reverted;
  });

  it("allows package owner to transfer package ownership", async () => {
    const testPackage = buildPolywrapPackage(testDomain, "test-package");
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();
    const packageControllerAddress = await packageController.getAddress();

    let tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage.packageName),
      packageOwnerAddress1,
      packageControllerAddress
    );

    await tx.wait();

    expect(await registry.packageOwner(testPackage.packageId)).to.equal(
      packageOwnerAddress1
    );

    registry = connectRegistry(packageOwner);

    tx = await registry.transferPackageOwnership(
      testPackage.packageId,
      packageOwnerAddress2
    );

    await tx.wait();

    expect(await registry.packageOwner(testPackage.packageId)).to.equal(
      packageOwnerAddress2
    );
  });

  it("forbids non package owner from transferring package ownership", async () => {
    const testPackage = buildPolywrapPackage(testDomain, "test-package");
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();
    const packageControllerAddress = await packageController.getAddress();

    const tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage.packageName),
      packageOwnerAddress1,
      packageControllerAddress
    );

    await tx.wait();

    registry = connectRegistry(organizationOwner);

    let txPromise = registry.transferPackageOwnership(
      testPackage.packageId,
      packageOwnerAddress2
    );

    await expect(txPromise).to.reverted;

    registry = connectRegistry(organizationController);

    txPromise = registry.transferPackageOwnership(
      testPackage.packageId,
      packageOwnerAddress2
    );

    await expect(txPromise).to.reverted;

    registry = connectRegistry(packageController);

    txPromise = registry.transferPackageOwnership(
      testPackage.packageId,
      packageOwnerAddress2
    );

    await expect(txPromise).to.reverted;

    registry = connectRegistry(randomAcc);

    txPromise = registry.transferPackageOwnership(
      testPackage.packageId,
      packageOwnerAddress2
    );

    await expect(txPromise).to.reverted;
  });

  it("allows package owner to set package controller", async () => {
    const testPackage = buildPolywrapPackage(testDomain, "test-package");
    const packageOwnerAddress = await packageOwner.getAddress();
    const packageControllerAddress1 = await packageController.getAddress();
    const packageControllerAddress2 = await packageController2.getAddress();

    let tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage.packageName),
      packageOwnerAddress,
      packageControllerAddress1
    );

    await tx.wait();

    registry = connectRegistry(packageOwner);

    tx = await registry.setPackageController(
      testPackage.packageId,
      packageControllerAddress2
    );

    await tx.wait();

    expect(await registry.packageController(testPackage.packageId)).to.equal(
      packageControllerAddress2
    );
  });

  it("forbids non package owner from setting package controller", async () => {
    const testPackage = buildPolywrapPackage(testDomain, "test-package");
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageControllerAddress = await packageController.getAddress();
    const packageControllerAddress2 = await packageController2.getAddress();

    const tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage.packageName),
      packageOwnerAddress1,
      packageControllerAddress
    );

    await tx.wait();

    registry = connectRegistry(organizationOwner);

    let txPromise = registry.setPackageController(
      testPackage.packageId,
      packageControllerAddress2
    );

    await expect(txPromise).to.reverted;

    registry = connectRegistry(organizationController);

    txPromise = registry.setPackageController(
      testPackage.packageId,
      packageControllerAddress2
    );

    await expect(txPromise).to.reverted;

    registry = connectRegistry(packageController);

    txPromise = registry.setPackageController(
      testPackage.packageId,
      packageControllerAddress2
    );

    await expect(txPromise).to.reverted;

    registry = connectRegistry(randomAcc);

    txPromise = registry.setPackageController(
      testPackage.packageId,
      packageControllerAddress2
    );

    await expect(txPromise).to.reverted;
  });

  it("allows package controller to transfer package control", async () => {
    const testPackage = buildPolywrapPackage(testDomain, "test-package");
    const packageOwnerAddress = await packageOwner.getAddress();
    const packageControllerAddress = await packageController.getAddress();
    const packageControllerAddress2 = await packageController2.getAddress();

    let tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage.packageName),
      packageOwnerAddress,
      packageControllerAddress
    );

    await tx.wait();

    registry = connectRegistry(packageController);

    tx = await registry.transferPackageControl(
      testPackage.packageId,
      packageControllerAddress2
    );

    await tx.wait();

    expect(await registry.packageController(testPackage.packageId)).to.equal(
      packageControllerAddress2
    );
  });

  it("forbids non package controller from transferring package control", async () => {
    const testPackage = buildPolywrapPackage(testDomain, "test-package");
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageControllerAddress = await packageController.getAddress();
    const packageControllerAddress2 = await packageController2.getAddress();

    const tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage.packageName),
      packageOwnerAddress1,
      packageControllerAddress
    );

    await tx.wait();

    registry = connectRegistry(organizationOwner);

    let txPromise = registry.transferPackageControl(
      testPackage.packageId,
      packageControllerAddress2
    );

    await expect(txPromise).to.be.reverted;

    registry = connectRegistry(organizationController);

    txPromise = registry.transferPackageControl(
      testPackage.packageId,
      packageControllerAddress2
    );

    await expect(txPromise).to.reverted;

    registry = connectRegistry(packageOwner);

    txPromise = registry.transferPackageControl(
      testPackage.packageId,
      packageControllerAddress2
    );

    await expect(txPromise).to.reverted;

    registry = connectRegistry(randomAcc);

    txPromise = registry.transferPackageControl(
      testPackage.packageId,
      packageControllerAddress2
    );

    await expect(txPromise).to.reverted;
  });
});
