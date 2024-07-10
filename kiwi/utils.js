"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.round4 = exports.round3 = exports.round2 = exports.getApiKey = exports.getSecretKey = exports.getProcessArgv = exports.getSingleProcessArgv = void 0;
var getSingleProcessArgv = function (param) {
    var index = process.argv.findIndex(function (arg) { return arg === param; });
    if (index === -1) {
        return false;
    }
    return true;
};
exports.getSingleProcessArgv = getSingleProcessArgv;
var getProcessArgv = function (param) {
    var index = process.argv.findIndex(function (arg) { return arg === param; });
    if (index === -1) {
        return undefined;
    }
    return process.argv[index + 1];
};
exports.getProcessArgv = getProcessArgv;
var verbose = (0, exports.getSingleProcessArgv)('--verbose');
var getSecretKey = function () {
    if (process.env.BINANCE_SECRET_KEY) {
        if (verbose)
            console.log("got secret key from process env");
        return process.env.BINANCE_SECRET_KEY || '';
    }
    else if ((0, exports.getProcessArgv)('--binance-secret-key')) {
        if (verbose)
            console.log("got secret key from --binance-secret-key command line parameter");
        return (0, exports.getProcessArgv)('--binance-secret-key') || '';
    }
    else {
        throw new Error('No secret key, use either env.BINANCE_SECRET_KEY or --binance-secret-key');
    }
};
exports.getSecretKey = getSecretKey;
var getApiKey = function () {
    if (process.env.BINANCE_API_KEY) {
        if (verbose)
            console.log("got api key from process env");
        return process.env.BINANCE_API_KEY || '';
    }
    else if ((0, exports.getProcessArgv)('--binance-api-key')) {
        if (verbose)
            console.log("got api key from --binance-api-key command line parameter");
        return (0, exports.getProcessArgv)('--binance-api-key') || '';
    }
    else {
        throw new Error('No api key, use either env.BINANCE_API_KEY or --binance-api-key');
    }
};
exports.getApiKey = getApiKey;
var round2 = function (a) {
    return Math.round(100 * a) / 100;
};
exports.round2 = round2;
var round3 = function (a) {
    return Math.round(1000 * a) / 1000;
};
exports.round3 = round3;
var round4 = function (a) {
    return Math.round(10000 * a) / 10000;
};
exports.round4 = round4;
//# sourceMappingURL=utils.js.map