import { expect } from "chai";
import { ethers } from "ethers";
import { EnsDomainV1 } from "@polywrap/registry-core-js";
import { JsonRpcProvider } from "@ethersproject/providers";
import { RegistryContractAddresses } from "../../helpers/RegistryContractAddresses";
import { PolywrapRegistry } from "../../helpers/PolywrapRegistry";

describe("Utils", () => {
  let registry: PolywrapRegistry;
  let registryContractAddresses: RegistryContractAddresses;

  beforeAll(async () => {
    registry = new PolywrapRegistry();
  });

  beforeEach(async () => {
    registryContractAddresses = {
      polywrapRegistry: ethers.constants.AddressZero,
    };

    registry = registry.connect(
      (ethers.getDefaultProvider() as unknown) as JsonRpcProvider,
      ethers.constants.AddressZero,
      registryContractAddresses
    );
  });

  it("verify utility methods work properly", async () => {
    const testDomain = new EnsDomainV1("test-domain");

    const packageInfo = await registry.calculatePackageInfo(
      testDomain.registry,
      testDomain.name,
      "test-package"
    );

    const organizationId = await registry.calculateOrganizationId(
      testDomain.registry,
      testDomain.name
    );

    const packageId = await registry.calculatePackageId(
      testDomain.registry,
      testDomain.name,
      "test-package"
    );

    expect(organizationId).to.equal(packageInfo.organizationId);
    expect(packageId).to.equal(packageInfo.packageId);

    expect(await registry.calculateVersionNodeId(packageId, "1.2.3")).to.equal(
      await registry.calculatePatchNodeId(packageId, "1.2.3")
    );
    expect(await registry.calculateVersionNodeId(packageId, "1.2.3")).to.equal(
      await registry.calculatePatchNodeId(packageId, "1.2.3-alpha")
    );
    expect(await registry.calculateVersionNodeId(packageId, "1.2.3")).to.equal(
      await registry.calculatePatchNodeId(packageId, "1.2.3-alpha.1")
    );
  });
});
