export const parseVersionString = (
  version: string
): [identifiers: string[], buildMetadata: string] => {
  const metadataSplit = version.split("+");
  const dashSplit = metadataSplit[0].split("-");
  const releaseIdentifiers = dashSplit[0].split(".");

  const identifiers = releaseIdentifiers.concat(
    dashSplit.length > 1 ? dashSplit.slice(1).join("-").split(".") : []
  );

  return [identifiers, metadataSplit.length > 1 ? metadataSplit[1] : ""];
};
