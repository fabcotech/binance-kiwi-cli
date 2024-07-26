import { printBalances } from './balances';
import { cancelOpenOrders } from './cancelOpenOrders';
import { swapAllUsd } from './swapAllUsd';
import { swap } from './swap';
import { getProcessArgv, getSingleProcessArgv } from './utils';

const masterUSD = 'USDC';
const f = () => {
  if (getSingleProcessArgv('--balances') || getSingleProcessArgv('-b')) {
    const argv = getSingleProcessArgv('--balances')
      ? getProcessArgv('--balances')
      : getProcessArgv('-b');
    printBalances(
      (argv || '')
        .split(',')
        .filter((a: string) => !a.startsWith('--') && a.length < 5)
        .filter((a: string) => !!a),
      masterUSD
    );
  } else if (
    getSingleProcessArgv('--cancel-open-orders') ||
    getSingleProcessArgv('-c')
  ) {
    cancelOpenOrders();
  } else if (getSingleProcessArgv('--swap-all-usd')) {
    swapAllUsd(masterUSD);
  } else if (getSingleProcessArgv('--swap') || getSingleProcessArgv('-s')) {
    swap(
      masterUSD,
      getProcessArgv('--swap') || getProcessArgv('-s') || '',
      getProcessArgv('--amount') || getProcessArgv('-a') || ''
    );
  } else {
    console.error('Unrecognized command');
    process.exit(1);
  }
};

f();
