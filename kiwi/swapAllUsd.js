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
exports.swapAllUsd = void 0;
var utils_1 = require("./utils");
var binance_1 = require("./binance");
var swapAllUsd = function (masterUSD) { return __awaiter(void 0, void 0, void 0, function () {
    var balances, pairs, _i, _a, bal, priceUsd, pair, _b, err_1, _c, pairs_1, pair, binanceOrder;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, (0, binance_1.getBalancesBinance)()];
            case 1:
                balances = _d.sent();
                pairs = [];
                _i = 0, _a = balances.balances;
                _d.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                bal = _a[_i];
                priceUsd = 0;
                _d.label = 3;
            case 3:
                _d.trys.push([3, 5, , 6]);
                pair = "".concat(bal.asset).concat(masterUSD);
                _b = parseFloat;
                return [4 /*yield*/, (0, binance_1.getPriceTicker)(pair)];
            case 4:
                priceUsd = _b.apply(void 0, [(_d.sent()).price]);
                if (priceUsd * parseFloat(bal.free) > 5) {
                    pairs.push({
                        balance: bal.free,
                        balanceUsd: priceUsd * parseFloat(bal.free),
                        symbol: pair,
                    });
                }
                return [3 /*break*/, 6];
            case 5:
                err_1 = _d.sent();
                /* console.error(err);
                console.error(`could not get price, ignoring asset ${bal.asset}`); */
                return [3 /*break*/, 6];
            case 6:
                _i++;
                return [3 /*break*/, 2];
            case 7:
                _c = 0, pairs_1 = pairs;
                _d.label = 8;
            case 8:
                if (!(_c < pairs_1.length)) return [3 /*break*/, 11];
                pair = pairs_1[_c];
                console.log("will swap all ".concat(pair.symbol.replace(masterUSD, ''), " (approx ").concat((0, utils_1.round2)(pair.balanceUsd), " ").concat(masterUSD, ") to ").concat(masterUSD));
                return [4 /*yield*/, (0, binance_1.placeOrderMarket)(pair.symbol, pair.balance.toString(), 'sell')];
            case 9:
                binanceOrder = _d.sent();
                _d.label = 10;
            case 10:
                _c++;
                return [3 /*break*/, 8];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.swapAllUsd = swapAllUsd;
//# sourceMappingURL=swapAllUsd.js.map