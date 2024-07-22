import querystring from 'node:querystring';
import { request } from 'undici';
import { stdin, stdout } from 'process';
import { createInterface } from 'readline';

import { getApiKey } from './utils';
import {
  getBalanceBinance,
  getPriceTicker,
  placeSellTradeMarket,
} from './binance';

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
    await new Promise((resolve, reject) => {
      readline.question(
        `Swap 100% of ${bal} ${masterUSD} to ${twoAssets[1]} ? yes/y no/n :\n`,
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
    console.log('ok swap');
    const binanceOrder = await placeOrderMarket(
      `${twoAssets[1]}${twoAssets[0]}`,
      bal,
      'buy'
    );
    console.log(binanceOrder);
    process.exit(0);
  } else {
    const priceUsd = parseFloat(
      (await getPriceTicker(`${twoAssets[0]}${masterUSD}`)).price
    );
    const balUsd = priceUsd * bal;
    if (balUsd < 1) {
      console.error(
        `${twoAssets[0]} balance is too small: ${bal} (approx ${balUsd} ${masterUSD})`
      );
      process.exit(1);
    }
    await new Promise((resolve, reject) => {
      readline.question(
        `Swap 100% of ${bal} ${twoAssets[0]} (approx ${balUsd} ${masterUSD}) tp ${masterUSD} ? yes/y no/n :\n`,
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
    console.log('ok swap');
    const binanceOrder = await placeOrderMarket(
      `${twoAssets[1]}${twoAssets[0]}`,
      bal,
      'sell'
    );
    console.log(binanceOrder);
    process.exit(0);
  }
};
