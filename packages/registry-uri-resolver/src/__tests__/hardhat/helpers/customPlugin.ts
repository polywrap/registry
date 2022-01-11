import {
  Client,
  Plugin,
  PluginFactory,
  PluginPackageManifest,
  Uri,
} from "@web3api/client-js";

export class CustomPlugin extends Plugin {
  private query: any;
  private mutation: any;

  constructor(config: CustomPluginConfig) {
    super();

    this.query = config.query;
    this.mutation = config.mutation;
  }

  public static manifest(): PluginPackageManifest {
    return {
      schema: "",
      implements: [],
    };
  }

  public getModules(
    _client: Client
  ): {
    mutation: any;
    query: any;
  } {
    return {
      query: this.query,
      mutation: this.mutation,
    };
  }
}

export const customPlugin: PluginFactory<CustomPluginConfig> = (
  opts: CustomPluginConfig
) => {
  return {
    factory: () => new CustomPlugin(opts),
    manifest: {
      schema: "",
      implements: [],
    },
  };
};

export interface CustomPluginConfig {
  query?: any;
  mutation?: any;
}
