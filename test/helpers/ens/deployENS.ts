import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { ENSApi } from "./ENSApi";

export const deployENS = async (): Promise<ENSApi> => {
  const polywrapControllerRecordName = "polywrap-controller";

  const ensRegistryFactory = await ethers.getContractFactory("TestENSRegistry");

  const ensRegistry = await ensRegistryFactory.deploy();

  const publicResolverFactory = await ethers.getContractFactory("TestPublicResolver");
  const publicResolver = await publicResolverFactory.deploy(ensRegistry.address);

  const rootNode = ethers.utils.zeroPad([0], 32);

  const getSubNode = (domainName: string): string => {
    const domainHash = ethers.utils.id(domainName);

    const subNode = ethers.utils.solidityKeccak256(["bytes32", "bytes32"], [rootNode, domainHash]);

    return subNode;
  };

  return {
    registerDomainName: async (domainOwner: string, domainName: string): Promise<void> => {
      const domainHash = ethers.utils.id(domainName);

      await ensRegistry.setSubnodeOwner(rootNode, domainHash, domainOwner);
    },
    setPolywrapController: async (domainOwner: SignerWithAddress, domainName: string, controllerAddress: string): Promise<void> => {

      const ownedPublicResolver = publicResolver.connect(domainOwner);

      const subNode = getSubNode(domainName);

      const tx = await ownedPublicResolver.setText(subNode, polywrapControllerRecordName, controllerAddress);

      await tx.wait();
    },
    getPolywrapController: async (domainName: string): Promise<string> => {
      const subNode = getSubNode(domainName);

      return await publicResolver.text(subNode, polywrapControllerRecordName);
    }
  } as ENSApi;
};