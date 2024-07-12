import { printBalances } from './balances';
import { cancelOpenOrders } from './cancelOpenOrders';
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
    const argv = getSingleProcessArgv('--cancel-open-orders')
      ? getProcessArgv('--cancel-open-orders')
      : getProcessArgv('-c');
    cancelOpenOrders();
  } else {
    console.error('Unrecognized command');
    process.exit(1);
  }
};
f();
