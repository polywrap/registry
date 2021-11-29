import { expect } from "chai";
import { ethers } from "hardhat";
import { EnsApi } from "./helpers/EnsApi";
import { deployments } from "hardhat";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import { Signer } from "ethers";
import { EnsDomain } from "./helpers/EnsDomain";

describe("ENS", () => {
  let owner: Signer;
  let polywrapOwner: Signer;

  it("register ens domain", async () => {
    const signers = await ethers.getSigners();

    owner = signers[0];
    polywrapOwner = signers[1];
    const deploys = await deployments.fixture(["ens"]);
    const provider = ethers.getDefaultProvider();

    const ens = new EnsApi(
      {
        ensRegistryL1: deploys["EnsRegistryL1"].address,
        testEthRegistrarL1: deploys["TestEthRegistrarL1"].address,
        testPublicResolverL1: deploys["TestPublicResolverL1"].address,
      },
      provider
    );

    const testDomain = new EnsDomain("test-domain");

    await ens.registerDomainName(owner, polywrapOwner, testDomain);

    ens.connect(polywrapOwner);

    expect(await ens.owner(testDomain)).to.equal(
      await polywrapOwner.getAddress()
    );
  });
});
