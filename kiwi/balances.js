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
exports.printBalances = void 0;
var node_querystring_1 = __importDefault(require("node:querystring"));
var undici_1 = require("undici");
var utils_1 = require("./utils");
var binance_1 = require("./binance");
var getBalancesBinance = function () { return __awaiter(void 0, void 0, void 0, function () {
    var qs, signature, accountReq;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                qs = node_querystring_1.default.stringify({
                    timestamp: new Date().getTime(),
                    omitZeroBalances: true,
                });
                signature = (0, binance_1.signatureBinanceApi)(qs);
                return [4 /*yield*/, (0, undici_1.request)("https://api1.binance.com/api/v3/account?".concat(qs, "&signature=").concat(signature), {
                        method: 'GET',
                        headers: {
                            'X-MBX-APIKEY': (0, utils_1.getApiKey)(),
                        },
                    })];
            case 1:
                accountReq = _a.sent();
                return [4 /*yield*/, accountReq.body.json()];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var printBalances = function (symbols, usdSymbol) { return __awaiter(void 0, void 0, void 0, function () {
    var obj, s, balances, _loop_1, _i, symbols_1, symbol, _a, _b, bal, priceUsd, _c, b, usdAmount, usdAmountN;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                obj = {};
                s = '';
                return [4 /*yield*/, getBalancesBinance()];
            case 1:
                balances = _d.sent();
                if (!symbols.length) return [3 /*break*/, 6];
                _loop_1 = function (symbol) {
                    var priceUsd, _e, b, usdAmount, usdAmountN;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                _e = parseFloat;
                                return [4 /*yield*/, (0, binance_1.getPriceTicker)("".concat(symbol).concat(usdSymbol))];
                            case 1:
                                priceUsd = _e.apply(void 0, [(_f.sent()).price]);
                                b = 0;
                                try {
                                    b = parseFloat(balances.balances.find(function (b) { return [symbol, symbol.toUpperCase()].includes(b.asset); }).free);
                                }
                                catch (err) {
                                    // do nothing;
                                }
                                usdAmount = '';
                                usdAmountN = 0;
                                if (!isNaN(priceUsd)) {
                                    usdAmountN = (0, utils_1.round4)(b * priceUsd);
                                    usdAmount = "~".concat(usdAmountN, " ").concat(usdSymbol);
                                }
                                s += "\n".concat(symbol.padEnd(5, ' '), " ").concat(b.toString().padEnd(10, ' '), " ").concat(usdAmount);
                                obj[symbol] = { quantity: b, usdAmount: usdAmountN };
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, symbols_1 = symbols;
                _d.label = 2;
            case 2:
                if (!(_i < symbols_1.length)) return [3 /*break*/, 5];
                symbol = symbols_1[_i];
                return [5 /*yield**/, _loop_1(symbol)];
            case 3:
                _d.sent();
                _d.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 10];
            case 6:
                _a = 0, _b = balances.balances || [];
                _d.label = 7;
            case 7:
                if (!(_a < _b.length)) return [3 /*break*/, 10];
                bal = _b[_a];
                _c = parseFloat;
                return [4 /*yield*/, (0, binance_1.getPriceTicker)("".concat(bal.asset).concat(usdSymbol))];
            case 8:
                priceUsd = _c.apply(void 0, [(_d.sent()).price]);
                b = 0;
                try {
                    b = parseFloat(bal.free);
                }
                catch (err) {
                    // do nothing;
                }
                usdAmount = '';
                usdAmountN = 0;
                if (!isNaN(priceUsd)) {
                    usdAmountN = (0, utils_1.round4)(b * priceUsd);
                    usdAmount = "~".concat(usdAmountN, " ").concat(usdSymbol);
                }
                s += "\n".concat(bal.asset.toUpperCase().padEnd(5, ' '), " ").concat(b.toString().padEnd(10, ' '), " ").concat(usdAmount);
                obj[bal.asset.toUpperCase()] = { quantity: b, usdAmount: usdAmountN };
                _d.label = 9;
            case 9:
                _a++;
                return [3 /*break*/, 7];
            case 10:
                if ((0, utils_1.getSingleProcessArgv)('--json')) {
                    console.log(JSON.stringify(obj, null, 1));
                }
                else {
                    console.log(s);
                }
                return [2 /*return*/];
        }
    });
}); };
exports.printBalances = printBalances;
//# sourceMappingURL=balances.js.map