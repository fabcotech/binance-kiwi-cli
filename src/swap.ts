import querystring from 'node:querystring';
import { request } from 'undici';

import { getApiKey } from './utils';
import { signatureBinanceApi, getOpenOrders, apiBase } from './binance';

export const swap = async (masterUSD: string, symbol: string) => {
  if (!symbol.includes(masterUSD))
    throw new Error(`${symbol} does not include ${masterUSD}, cannot swap`);
};
