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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOpenOrdersAndSwapToUsd = exports.swapAllToUsd = exports.getPriceTicker = exports.getSymbolInfo = exports.placeSellTradeMarket = exports.getOpenOrders = exports.signatureBinanceApi = void 0;
var crypto_1 = __importDefault(require("crypto"));
var querystring_1 = __importDefault(require("querystring"));
var undici_1 = require("undici");
var utils_1 = require("./utils");
var signatureBinanceApi = function (qs) {
    return crypto_1.default.createHmac('sha256', (0, utils_1.getSecretKey)()).update(qs).digest('hex');
};
exports.signatureBinanceApi = signatureBinanceApi;
var getBalanceBinance = function (symbol) { return __awaiter(void 0, void 0, void 0, function () {
    var qs, signature, accountReq, json;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                qs = querystring_1.default.stringify({
                    timestamp: new Date().getTime(),
                    omitZeroBalances: true,
                });
                signature = (0, exports.signatureBinanceApi)(qs);
                return [4 /*yield*/, (0, undici_1.request)("https://api1.binance.com/api/v3/account?".concat(qs, "&signature=").concat(signature), {
                        method: 'GET',
                        headers: {
                            'X-MBX-APIKEY': (0, utils_1.getApiKey)(),
                        },
                    })];
            case 1:
                accountReq = _a.sent();
                return [4 /*yield*/, accountReq.body.json()];
            case 2:
                json = _a.sent();
                try {
                    if (symbol)
                        return [2 /*return*/, parseFloat(json.balances.find(function (b) { return b.asset === symbol; }).free)];
                    return [2 /*return*/, json.balances];
                }
                catch (err) {
                    return [2 /*return*/, 0];
                }
                return [2 /*return*/];
        }
    });
}); };
var getOpenOrders = function () { return __awaiter(void 0, void 0, void 0, function () {
    var qs, signature, tradesReq;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                qs = querystring_1.default.stringify({
                    timestamp: new Date().getTime(),
                });
                signature = (0, exports.signatureBinanceApi)(qs);
                return [4 /*yield*/, (0, undici_1.request)("https://api1.binance.com/api/v3/openOrders?".concat(qs, "&signature=").concat(signature), {
                        method: 'GET',
                        headers: {
                            'X-MBX-APIKEY': (0, utils_1.getApiKey)(),
                        },
                    })];
            case 1:
                tradesReq = _a.sent();
                return [4 /*yield*/, tradesReq.body.json()];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getOpenOrders = getOpenOrders;
var placeSellTradeMarket = function (pair, balance) { return __awaiter(void 0, void 0, void 0, function () {
    var s, qs, signature, placeOrderReq, _a, _b, binanceOrder;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                s = "[placeSellTradeMarket] **".concat(new Date().toISOString().slice(0, 15), "** place sell trade on ").concat(pair, "\n");
                qs = querystring_1.default.stringify({
                    symbol: pair,
                    side: 'sell',
                    timestamp: new Date().getTime(),
                    type: 'MARKET',
                    quantity: balance.toString(),
                });
                signature = (0, exports.signatureBinanceApi)(qs);
                return [4 /*yield*/, (0, undici_1.request)("https://api1.binance.com/api/v3/order?".concat(qs, "&signature=").concat(signature), {
                        method: 'POST',
                        headers: {
                            'X-MBX-APIKEY': (0, utils_1.getApiKey)(),
                        },
                    })];
            case 1:
                placeOrderReq = _c.sent();
                if (!(placeOrderReq.statusCode !== 200)) return [3 /*break*/, 3];
                s += "order was not placed ".concat(placeOrderReq.statusCode, ":\n");
                _a = s;
                _b = "".concat;
                return [4 /*yield*/, placeOrderReq.body.text()];
            case 2:
                s = _a + _b.apply("", [_c.sent(), ":\n"]);
                console.log(s);
                return [2 /*return*/];
            case 3: return [4 /*yield*/, placeOrderReq.body.json()];
            case 4:
                binanceOrder = _c.sent();
                console.log(binanceOrder);
                s += "sell order was successfully placed \n";
                console.log(s);
                console.log("```".concat(JSON.stringify(binanceOrder, null, 1), "```"));
                return [2 /*return*/, binanceOrder];
        }
    });
}); };
exports.placeSellTradeMarket = placeSellTradeMarket;
var getSymbolInfo = function (symbol) { return __awaiter(void 0, void 0, void 0, function () {
    var exchangeInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, undici_1.request)("https://api1.binance.com/api/v3/exchangeInfo?symbol=".concat(symbol.toUpperCase()), {
                    method: 'GET',
                    headers: {
                        'X-MBX-APIKEY': (0, utils_1.getApiKey)(),
                    },
                })];
            case 1:
                exchangeInfo = _a.sent();
                return [4 /*yield*/, exchangeInfo.body.json()];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getSymbolInfo = getSymbolInfo;
var getPriceTicker = function (symbol) { return __awaiter(void 0, void 0, void 0, function () {
    var resp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, undici_1.request)("https://api1.binance.com/api/v3/ticker/price?symbol=".concat(symbol.toUpperCase()), {
                    method: 'GET',
                    headers: {
                        'X-MBX-APIKEY': (0, utils_1.getApiKey)(),
                    },
                })];
            case 1:
                resp = _a.sent();
                return [4 /*yield*/, resp.body.json()];
            case 2: return [2 /*return*/, (_a.sent())];
        }
    });
}); };
exports.getPriceTicker = getPriceTicker;
var swapAllToUsd = function (pairs, usdSymbol) { return __awaiter(void 0, void 0, void 0, function () {
    var s, _i, pairs_1, pair, realBalance, balance, binanceOrder;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                s = '';
                _i = 0, pairs_1 = pairs;
                _a.label = 1;
            case 1:
                if (!(_i < pairs_1.length)) return [3 /*break*/, 5];
                pair = pairs_1[_i];
                return [4 /*yield*/, getBalanceBinance(pair.replace(usdSymbol, ''))];
            case 2:
                realBalance = _a.sent();
                balance = realBalance;
                // look at .stepSize in LOT_SIZE filter
                // in /exchangeInfo api endpoint
                if (pair.startsWith('SHIB')) {
                    balance = Math.floor(1 * realBalance) / 1;
                }
                else if (pair.startsWith('FLOKI')) {
                    balance = Math.floor(1 * realBalance) / 1;
                }
                else if (pair.startsWith('PEPE')) {
                    balance = Math.floor(1 * realBalance) / 1;
                }
                else if (pair.startsWith('WIF')) {
                    balance = Math.floor(100 * realBalance) / 100;
                }
                else if (pair.startsWith('BONK')) {
                    balance = Math.floor(1 * realBalance) / 1;
                }
                else if (pair.startsWith('BOME')) {
                    balance = Math.floor(1 * realBalance) / 1;
                }
                else if (pair.startsWith('SOL')) {
                    balance = Math.floor(100 * realBalance) / 100;
                }
                else if (pair.startsWith('JUP')) {
                    balance = Math.floor(100 * realBalance) / 100;
                }
                else if (pair.startsWith('TIA')) {
                    balance = Math.floor(10 * realBalance) / 10;
                }
                else if (pair.startsWith('ENA')) {
                    balance = Math.floor(100 * realBalance) / 100;
                }
                else if (pair.startsWith('ETH')) {
                    balance = Math.floor(10000 * realBalance) / 10000;
                }
                else if (pair.startsWith('BTC')) {
                    balance = Math.floor(100000 * realBalance) / 100000;
                }
                else {
                    balance = Math.floor(1000 * realBalance) / 1000;
                }
                console.log(s);
                return [4 /*yield*/, (0, exports.placeSellTradeMarket)(pair, balance)];
            case 3:
                binanceOrder = _a.sent();
                if (!binanceOrder) {
                    console.log("[placeSellTradeMarket] failed for ".concat(pair));
                }
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/, ''];
        }
    });
}); };
exports.swapAllToUsd = swapAllToUsd;
var cancelOpenOrdersAndSwapToUsd = function (pairs, usdSymbol) { return __awaiter(void 0, void 0, void 0, function () {
    var s, openOrders, canceleds, _i, openOrders_1, oo, qs, signature, cancelReq;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                s = "[cancelOpenOrdersAndSwapToUsdt] **".concat(new Date().toISOString().slice(0, 15), "**\n");
                return [4 /*yield*/, (0, exports.getOpenOrders)()];
            case 1:
                openOrders = _a.sent();
                canceleds = 0;
                _i = 0, openOrders_1 = openOrders;
                _a.label = 2;
            case 2:
                if (!(_i < openOrders_1.length)) return [3 /*break*/, 5];
                oo = openOrders_1[_i];
                qs = querystring_1.default.stringify({
                    symbol: oo.symbol,
                    orderId: oo.orderId,
                    timestamp: new Date().getTime(),
                });
                signature = (0, exports.signatureBinanceApi)(qs);
                return [4 /*yield*/, (0, undici_1.request)("https://api1.binance.com/api/v3/order?".concat(qs, "&signature=").concat(signature), {
                        method: 'DELETE',
                        headers: {
                            'X-MBX-APIKEY': (0, utils_1.getApiKey)(),
                        },
                    })];
            case 3:
                cancelReq = _a.sent();
                if (cancelReq.statusCode !== 200) {
                    console.log("error could not cancel order ".concat(oo.orderId, "/").concat(oo.symbol, ", status code : ").concat(cancelReq.statusCode));
                    return [3 /*break*/, 4];
                }
                canceleds += 1;
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                if (canceleds > 0) {
                    s += "".concat(canceleds, " orders canceled\n");
                }
                return [4 /*yield*/, (0, exports.swapAllToUsd)(pairs, usdSymbol)];
            case 6:
                _a.sent();
                s += "swap all to usdt successful\n";
                console.log(s);
                return [2 /*return*/, true];
        }
    });
}); };
exports.cancelOpenOrdersAndSwapToUsd = cancelOpenOrdersAndSwapToUsd;
//# sourceMappingURL=binance.js.map