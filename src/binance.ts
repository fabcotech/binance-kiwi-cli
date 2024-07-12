import crypto from 'crypto';
import querystring from 'querystring';
import { request } from 'undici';

import { getSecretKey, getApiKey } from './utils';

export const apiBase = 'https://api1.binance.com/api/v3/';

export const signatureBinanceApi = (qs: string) => {
  return crypto.createHmac('sha256', getSecretKey()).update(qs).digest('hex');
};

const getBalanceBinance = async (symbol: string) => {
  const qs = querystring.stringify({
    timestamp: new Date().getTime(),
    omitZeroBalances: true,
  });
  const signature = signatureBinanceApi(qs);
  const accountReq = await request(
    `${apiBase}account?${qs}&signature=${signature}`,
    {
      method: 'GET',
      headers: {
        'X-MBX-APIKEY': getApiKey(),
      },
    }
  );
  const json: any = await accountReq.body.json();
  try {
    if (symbol)
      return parseFloat(
        json.balances.find((b: any) => b.asset === symbol).free
      );
    return json.balances;
  } catch (err) {
    return 0;
  }
};

export const getOpenOrders = async (): Promise<any> => {
  const qs = querystring.stringify({
    timestamp: new Date().getTime(),
  });
  const signature = signatureBinanceApi(qs);
  const tradesReq = await request(
    `${apiBase}openOrders?${qs}&signature=${signature}`,
    {
      method: 'GET',
      headers: {
        'X-MBX-APIKEY': getApiKey(),
      },
    }
  );
  return await tradesReq.body.json();
};

export const placeSellTradeMarket = async (pair: string, balance: number) => {
  let s = `[placeSellTradeMarket] **${new Date()
    .toISOString()
    .slice(0, 15)}** place sell trade on ${pair}\n`;
  const qs = querystring.stringify({
    symbol: pair,
    side: 'sell',
    timestamp: new Date().getTime(),
    type: 'MARKET',
    quantity: balance.toString(),
  });
  const signature = signatureBinanceApi(qs);

  const placeOrderReq = await request(
    `${apiBase}order?${qs}&signature=${signature}`,
    {
      method: 'POST',
      headers: {
        'X-MBX-APIKEY': getApiKey(),
      },
    }
  );
  if (placeOrderReq.statusCode !== 200) {
    s += `order was not placed ${placeOrderReq.statusCode}:\n`;
    s += `${await placeOrderReq.body.text()}:\n`;
    console.log(s);
    return;
  }
  const binanceOrder = await placeOrderReq.body.json();
  console.log(binanceOrder);
  s += `sell order was successfully placed \n`;
  console.log(s);
  console.log(`\`\`\`${JSON.stringify(binanceOrder, null, 1)}\`\`\``);
  return binanceOrder;
};

export const getSymbolInfo = async (symbol: string) => {
  const exchangeInfo = await request(
    `${apiBase}exchangeInfo?symbol=${symbol.toUpperCase()}`,
    {
      method: 'GET',
      headers: {
        'X-MBX-APIKEY': getApiKey(),
      },
    }
  );
  return await exchangeInfo.body.json();
};

export const getPriceTicker = async (
  symbol: string
): Promise<{ price: string; symbol: string }> => {
  const resp = await request(
    `${apiBase}ticker/price?symbol=${symbol.toUpperCase()}`,
    {
      method: 'GET',
      headers: {
        'X-MBX-APIKEY': getApiKey(),
      },
    }
  );
  return (await resp.body.json()) as { price: string; symbol: string };
};

export const swapAllToUsd = async (pairs: string[], usdSymbol: string) => {
  const s = '';
  for (const pair of pairs) {
    const realBalance = await getBalanceBinance(pair.replace(usdSymbol, ''));
    let balance = realBalance;

    // look at .stepSize in LOT_SIZE filter
    // in /exchangeInfo api endpoint
    if (pair.startsWith('SHIB')) {
      balance = Math.floor(1 * realBalance) / 1;
    } else if (pair.startsWith('FLOKI')) {
      balance = Math.floor(1 * realBalance) / 1;
    } else if (pair.startsWith('PEPE')) {
      balance = Math.floor(1 * realBalance) / 1;
    } else if (pair.startsWith('WIF')) {
      balance = Math.floor(100 * realBalance) / 100;
    } else if (pair.startsWith('BONK')) {
      balance = Math.floor(1 * realBalance) / 1;
    } else if (pair.startsWith('BOME')) {
      balance = Math.floor(1 * realBalance) / 1;
    } else if (pair.startsWith('SOL')) {
      balance = Math.floor(100 * realBalance) / 100;
    } else if (pair.startsWith('JUP')) {
      balance = Math.floor(100 * realBalance) / 100;
    } else if (pair.startsWith('TIA')) {
      balance = Math.floor(10 * realBalance) / 10;
    } else if (pair.startsWith('ENA')) {
      balance = Math.floor(100 * realBalance) / 100;
    } else if (pair.startsWith('ETH')) {
      balance = Math.floor(10000 * realBalance) / 10000;
    } else if (pair.startsWith('BTC')) {
      balance = Math.floor(100000 * realBalance) / 100000;
    } else {
      balance = Math.floor(1000 * realBalance) / 1000;
    }
    console.log(s);
    const binanceOrder = await placeSellTradeMarket(pair, balance);
    if (!binanceOrder) {
      console.log(`[placeSellTradeMarket] failed for ${pair}`);
    }
  }
  return '';
};

export const cancelOpenOrdersAndSwapToUsd = async (
  pairs: string[],
  usdSymbol: string
) => {
  let s = `[cancelOpenOrdersAndSwapToUsdt] **${new Date()
    .toISOString()
    .slice(0, 15)}**\n`;
  const openOrders: any = await getOpenOrders();
  let canceleds = 0;
  for (const oo of openOrders) {
    const qs = querystring.stringify({
      symbol: oo.symbol,
      orderId: oo.orderId,
      timestamp: new Date().getTime(),
    });
    const signature = signatureBinanceApi(qs);
    const cancelReq = await request(
      `${apiBase}order?${qs}&signature=${signature}`,
      {
        method: 'DELETE',
        headers: {
          'X-MBX-APIKEY': getApiKey(),
        },
      }
    );
    if (cancelReq.statusCode !== 200) {
      console.log(
        `error could not cancel order ${oo.orderId}/${oo.symbol}, status code : ${cancelReq.statusCode}`
      );
      continue;
    }
    canceleds += 1;
  }
  if (canceleds > 0) {
    s += `${canceleds} orders canceled\n`;
  }
  await swapAllToUsd(pairs, usdSymbol);
  s += `swap all to usdt successful\n`;
  console.log(s);
  return true;
};
