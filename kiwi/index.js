"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var balances_1 = require("./balances");
var cancelOpenOrders_1 = require("./cancelOpenOrders");
var swapAllUsd_1 = require("./swapAllUsd");
var swap_1 = require("./swap");
var utils_1 = require("./utils");
var masterUSD = 'USDC';
var f = function () {
    if ((0, utils_1.getSingleProcessArgv)('--balances') || (0, utils_1.getSingleProcessArgv)('-b')) {
        var argv = (0, utils_1.getSingleProcessArgv)('--balances')
            ? (0, utils_1.getProcessArgv)('--balances')
            : (0, utils_1.getProcessArgv)('-b');
        (0, balances_1.printBalances)((argv || '')
            .split(',')
            .filter(function (a) { return !a.startsWith('--') && a.length < 5; })
            .filter(function (a) { return !!a; }), masterUSD);
    }
    else if ((0, utils_1.getSingleProcessArgv)('--cancel-open-orders') ||
        (0, utils_1.getSingleProcessArgv)('-c')) {
        (0, cancelOpenOrders_1.cancelOpenOrders)();
    }
    else if ((0, utils_1.getSingleProcessArgv)('--swap-all-usd')) {
        (0, swapAllUsd_1.swapAllUsd)(masterUSD);
    }
    else if ((0, utils_1.getSingleProcessArgv)('--swap') || (0, utils_1.getSingleProcessArgv)('-s')) {
        (0, swap_1.swap)(masterUSD, (0, utils_1.getProcessArgv)('--swap') || (0, utils_1.getProcessArgv)('-s') || '');
    }
    else {
        console.error('Unrecognized command');
        process.exit(1);
    }
};
f();
//# sourceMappingURL=index.js.map