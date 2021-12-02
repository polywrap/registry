import { Interface } from "ethers/lib/utils";
import { handlePromiseError } from "./handlePromiseError";

export const handleContractError = async <TData>(
  promise: Promise<TData>
): Promise<[string | undefined, TData | undefined]> => {
  const [error, data] = await handlePromiseError(promise);

  if (error) {
    const strError = (error as any).toString();
    if (!strError) {
      throw Error("An unexpected error occurred");
    }

    const match = strError.match(/"originalError":({[^}]+})/);
    if (!match) {
      return ["Revert", undefined];
    }

    const parsedError = JSON.parse(match[1]);

    const iface = new Interface([
      "error OnlyDomainRegistryOwner()",
      "error DomainRegistryNotSupported()",
      "error OnlyOrganizationOwner()",
      "error OnlyOrganizationController()",
      "error PackageAlreadyExists()",
      "error OnlyPackageOwner()",
      "error OnlyPackageController()",
      "error OnlyTrustedVersionPublisher()",
      "error VersionNotFullLength()",
      "error ReleaseIdentifierMustBeNumeric()",
      "error VersionAlreadyPublished()",
      "error TooManyIdentifiers()",
      "error InvalidIdentifier()",
      "error InvalidBuildMetadata()",
      "error IdentifierNotReset()",
    ]);

    return [iface.getError(parsedError.data).name, undefined];
  }

  return [undefined, data];
};
