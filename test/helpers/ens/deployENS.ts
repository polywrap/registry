import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { labelhash } from "../labelhash";
import { ENSApi } from "./ENSApi";

const polywrapControllerRecordName = "polywrap-controller";

//ethController can set resolvers
export const deployENS = async (ethController: SignerWithAddress): Promise<ENSApi> => {
  const rootNode = ethers.utils.zeroPad([0], 32);

  const ensRegistryFactory = await ethers.getContractFactory("TestENSRegistry");

  const ensRegistry = await ensRegistryFactory.deploy();

  const ethRegistrarFactory = await ethers.getContractFactory("TestEthRegistrar");

  let ethRegistrar = await ethRegistrarFactory.deploy(ensRegistry.address, ethers.utils.namehash("eth"));

  await ensRegistry.setSubnodeOwner(rootNode, labelhash("eth"), ethRegistrar.address);
  await ethRegistrar.addController(ethController.address);

  const publicResolverFactory = await ethers.getContractFactory("TestPublicResolver");
  const publicResolver = await publicResolverFactory.deploy(ensRegistry.address);

  ethRegistrar = ethRegistrar.connect(ethController);

  await ethRegistrar.setResolver(publicResolver.address);

  return {
    ensRegistry,
    ethRegistrar,
    ensPublicResolver: publicResolver,
    registerDomainName: async (domainOwner: SignerWithAddress, domainLabel: string): Promise<void> => {
      await ethRegistrar.register(labelhash(domainLabel), domainOwner.address, 10 * 60);
      const ownedRegistry = ensRegistry.connect(domainOwner);

      await ownedRegistry.setResolver(ethers.utils.namehash(domainLabel + ".eth"), publicResolver.address);
    },
    setPolywrapController: async (domainOwner: SignerWithAddress, domainLabel: string, controllerAddress: string): Promise<void> => {

      const ownedPublicResolver = publicResolver.connect(domainOwner);

      const tx = await ownedPublicResolver.setText(ethers.utils.namehash(domainLabel + ".eth"), polywrapControllerRecordName, controllerAddress);
      await tx.wait();
    },
    getPolywrapController: async (domainLabel: string): Promise<string> => {
      return await publicResolver.text(ethers.utils.namehash(domainLabel + ".eth"), polywrapControllerRecordName);
    }
  } as ENSApi;
};