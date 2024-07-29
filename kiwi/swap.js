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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.swap = void 0;
var undici_1 = require("undici");
var readline_1 = require("readline");
var utils_1 = require("./utils");
var binance_1 = require("./binance");
var readline = (0, readline_1.createInterface)({
    input: process.stdin,
    output: process.stdout,
});
var parseAmountArg = function (str) {
    if (str.includes('%')) {
        var f_1 = parseFloat(str.replace('%', ''));
        if (isNaN(f_1) || f_1 <= 0 || f_1 > 100) {
            throw new Error('Invalid --amount percentage');
        }
        return { type: 'percent', amount: f_1 };
    }
    var f = parseFloat(str);
    if (isNaN(f) || f <= 0 || f > 100) {
        throw new Error('Invalid --amount percentage');
    }
    return { type: 'absolute', amount: f };
};
var swap = function (masterUSD, swapArg, amountArg) { return __awaiter(void 0, void 0, void 0, function () {
    var amount, twoAssets, availableBalance, bal, pair_1, exchangeInfo, json, tr, filter, roundBy, balString_1, binanceOrder, priceUsd, _a, balUsd_1, pair_2, exchangeInfo, json, tr, filter, roundBy, balString_2, binanceOrder;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                amount = { type: 'percent', amount: 100 };
                if (amountArg) {
                    amount = parseAmountArg(amountArg);
                }
                twoAssets = swapArg.split('->').map(function (a) { return (a || '').toUpperCase(); });
                if (!twoAssets.includes(masterUSD))
                    throw new Error("".concat(swapArg, " does not include ").concat(masterUSD, ", cannot swap"));
                return [4 /*yield*/, (0, binance_1.getBalanceBinance)(twoAssets[0])];
            case 1:
                availableBalance = _b.sent();
                bal = availableBalance;
                if (amount.type === 'percent') {
                    bal = (amount.amount / 100) * bal;
                    console.log("Will try to swap ".concat(bal, " (").concat(amount.amount, "%) of ").concat(twoAssets[0], " total available balance ").concat(availableBalance));
                }
                else if (amount.type === 'absolute') {
                    if (amount.amount > availableBalance) {
                        console.error("".concat(amount.amount, " ").concat(twoAssets[0], " is above to available balance ").concat(availableBalance, ", cannot swap"));
                        process.exit(1);
                    }
                    bal = amount.amount;
                    console.log("Will try to swap ".concat(amount.amount, " ").concat(twoAssets[0], ", total available balance is ").concat(availableBalance));
                }
                if (!(twoAssets[0] === masterUSD)) return [3 /*break*/, 7];
                if (bal < 1) {
                    console.error("".concat(masterUSD, " balance is too small: ").concat(bal, ", cannot swap"));
                    process.exit(1);
                }
                pair_1 = "".concat(twoAssets[1]).concat(twoAssets[0]);
                return [4 /*yield*/, (0, undici_1.request)("https://api1.binance.com/api/v3/exchangeInfo", {
                        method: 'GET',
                        headers: {
                            'X-MBX-APIKEY': (0, utils_1.getApiKey)(),
                        },
                    })];
            case 2:
                exchangeInfo = _b.sent();
                return [4 /*yield*/, exchangeInfo.body.json()];
            case 3:
                json = _b.sent();
                tr = json.symbols.find(function (s) { return s.symbol === pair_1; });
                filter = tr.filters.find(function (f) { return f.filterType === 'LOT_SIZE'; });
                roundBy = Math.round(1 / parseFloat(filter.stepSize));
                balString_1 = (Math.floor(bal * roundBy) / roundBy).toString();
                if (!(!(0, utils_1.getSingleProcessArgv)('--yes') && !(0, utils_1.getSingleProcessArgv)('-y'))) return [3 /*break*/, 5];
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        readline.question("Swap ".concat(balString_1, " ").concat(masterUSD, " to ").concat(twoAssets[1], " ? yes/y no/n :\n"), function (resp) {
                            if (['yes', 'y'].includes(resp)) {
                                resolve(true);
                            }
                            else {
                                console.error('Answered no, abort swap');
                                process.exit(1);
                            }
                            readline.close();
                        });
                    })];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5: return [4 /*yield*/, (0, binance_1.placeOrderMarket)("".concat(twoAssets[1]).concat(twoAssets[0]), balString_1, 'buy')];
            case 6:
                binanceOrder = _b.sent();
                console.log(binanceOrder);
                process.exit(0);
                return [3 /*break*/, 14];
            case 7:
                _a = parseFloat;
                return [4 /*yield*/, (0, binance_1.getPriceTicker)("".concat(twoAssets[0]).concat(masterUSD))];
            case 8:
                priceUsd = _a.apply(void 0, [(_b.sent()).price]);
                balUsd_1 = priceUsd * bal;
                pair_2 = "".concat(twoAssets[0]).concat(twoAssets[1]);
                return [4 /*yield*/, (0, undici_1.request)("https://api1.binance.com/api/v3/exchangeInfo", {
                        method: 'GET',
                        headers: {
                            'X-MBX-APIKEY': (0, utils_1.getApiKey)(),
                        },
                    })];
            case 9:
                exchangeInfo = _b.sent();
                return [4 /*yield*/, exchangeInfo.body.json()];
            case 10:
                json = _b.sent();
                tr = json.symbols.find(function (s) { return s.symbol === pair_2; });
                filter = tr.filters.find(function (f) { return f.filterType === 'LOT_SIZE'; });
                roundBy = Math.round(1 / parseFloat(filter.stepSize));
                balString_2 = (Math.floor(bal * roundBy) / roundBy).toString();
                if (balUsd_1 < 1) {
                    console.error("".concat(twoAssets[0], " balance is too small: ").concat(balString_2, " (approx ").concat(balUsd_1, " ").concat(masterUSD, ")"));
                    process.exit(1);
                }
                if (!(!(0, utils_1.getSingleProcessArgv)('--yes') && !(0, utils_1.getSingleProcessArgv)('-y'))) return [3 /*break*/, 12];
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        readline.question("Swap ".concat(balString_2, " ").concat(twoAssets[0], " (approx ").concat(balUsd_1, " ").concat(masterUSD, ") to ").concat(masterUSD, " ? yes/y no/n :\n"), function (resp) {
                            if (['yes', 'y'].includes(resp)) {
                                resolve(true);
                            }
                            else {
                                console.error('Answered no, abort swap');
                                process.exit(1);
                            }
                            readline.close();
                        });
                    })];
            case 11:
                _b.sent();
                _b.label = 12;
            case 12:
                console.log("".concat(twoAssets[0]).concat(twoAssets[1]), bal, balString_2);
                return [4 /*yield*/, (0, binance_1.placeOrderMarket)("".concat(twoAssets[0]).concat(twoAssets[1]), balString_2, 'sell')];
            case 13:
                binanceOrder = _b.sent();
                console.log(binanceOrder);
                process.exit(0);
                _b.label = 14;
            case 14: return [2 /*return*/];
        }
    });
}); };
exports.swap = swap;
//# sourceMappingURL=swap.js.map