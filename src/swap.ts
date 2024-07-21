import querystring from 'node:querystring';
import { request } from 'undici';
import { stdin, stdout } from 'process';

import { getApiKey } from './utils';
import { getBalanceBinance } from './binance';

const readline = require('readline').createInterface({
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
    if (bal > 1) {
      console.error(`${masterUSD} balance is too small: ${bal}, cannot swap`);
      process.exit(1);
    }
    await new Promise((resolve, reject) => {
      readline.question(
        `Swap all ${bal} ${masterUSD} to ${twoAssets[1]} ? yes/y no/n :\n`,
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
  }
};
