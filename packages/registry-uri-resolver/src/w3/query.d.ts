import { Bytes, String } from "./types";
import * as Types from "./types";
import { Client, PluginModule, MaybeAsync } from "@web3api/core-js";
export interface Input_tryResolveUri extends Record<string, unknown> {
    authority: String;
    path: String;
}
export interface Input_getFile extends Record<string, unknown> {
    path: String;
}
export interface Module extends PluginModule {
    tryResolveUri(input: Input_tryResolveUri, client: Client): MaybeAsync<Types.UriResolver_MaybeUriOrManifest | null>;
    getFile(input: Input_getFile, client: Client): MaybeAsync<Bytes | null>;
}
