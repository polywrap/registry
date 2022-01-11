"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ethereum_Query = exports.UriResolver_Query = void 0;
/* URI: "ens/uri-resolver.core.web3api.eth" */
exports.UriResolver_Query = {
    tryResolveUri: function (input, client) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.invoke({
                    uri: "ens/uri-resolver.core.web3api.eth",
                    module: "query",
                    method: "tryResolveUri",
                    input: input
                })];
        });
    }); },
    getFile: function (input, client) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.invoke({
                    uri: "ens/uri-resolver.core.web3api.eth",
                    module: "query",
                    method: "getFile",
                    input: input
                })];
        });
    }); }
};
/* URI: "ens/ethereum.web3api.eth" */
exports.Ethereum_Query = {
    callContractView: function (input, client) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.invoke({
                    uri: "ens/ethereum.web3api.eth",
                    module: "query",
                    method: "callContractView",
                    input: input
                })];
        });
    }); },
    callContractStatic: function (input, client) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.invoke({
                    uri: "ens/ethereum.web3api.eth",
                    module: "query",
                    method: "callContractStatic",
                    input: input
                })];
        });
    }); },
    encodeParams: function (input, client) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.invoke({
                    uri: "ens/ethereum.web3api.eth",
                    module: "query",
                    method: "encodeParams",
                    input: input
                })];
        });
    }); },
    encodeFunction: function (input, client) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.invoke({
                    uri: "ens/ethereum.web3api.eth",
                    module: "query",
                    method: "encodeFunction",
                    input: input
                })];
        });
    }); },
    getSignerAddress: function (input, client) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.invoke({
                    uri: "ens/ethereum.web3api.eth",
                    module: "query",
                    method: "getSignerAddress",
                    input: input
                })];
        });
    }); },
    getSignerBalance: function (input, client) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.invoke({
                    uri: "ens/ethereum.web3api.eth",
                    module: "query",
                    method: "getSignerBalance",
                    input: input
                })];
        });
    }); },
    getSignerTransactionCount: function (input, client) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.invoke({
                    uri: "ens/ethereum.web3api.eth",
                    module: "query",
                    method: "getSignerTransactionCount",
                    input: input
                })];
        });
    }); },
    getGasPrice: function (input, client) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.invoke({
                    uri: "ens/ethereum.web3api.eth",
                    module: "query",
                    method: "getGasPrice",
                    input: input
                })];
        });
    }); },
    estimateTransactionGas: function (input, client) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.invoke({
                    uri: "ens/ethereum.web3api.eth",
                    module: "query",
                    method: "estimateTransactionGas",
                    input: input
                })];
        });
    }); },
    estimateContractCallGas: function (input, client) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.invoke({
                    uri: "ens/ethereum.web3api.eth",
                    module: "query",
                    method: "estimateContractCallGas",
                    input: input
                })];
        });
    }); },
    checkAddress: function (input, client) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.invoke({
                    uri: "ens/ethereum.web3api.eth",
                    module: "query",
                    method: "checkAddress",
                    input: input
                })];
        });
    }); },
    toWei: function (input, client) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.invoke({
                    uri: "ens/ethereum.web3api.eth",
                    module: "query",
                    method: "toWei",
                    input: input
                })];
        });
    }); },
    toEth: function (input, client) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.invoke({
                    uri: "ens/ethereum.web3api.eth",
                    module: "query",
                    method: "toEth",
                    input: input
                })];
        });
    }); },
    awaitTransaction: function (input, client) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.invoke({
                    uri: "ens/ethereum.web3api.eth",
                    module: "query",
                    method: "awaitTransaction",
                    input: input
                })];
        });
    }); },
    waitForEvent: function (input, client) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.invoke({
                    uri: "ens/ethereum.web3api.eth",
                    module: "query",
                    method: "waitForEvent",
                    input: input
                })];
        });
    }); },
    getNetwork: function (input, client) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.invoke({
                    uri: "ens/ethereum.web3api.eth",
                    module: "query",
                    method: "getNetwork",
                    input: input
                })];
        });
    }); }
};
/// Imported Queries END ///
//# sourceMappingURL=types.js.map