
import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { PolywrapImplementationRegistry, PolywrapVersionRegistry } from "../typechain";
import { EnsApi } from "./helpers/ens/EnsApi";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expectEvent } from "./helpers";
import { EnsDomain } from "./helpers/ens/EnsDomain";

describe("Implementation registration", () => {
  const interfaceDomain = new EnsDomain("interface-domain");
  const implementationDomain = new EnsDomain("implementation-domain");

  let versionRegistry: PolywrapVersionRegistry;
  let implementationRegistry: PolywrapImplementationRegistry;
  let ens: EnsApi;

  let owner: SignerWithAddress;
  let interfaceOwner: SignerWithAddress;
  let interfacePolywrapController: SignerWithAddress;
  let implementationOwner: SignerWithAddress;
  let implementationPolywrapController: SignerWithAddress;
  let randomAcc: SignerWithAddress;

  before(async () => {
    const [
      _owner,
      _interfaceOwner,
      _interfacePolywrapController,
      _implementationOwner,
      _implementationPolywrapController,
      _randomAcc
    ] = await ethers.getSigners();
    owner = _owner;
    interfaceOwner = _interfaceOwner;
    interfacePolywrapController = _interfacePolywrapController;
    implementationOwner = _implementationOwner;
    implementationPolywrapController = _implementationPolywrapController;
    randomAcc = _randomAcc;

    ens = new EnsApi();
    await ens.deploy(owner);

    await ens.registerDomainName(interfaceOwner, interfaceDomain);
    await ens.setPolywrapController(interfaceOwner, interfaceDomain, interfacePolywrapController.address);

    await ens.registerDomainName(implementationOwner, implementationDomain);
    await ens.setPolywrapController(implementationOwner, implementationDomain, implementationPolywrapController.address);
  });

  beforeEach(async () => {
    const versionRegistryFactory = await ethers.getContractFactory("PolywrapVersionRegistry");
    versionRegistry = await versionRegistryFactory.deploy(ens.ensRegistry!.address);

    versionRegistry = versionRegistry.connect(interfacePolywrapController);
    await versionRegistry.registerAPI(interfaceDomain.node);

    versionRegistry = versionRegistry.connect(implementationPolywrapController);
    await versionRegistry.registerAPI(implementationDomain.node);

    const implementationRegistryFactory = await ethers.getContractFactory("PolywrapImplementationRegistry");
    implementationRegistry = await implementationRegistryFactory.deploy(versionRegistry.address);

    implementationRegistry = implementationRegistry.connect(interfacePolywrapController);
  });

  it("can register a new implementation", async function () {
    const tx = await implementationRegistry.registerImplementation(interfaceDomain.apiId, implementationDomain.name);

    await expectEvent(tx, "ImplementationRegistered", {
      implementationUri: implementationDomain.name
    });
  });

  it("can register multiple implementations", async function () {
    const implementationDomain2 = new EnsDomain("implementation-domain2");

    const tx1 = await implementationRegistry.registerImplementation(interfaceDomain.apiId, implementationDomain.name);

    await expectEvent(tx1, "ImplementationRegistered", {
      interfaceApiId: interfaceDomain.apiId,
      implementationUri: implementationDomain.name
    });

    const tx2 = await implementationRegistry.registerImplementation(interfaceDomain.apiId, implementationDomain2.name);

    await expectEvent(tx2, "ImplementationRegistered", {
      interfaceApiId: interfaceDomain.apiId,
      implementationUri: implementationDomain2.name
    });
  });

  it("forbids non interface domain owners from registering an implementation", async function () {
    implementationRegistry = implementationRegistry.connect(randomAcc);

    await expect(
      implementationRegistry.registerImplementation(interfaceDomain.apiId, implementationDomain.name)
    ).to.revertedWith("You do not have access to this interface API");

    implementationRegistry = implementationRegistry.connect(implementationPolywrapController);

    await expect(
      implementationRegistry.registerImplementation(interfaceDomain.apiId, implementationDomain.name)
    ).to.revertedWith("You do not have access to this interface API");
  });

  it("forbids non interface domain owners from registering multiple implementations at once", async function () {
    const implementationDomain2 = new EnsDomain("implementation-domain2");

    implementationRegistry = implementationRegistry.connect(randomAcc);

    await expect(
      implementationRegistry.registerImplementations(interfaceDomain.apiId, [implementationDomain.apiId, implementationDomain2.name])
    ).to.revertedWith("You do not have access to this interface API");

    implementationRegistry = implementationRegistry.connect(implementationPolywrapController);

    await expect(
      implementationRegistry.registerImplementations(interfaceDomain.apiId, [implementationDomain.name, implementationDomain2.name])
    ).to.revertedWith("You do not have access to this interface API");
  });

  it("forbids non interface domain owners from overwriting implementations", async function () {
    implementationRegistry = implementationRegistry.connect(randomAcc);

    await expect(
      implementationRegistry.registerImplementations(interfaceDomain.apiId, [])
    ).to.revertedWith("You do not have access to this interface API");

    implementationRegistry = implementationRegistry.connect(implementationPolywrapController);

    await expect(
      implementationRegistry.overwriteImplementations(interfaceDomain.apiId, [])
    ).to.revertedWith("You do not have access to this interface API");
  });

  it("anyone can get implementations", async function () {
    const implementationDomain2 = new EnsDomain("implementation-domain2");

    await implementationRegistry.registerImplementation(interfaceDomain.apiId, implementationDomain.name);
    await implementationRegistry.registerImplementation(interfaceDomain.apiId, implementationDomain2.name);

    implementationRegistry = implementationRegistry.connect(randomAcc);

    const implementations = await implementationRegistry.getImplementations(interfaceDomain.apiId);

    expect(implementations).to.eql([
      implementationDomain.name,
      implementationDomain2.name
    ]);
  });

  it("can overwrite implementations", async function () {
    const implementationDomain2 = new EnsDomain("implementation-domain2");
    const implementationDomain3 = new EnsDomain("implementation-domain3");

    await implementationRegistry.registerImplementation(interfaceDomain.apiId, implementationDomain.name);
    await implementationRegistry.registerImplementation(interfaceDomain.apiId, implementationDomain2.name);
    await implementationRegistry.overwriteImplementations(interfaceDomain.apiId, [implementationDomain3.name]);

    implementationRegistry = implementationRegistry.connect(randomAcc);

    const implementations = await implementationRegistry.getImplementations(interfaceDomain.apiId);

    expect(implementations).to.eql([
      implementationDomain3.name
    ]);
  });

  it("can clear all implementations", async function () {
    const implementationDomain2 = new EnsDomain("implementation-domain2");

    await implementationRegistry.registerImplementation(interfaceDomain.apiId, implementationDomain.apiId);
    await implementationRegistry.registerImplementation(interfaceDomain.apiId, implementationDomain2.name);
    await implementationRegistry.overwriteImplementations(interfaceDomain.apiId, []);

    implementationRegistry = implementationRegistry.connect(randomAcc);

    const implementations = await implementationRegistry.getImplementations(interfaceDomain.apiId);

    expect(implementations).to.eql([]);
  });

  it("forbids registering an implementation if the interface api is not registered", async function () {
    const nonRegisteredInterfaceDomain = new EnsDomain("non-registered-interface-domain");

    await expect(
      implementationRegistry.registerImplementation(nonRegisteredInterfaceDomain.apiId, implementationDomain.name)
    ).to.revertedWith("API is not registered");
  });
});