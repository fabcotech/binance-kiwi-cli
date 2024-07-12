import querystring from 'node:querystring';
import { request } from 'undici';

import { getApiKey } from './utils';
import { signatureBinanceApi, getOpenOrders, apiBase } from './binance';

export const cancelOpenOrders = async () => {
  const openOrders = await getOpenOrders();
  console.log(`${openOrders.length} orders to be canceled`);
  if (openOrders.length === 0) return;
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
      console.error(`error could not cancel order ${oo.orderId}/${oo.symbol}`);
      console.log(await cancelReq.body.text());
      throw new Error(`status code not 200 : ${cancelReq.statusCode}`);
      continue;
    }
    canceleds += 1;
  }
  console.log(`${canceleds} orders succesfully canceled`);
  const openOrders2 = await getOpenOrders();
  console.log(`${openOrders2.length} orders still open`);
};
