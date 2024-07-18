import querystring from 'node:querystring';
import { request } from 'undici';

import { getApiKey } from './utils';
import { signatureBinanceApi, getOpenOrders, apiBase } from './binance';

export const swap = async (masterUSD: string, swapArg: string) => {
  const twoAssets = swapArg.split('->').map((a) => (a || '').toUpperCase());
  if (!twoAssets.includes(masterUSD))
    throw new Error(`${swapArg} does not include ${masterUSD}, cannot swap`);
};
