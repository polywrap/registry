"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manifest = void 0;
// @ts-noCheck
var _1 = require("./");
var core_js_1 = require("@web3api/core-js");
exports.manifest = {
    schema: _1.schema,
    implements: [
        new core_js_1.Uri("ens/uri-resolver.core.web3api.eth"),
    ],
};
//# sourceMappingURL=manifest.js.map