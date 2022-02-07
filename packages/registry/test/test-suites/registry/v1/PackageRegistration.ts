import { ethers, deployments } from "hardhat";
import { expect } from "chai";
import {
  PolywrapRegistryV1,
  PolywrapRegistryV1__factory,
} from "../../../../typechain-types";
import { formatBytes32String } from "ethers/lib/utils";
import { expectEvent } from "../../../helpers";
import { Signer } from "ethers";
import { EnsApi } from "../../../helpers/ens/EnsApi";
import { buildPolywrapPackage } from "../../../helpers/buildPolywrapPackage";
import { EnsDomain } from "../../../helpers/EnsDomain";

describe("Registering packages", () => {
  let registry: PolywrapRegistryV1;

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

  const testDomain = new EnsDomain("test-domain");

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

    const provider = ethers.getDefaultProvider();

    registry = PolywrapRegistryV1__factory.connect(
      deploys["PolywrapRegistryV1"].address,
      provider
    );

    ens = new EnsApi(
      {
        ensRegistryL1: deploys["EnsRegistryL1"].address,
        testEthRegistrarL1: deploys["TestEthRegistrarL1"].address,
        testPublicResolverL1: deploys["TestPublicResolverL1"].address,
      },
      provider
    );

    await ens.registerDomainName(owner, domainOwner, testDomain);

    registry = registry.connect(domainOwner);

    let tx = await registry.claimOrganizationOwnership(
      testDomain.registryBytes32,
      testDomain.node,
      await organizationOwner.getAddress()
    );

    await tx.wait();

    registry = registry.connect(organizationOwner);

    tx = await registry.setOrganizationController(
      testDomain.organizationId,
      await organizationController.getAddress()
    );

    await tx.wait();

    registry = registry.connect(organizationController);
  });

  it("can register package", async () => {
    const testPackage = buildPolywrapPackage(testDomain, "test-package");
    const packageOwnerAddress = await packageOwner.getAddress();
    const packageControllerAddress = await packageController.getAddress();

    registry = registry.connect(organizationController);

    const tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage.packageName),
      packageOwnerAddress,
      packageControllerAddress
    );

    await tx.wait();

    await expectEvent(tx, "PackageRegistered", {
      organizationId: testDomain.organizationId,
      packageId: testPackage.packageId,
      packageName: ethers.utils.formatBytes32String(testPackage.packageName),
      packageOwner: packageOwnerAddress,
      packageController: packageControllerAddress,
    });

    const packageInfo = await registry.package(testPackage.packageId);
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
    expect(
      await registry.packageIds(testDomain.organizationId, 0, 10)
    ).to.deep.equal([testPackage.packageId]);
    expect(await registry.packageCount(testDomain.organizationId)).to.equal(1);
  });

  it("can register multiple packages for same organization", async () => {
    const testPackage1 = buildPolywrapPackage(testDomain, "test-package1");
    const testPackage2 = buildPolywrapPackage(testDomain, "test-package2");
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();
    const packageControllerAddress1 = await packageController.getAddress();
    const packageControllerAddress2 = await packageController2.getAddress();

    registry = registry.connect(organizationController);

    let tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage1.packageName),
      packageOwnerAddress1,
      packageControllerAddress1
    );

    await tx.wait();

    await expectEvent(tx, "PackageRegistered", {
      organizationId: testDomain.organizationId,
      packageId: testPackage1.packageId,
      packageName: ethers.utils.formatBytes32String(testPackage1.packageName),
      packageOwner: packageOwnerAddress1,
      packageController: packageControllerAddress1,
    });

    expect(await registry.packageExists(testPackage1.packageId)).to.equal(true);

    expect(await registry.packageOwner(testPackage1.packageId)).to.equal(
      packageOwnerAddress1
    );

    tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage2.packageName),
      packageOwnerAddress2,
      packageControllerAddress2
    );

    await tx.wait();

    await expectEvent(tx, "PackageRegistered", {
      organizationId: testDomain.organizationId,
      packageId: testPackage2.packageId,
      packageName: ethers.utils.formatBytes32String(testPackage2.packageName),
      packageOwner: packageOwnerAddress2,
      packageController: packageControllerAddress2,
    });

    expect(await registry.packageExists(testPackage2.packageId)).to.equal(true);

    expect(await registry.packageOwner(testPackage2.packageId)).to.equal(
      packageOwnerAddress2
    );

    expect(
      await registry.packageIds(testDomain.organizationId, 0, 10)
    ).to.deep.equal([testPackage1.packageId, testPackage2.packageId]);

    expect(await registry.packageCount(testDomain.organizationId)).to.equal(2);
  });

  it("can register packages for multiple organizations", async () => {
    const testDomain2 = new EnsDomain("test-domain2");
    const testPackage1 = buildPolywrapPackage(testDomain, "test-package");
    const testPackage2 = buildPolywrapPackage(testDomain2, "test-package");
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();
    const packageControllerAddress1 = await packageController.getAddress();
    const packageControllerAddress2 = await packageController2.getAddress();

    await ens.registerDomainName(owner, domainOwner, testDomain2);

    registry = registry.connect(domainOwner);

    let tx = await registry.claimOrganizationOwnership(
      testDomain2.registryBytes32,
      testDomain2.node,
      await organizationOwner2.getAddress()
    );

    await tx.wait();

    registry = registry.connect(organizationOwner2);

    tx = await registry.setOrganizationController(
      testDomain2.organizationId,
      await organizationController2.getAddress()
    );

    await tx.wait();

    registry = registry.connect(organizationController);

    tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage1.packageName),
      packageOwnerAddress1,
      packageControllerAddress1
    );

    await tx.wait();

    await expectEvent(tx, "PackageRegistered", {
      organizationId: testDomain.organizationId,
      packageId: testPackage1.packageId,
      packageName: ethers.utils.formatBytes32String(testPackage1.packageName),
      packageOwner: packageOwnerAddress1,
      packageController: packageControllerAddress1,
    });

    expect(await registry.packageExists(testPackage1.packageId)).to.equal(true);

    expect(await registry.packageOwner(testPackage1.packageId)).to.equal(
      packageOwnerAddress1
    );

    registry = registry.connect(organizationController2);

    tx = await registry.registerPackage(
      testDomain2.organizationId,
      formatBytes32String(testPackage2.packageName),
      packageOwnerAddress2,
      packageControllerAddress2
    );

    await tx.wait();

    await expectEvent(tx, "PackageRegistered", {
      organizationId: testDomain2.organizationId,
      packageId: testPackage2.packageId,
      packageName: ethers.utils.formatBytes32String(testPackage2.packageName),
      packageOwner: packageOwnerAddress2,
      packageController: packageControllerAddress2,
    });

    expect(await registry.packageExists(testPackage2.packageId)).to.equal(true);

    expect(await registry.packageOwner(testPackage2.packageId)).to.equal(
      packageOwnerAddress2
    );

    expect(
      await registry.packageIds(testDomain.organizationId, 0, 10)
    ).to.deep.equal([testPackage1.packageId]);

    expect(
      await registry.packageIds(testDomain2.organizationId, 0, 10)
    ).to.deep.equal([testPackage2.packageId]);

    expect(await registry.packageCount(testDomain.organizationId)).to.equal(1);
    expect(await registry.packageCount(testDomain2.organizationId)).to.equal(1);
  });

  it("forbids registering multiple packages with the same name for the same organization", async () => {
    const testPackage1 = buildPolywrapPackage(testDomain, "test-package");
    const testPackage2 = buildPolywrapPackage(testDomain, "test-package");
    const packageOwnerAddress1 = await packageOwner.getAddress();
    const packageOwnerAddress2 = await packageOwner2.getAddress();
    const packageControllerAddress1 = await packageController.getAddress();
    const packageControllerAddress2 = await packageController2.getAddress();

    registry = registry.connect(organizationController);

    const tx = await registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage1.packageName),
      packageOwnerAddress1,
      packageControllerAddress1
    );

    await tx.wait();

    const txPromise = registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage2.packageName),
      packageOwnerAddress2,
      packageControllerAddress2
    );

    await expect(txPromise).to.revertedWith(
      "reverted with custom error 'PackageAlreadyExists()'"
    );
  });

  it("forbids non organization controller from registering packages", async () => {
    const testPackage = buildPolywrapPackage(testDomain, "test-package");
    const packageOwnerAddress = await packageOwner.getAddress();
    const packageControllerAddress = await packageController.getAddress();

    registry = registry.connect(organizationOwner);

    let txPromise = registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage.packageName),
      packageOwnerAddress,
      packageControllerAddress
    );

    await expect(txPromise).to.revertedWith(
      "reverted with custom error 'OnlyOrganizationController()'"
    );

    registry = registry.connect(randomAcc);

    txPromise = registry.registerPackage(
      testDomain.organizationId,
      formatBytes32String(testPackage.packageName),
      packageOwnerAddress,
      packageControllerAddress
    );

    await expect(txPromise).to.revertedWith(
      "reverted with custom error 'OnlyOrganizationController()'"
    );
  });
});
