import {
  Ethereum_TxResponse,
  Ethereum_Mutation,
  Input_claimOrganizationOwnership,
  Input_publishVersion,
  Input_registerPackage,
  Input_renounceOwnership,
  Input_setOrganizationController,
  Input_setPackageController,
  Input_setPackageOwner,
  Input_transferOrganizationControl,
  Input_transferOrganizationOwnership,
  Input_transferOwnership,
  Input_transferPackageControl,
  Input_transferPackageOwnership
} from "./w3";

export function claimOrganizationOwnership(input: Input_claimOrganizationOwnership): Ethereum_TxResponse {
  return Ethereum_Mutation.callContractMethod({
    connection: input.connection,
    address: input.address,
    method: "function claimOrganizationOwnership(bytes32 domainRegistry, bytes32 domainRegistryNode, address newOrganizationOwner) public returns ()",
    args: [input.domainRegistry, input.domainRegistryNode, input.newOrganizationOwner]
  });
}

export function publishVersion(input: Input_publishVersion): Ethereum_TxResponse {
  return Ethereum_Mutation.callContractMethod({
    connection: input.connection,
    address: input.address,
    method: "function publishVersion(bytes32 packageId, bytes versionBytes, bytes32 buildMetadata, string location) public returns (bytes32)",
    args: [input.packageId, input.versionBytes.toString(), input.buildMetadata, input.location]
  });
}

export function registerPackage(input: Input_registerPackage): Ethereum_TxResponse {
  return Ethereum_Mutation.callContractMethod({
    connection: input.connection,
    address: input.address,
    method: "function registerPackage(bytes32 organizationId, bytes32 packageName, address packageOwner, address packageController) public returns ()",
    args: [input.organizationId, input.packageName, input.packageOwner, input.packageController]
  });
}

export function renounceOwnership(input: Input_renounceOwnership): Ethereum_TxResponse {
  return Ethereum_Mutation.callContractMethod({
    connection: input.connection,
    address: input.address,
    method: "function renounceOwnership() public returns ()",
    args: []
  });
}

export function setOrganizationController(input: Input_setOrganizationController): Ethereum_TxResponse {
  return Ethereum_Mutation.callContractMethod({
    connection: input.connection,
    address: input.address,
    method: "function setOrganizationController(bytes32 organizationId, address newController) public returns ()",
    args: [input.organizationId, input.newController]
  });
}

export function setPackageController(input: Input_setPackageController): Ethereum_TxResponse {
  return Ethereum_Mutation.callContractMethod({
    connection: input.connection,
    address: input.address,
    method: "function setPackageController(bytes32 packageId, address newController) public returns ()",
    args: [input.packageId, input.newController]
  });
}

export function setPackageOwner(input: Input_setPackageOwner): Ethereum_TxResponse {
  return Ethereum_Mutation.callContractMethod({
    connection: input.connection,
    address: input.address,
    method: "function setPackageOwner(bytes32 packageId, address newOwner) public returns ()",
    args: [input.packageId, input.newOwner]
  });
}

export function transferOrganizationControl(input: Input_transferOrganizationControl): Ethereum_TxResponse {
  return Ethereum_Mutation.callContractMethod({
    connection: input.connection,
    address: input.address,
    method: "function transferOrganizationControl(bytes32 organizationId, address newController) public returns ()",
    args: [input.organizationId, input.newController]
  });
}

export function transferOrganizationOwnership(input: Input_transferOrganizationOwnership): Ethereum_TxResponse {
  return Ethereum_Mutation.callContractMethod({
    connection: input.connection,
    address: input.address,
    method: "function transferOrganizationOwnership(bytes32 organizationId, address newOwner) public returns ()",
    args: [input.organizationId, input.newOwner]
  });
}

export function transferOwnership(input: Input_transferOwnership): Ethereum_TxResponse {
  return Ethereum_Mutation.callContractMethod({
    connection: input.connection,
    address: input.address,
    method: "function transferOwnership(address newOwner) public returns ()",
    args: [input.newOwner]
  });
}

export function transferPackageControl(input: Input_transferPackageControl): Ethereum_TxResponse {
  return Ethereum_Mutation.callContractMethod({
    connection: input.connection,
    address: input.address,
    method: "function transferPackageControl(bytes32 packageId, address newController) public returns ()",
    args: [input.packageId, input.newController]
  });
}

export function transferPackageOwnership(input: Input_transferPackageOwnership): Ethereum_TxResponse {
  return Ethereum_Mutation.callContractMethod({
    connection: input.connection,
    address: input.address,
    method: "function transferPackageOwnership(bytes32 packageId, address newOwner) public returns ()",
    args: [input.packageId, input.newOwner]
  });
}
