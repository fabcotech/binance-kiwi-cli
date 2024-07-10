"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var balances_1 = require("./balances");
var utils_1 = require("./utils");
var masterUSD = 'USDC';
var f = function () {
    if ((0, utils_1.getSingleProcessArgv)('--balances') || (0, utils_1.getSingleProcessArgv)('-b')) {
        var argv = (0, utils_1.getSingleProcessArgv)('--balances') ? (0, utils_1.getProcessArgv)('--balances') : (0, utils_1.getProcessArgv)('-b');
        (0, balances_1.printBalances)((argv || '')
            .split(',')
            .filter(function (a) { return !a.startsWith('--') && a.length < 5; })
            .filter(function (a) { return !!a; }), masterUSD);
    }
    else {
        console.error('Unrecognized command');
        process.exit(1);
    }
};
f();
//# sourceMappingURL=index.js.map