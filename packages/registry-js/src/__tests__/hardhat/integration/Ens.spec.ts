import { expect } from "chai";
import { ethers } from "hardhat";
import { deployments } from "hardhat";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import { Signer } from "ethers";
import { EnsApiV1 } from "@polywrap/registry-test-utils";

describe("ENS", () => {
  let owner: Signer;
  let polywrapOwner: Signer;

  it("register ens domain", async () => {
    const signers = await ethers.getSigners();

    owner = signers[0];
    polywrapOwner = signers[1];
    const deploys = await deployments.fixture(["ens"]);
    const provider = ethers.getDefaultProvider();

    const ens = new EnsApiV1(
      {
        ensRegistryL1: deploys["EnsRegistryL1"].address,
        testEthRegistrarL1: deploys["TestEthRegistrarL1"].address,
        testPublicResolverL1: deploys["TestPublicResolverL1"].address,
      },
      provider
    );

    const testDomain = "test-domain.eth";

    await ens.registerDomainName(owner, polywrapOwner, testDomain);

    ens.connect(polywrapOwner);

    expect(await ens.owner(testDomain)).to.equal(
      await polywrapOwner.getAddress()
    );
  });
});
