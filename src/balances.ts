import querystring from 'node:querystring';
import { request } from 'undici';

import { getApiKey, getSingleProcessArgv, round4 } from './utils';
import {
  signatureBinanceApi,
  getPriceTicker,
  getBalancesBinance,
} from './binance';

export const printBalances = async (symbols: string[], usdSymbol: string) => {
  const obj: { [symbol: string]: any } = {};
  let s = '';
  const balances = await getBalancesBinance();
  if (symbols.length) {
    for (const symbol of symbols) {
      const priceUsd = parseFloat(
        (await getPriceTicker(`${symbol}${usdSymbol}`)).price
      );
      let b = 0;
      try {
        b = parseFloat(
          balances.balances.find((b: any) =>
            [symbol, symbol.toUpperCase()].includes(b.asset)
          ).free
        );
      } catch (err) {
        // do nothing;
      }
      let usdAmount = '';
      let usdAmountN = 0;
      if (!isNaN(priceUsd)) {
        usdAmountN = round4(b * priceUsd);
        usdAmount = `~${usdAmountN} ${usdSymbol}`;
      }
      s += `\n${symbol.padEnd(5, ' ')} ${b
        .toString()
        .padEnd(10, ' ')} ${usdAmount}`;
      obj[symbol] = { quantity: b, usdAmount: usdAmountN };
    }
  } else {
    for (const bal of balances.balances || []) {
      const priceUsd = parseFloat(
        (await getPriceTicker(`${bal.asset}${usdSymbol}`)).price
      );
      let b = 0;
      try {
        b = parseFloat(bal.free);
      } catch (err) {
        // do nothing;
      }
      let usdAmount = '';
      let usdAmountN = 0;
      if (!isNaN(priceUsd)) {
        usdAmountN = round4(b * priceUsd);
        usdAmount = `~${usdAmountN} ${usdSymbol}`;
      }
      s += `\n${bal.asset.toUpperCase().padEnd(5, ' ')} ${b
        .toString()
        .padEnd(10, ' ')} ${usdAmount}`;
      obj[bal.asset.toUpperCase()] = { quantity: b, usdAmount: usdAmountN };
    }
  }
  if (getSingleProcessArgv('--json')) {
    console.log(JSON.stringify(obj, null, 1));
  } else {
    console.log(s);
  }
};
