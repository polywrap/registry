// @ts-noCheck
import { schema } from "./";

import { PluginPackageManifest, Uri } from "@web3api/core-js";

export const manifest: PluginPackageManifest = {
  schema,
  implements: [
    new Uri("ens/uri-resolver.core.web3api.eth"),
  ],
}
