import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { formatBytes32String } from "ethers/lib/utils";
import { EnsDomain } from "@polywrap/registry-core-js";
import {
  OwnershipBridgeLink__factory,
  PackageOwnershipManager__factory,
  PolywrapRegistrar__factory,
  PolywrapRegistry__factory,
  VerificationRootBridgeLink__factory,
  VerificationRootRelayer__factory,
  VerificationTreeManager__factory,
  VersionVerificationManager__factory,
  VotingMachine__factory,
} from "../../../../typechain-types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const useProxy = !hre.network.live;
  const signer = await ethers.getSigner(deployer);

  const registryL2 = PolywrapRegistry__factory.connect(
    (await hre.deployments.get("PolywrapRegistryL2")).address,
    signer
  );
  const registrar = PolywrapRegistrar__factory.connect(
    (await hre.deployments.get("PolywrapRegistrar")).address,
    signer
  );
  const votingMachine = VotingMachine__factory.connect(
    (await hre.deployments.get("VotingMachine")).address,
    signer
  );
  const verificationRootBridgeLinkL1 = VerificationRootBridgeLink__factory.connect(
    (await hre.deployments.get("VerificationRootBridgeLinkL1")).address,
    signer
  );
  const verificationRootBridgeLinkL2 = VerificationRootBridgeLink__factory.connect(
    (await hre.deployments.get("VerificationRootBridgeLinkL2")).address,
    signer
  );
  const verificationTreeManager = VerificationTreeManager__factory.connect(
    (await hre.deployments.get("VerificationTreeManager")).address,
    signer
  );
  const versionVerificationManager = VersionVerificationManager__factory.connect(
    (await hre.deployments.get("VersionVerificationManagerL2")).address,
    signer
  );
  const verificationRootRelayer = VerificationRootRelayer__factory.connect(
    (await hre.deployments.get("VerificationRootRelayer")).address,
    signer
  );
  const packageOwnershipManagerL2 = PackageOwnershipManager__factory.connect(
    (await hre.deployments.get("PackageOwnershipManagerL2")).address,
    signer
  );
  const ownershipBridgeLinkL1 = OwnershipBridgeLink__factory.connect(
    (await hre.deployments.get("OwnershipBridgeLinkL1")).address,
    signer
  );
  const ownershipBridgeLinkL2 = OwnershipBridgeLink__factory.connect(
    (await hre.deployments.get("OwnershipBridgeLinkL2")).address,
    signer
  );

  await registrar.updateVotingMachine(votingMachine.address);
  await registryL2.updateOwnershipUpdater(packageOwnershipManagerL2.address);
  await votingMachine.updateVersionVerifiedListener(
    verificationTreeManager.address
  );

  await verificationRootBridgeLinkL2.updateVersionVerificationManager(
    versionVerificationManager.address
  );
  await registryL2.updateOwnershipUpdater(packageOwnershipManagerL2.address);
  await registryL2.updateVersionPublisher(versionVerificationManager.address);
  await verificationTreeManager.updateVerificationRootRelayer(
    verificationRootRelayer.address
  );
  await verificationRootBridgeLinkL2.updateVerificationRootRelayer(
    verificationRootRelayer.address
  );
  await versionVerificationManager.updateVerificationRootUpdater(
    verificationRootRelayer.address
  );
  await verificationRootRelayer.updateBridgeLink(
    verificationRootBridgeLinkL2.address
  );
  await verificationRootRelayer.updateVerificationTreeManager(
    verificationTreeManager.address
  );
  await packageOwnershipManagerL2.updateIncomingBridgeLink(
    EnsDomain.RegistryBytes32,
    formatBytes32String("l1-chain-name"),
    ownershipBridgeLinkL2.address
  );
  await ownershipBridgeLinkL1.updateBridgeLink(ownershipBridgeLinkL2.address);
  await ownershipBridgeLinkL2.updateBridgeLink(ownershipBridgeLinkL1.address);
  await verificationRootBridgeLinkL1.updateBridgeLink(
    verificationRootBridgeLinkL2.address
  );
  await verificationRootBridgeLinkL2.updateBridgeLink(
    verificationRootBridgeLinkL1.address
  );

  return !useProxy;
};
export default func;
func.id = "connect_contracts";
func.tags = ["ConnectContracts", "l2"];
