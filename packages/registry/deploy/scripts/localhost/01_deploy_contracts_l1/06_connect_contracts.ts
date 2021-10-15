import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { formatBytes32String } from "ethers/lib/utils";
import { EnsDomain } from "@polywrap/registry-core-js";
import {
  OwnershipBridgeLink__factory,
  PackageOwnershipManager__factory,
  PolywrapRegistry__factory,
  VerificationRootBridgeLink__factory,
  VersionVerificationManager__factory,
} from "../../../../typechain";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const isLocalNetwork = !hre.network.live;
  const signer = await ethers.getSigner(deployer);

  const registryL1 = PolywrapRegistry__factory.connect(
    (await hre.deployments.get("PolywrapRegistryL1")).address,
    signer
  );
  const versionVerificationManagerL1 =
    VersionVerificationManager__factory.connect(
      (await hre.deployments.get("VersionVerificationManagerL1")).address,
      signer
    );
  const packageOwnershipManagerL1 = PackageOwnershipManager__factory.connect(
    (await hre.deployments.get("PackageOwnershipManagerL1")).address,
    signer
  );
  const verificationRootBridgeLinkL1 =
    VerificationRootBridgeLink__factory.connect(
      (await hre.deployments.get("VerificationRootBridgeLinkL1")).address,
      signer
    );
  const ownershipBridgeLinkL1 = OwnershipBridgeLink__factory.connect(
    (await hre.deployments.get("OwnershipBridgeLinkL1")).address,
    signer
  );

  await verificationRootBridgeLinkL1.updateVersionVerificationManager(
    versionVerificationManagerL1.address
  );

  await registryL1.updateOwnershipUpdater(packageOwnershipManagerL1.address);
  await registryL1.updateVersionPublisher(versionVerificationManagerL1.address);
  await versionVerificationManagerL1.updateVerificationRootUpdater(
    verificationRootBridgeLinkL1.address
  );
  await packageOwnershipManagerL1.updateOutgoingBridgeLink(
    EnsDomain.RegistryBytes32,
    formatBytes32String("l2-chain-name"),
    ownershipBridgeLinkL1.address
  );
  await packageOwnershipManagerL1.updateLocalDomainRegistryPermission(
    EnsDomain.RegistryBytes32,
    true
  );

  return !isLocalNetwork;
};
export default func;
func.id = "connect_contracts_l1";
func.tags = ["ConnectContracts", "l1"];
