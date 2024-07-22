export declare const apiBase = "https://api1.binance.com/api/v3/";
export declare const signatureBinanceApi: (qs: string) => string;
export declare const getBalancesBinance: () => Promise<any>;
export declare const getBalanceBinance: (symbol: string) => Promise<any>;
export declare const getOpenOrders: () => Promise<any>;
export declare const placeOrderMarket: (symbol: string, balance: number, side: 'sell' | 'buy') => Promise<unknown>;
export declare const getSymbolInfo: (symbol: string) => Promise<unknown>;
export declare const getPriceTicker: (symbol: string) => Promise<{
    price: string;
    symbol: string;
}>;
export declare const swapAllToUsd: (pairs: string[], usdSymbol: string) => Promise<string>;
export declare const cancelOpenOrdersAndSwapToUsd: (pairs: string[], usdSymbol: string) => Promise<boolean>;
//# sourceMappingURL=binance.d.ts.map