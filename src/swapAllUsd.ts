import { round2 } from './utils';
import {
  getBalancesBinance,
  getPriceTicker,
  placeOrderMarket,
} from './binance';

export const swapAllUsd = async (masterUSD: string) => {
  const balances = await getBalancesBinance();
  const pairs = [];
  for (const bal of balances.balances) {
    let priceUsd = 0;
    try {
      const pair = `${bal.asset}${masterUSD}`;
      priceUsd = parseFloat((await getPriceTicker(pair)).price);
      if (priceUsd * parseFloat(bal.free) > 5) {
        pairs.push({
          balance: bal.free,
          balanceUsd: priceUsd * parseFloat(bal.free),
          symbol: pair,
        });
      }
    } catch (err) {
      /* console.error(err);
      console.error(`could not get price, ignoring asset ${bal.asset}`); */
      continue;
    }
  }
  for (const pair of pairs) {
    console.log(
      `will swap all ${pair.symbol.replace(masterUSD, '')} (approx ${round2(
        pair.balanceUsd
      )} ${masterUSD}) to ${masterUSD}`
    );
    await placeOrderMarket(pair.symbol, pair.balance.toString(), 'sell');
  }
};
