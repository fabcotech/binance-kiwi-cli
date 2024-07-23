import querystring from 'node:querystring';
import { request } from 'undici';
import { stdin, stdout } from 'process';
import { createInterface } from 'readline';

import { getApiKey } from './utils';
import { getBalanceBinance, getPriceTicker, placeOrderMarket } from './binance';

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const swap = async (masterUSD: string, swapArg: string) => {
  const twoAssets = swapArg.split('->').map((a) => (a || '').toUpperCase());
  if (!twoAssets.includes(masterUSD))
    throw new Error(`${swapArg} does not include ${masterUSD}, cannot swap`);
  console.log(twoAssets);
  const bal = await getBalanceBinance(twoAssets[0]);
  if (twoAssets[0] === masterUSD) {
    if (bal < 1) {
      console.error(`${masterUSD} balance is too small: ${bal}, cannot swap`);
      process.exit(1);
    }
    const pair = `${twoAssets[1]}${twoAssets[0]}`;
    const exchangeInfo = await request(
      `https://api1.binance.com/api/v3/exchangeInfo`,
      {
        method: 'GET',
        headers: {
          'X-MBX-APIKEY': getApiKey(),
        },
      }
    );
    const json: any = await exchangeInfo.body.json();
    const tr: any = json.symbols.find((s: any) => s.symbol === pair);
    const filter = tr.filters.find((f: any) => f.filterType === 'LOT_SIZE');
    const roundBy = Math.round(1 / parseFloat(filter.stepSize));
    const balString = (Math.floor(bal * roundBy) / roundBy).toString();
    await new Promise((resolve, reject) => {
      readline.question(
        `Swap 100% of ${balString} ${masterUSD} to ${twoAssets[1]} ? yes/y no/n :\n`,
        (resp: string) => {
          if (['yes', 'y'].includes(resp)) {
            resolve(true);
          } else {
            reject();
          }
          readline.close();
        }
      );
    });
    const binanceOrder = await placeOrderMarket(
      `${twoAssets[1]}${twoAssets[0]}`,
      balString,
      'buy'
    );
    console.log(binanceOrder);
    process.exit(0);
  } else {
    const priceUsd = parseFloat(
      (await getPriceTicker(`${twoAssets[0]}${masterUSD}`)).price
    );
    const balUsd = priceUsd * bal;
    const pair = `${twoAssets[0]}${twoAssets[1]}`;
    const exchangeInfo = await request(
      `https://api1.binance.com/api/v3/exchangeInfo`,
      {
        method: 'GET',
        headers: {
          'X-MBX-APIKEY': getApiKey(),
        },
      }
    );
    const json: any = await exchangeInfo.body.json();
    const tr: any = json.symbols.find((s: any) => s.symbol === pair);
    const filter = tr.filters.find((f: any) => f.filterType === 'LOT_SIZE');
    const roundBy = Math.round(1 / parseFloat(filter.stepSize));
    const balString = (Math.floor(bal * roundBy) / roundBy).toString();

    if (balUsd < 1) {
      console.error(
        `${twoAssets[0]} balance is too small: ${balString} (approx ${balUsd} ${masterUSD})`
      );
      process.exit(1);
    }
    await new Promise((resolve, reject) => {
      readline.question(
        `Swap 100% of ${balString} ${twoAssets[0]} (approx ${balUsd} ${masterUSD}) to ${masterUSD} ? yes/y no/n :\n`,
        (resp: string) => {
          if (['yes', 'y'].includes(resp)) {
            resolve(true);
          } else {
            reject();
          }
          readline.close();
        }
      );
    });
    console.log(`${twoAssets[0]}${twoAssets[1]}`, bal, balString);
    const binanceOrder = await placeOrderMarket(
      `${twoAssets[0]}${twoAssets[1]}`,
      balString,
      'sell'
    );
    console.log(binanceOrder);
    process.exit(0);
  }
};
