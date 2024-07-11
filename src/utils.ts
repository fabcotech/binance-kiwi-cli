export const getSingleProcessArgv = (param: string) => {
  const index = process.argv.findIndex((arg) => arg === param);
  if (index === -1) {
    return false;
  }

  return true;
};

export const getProcessArgv = (param: string) => {
  const index = process.argv.findIndex((arg) => arg === param);
  if (index === -1) {
    return undefined;
  }

  return process.argv[index + 1];
};

const verbose = getSingleProcessArgv('--verbose');

export const getSecretKey = () => {
  if (process.env.BINANCE_SECRET_KEY) {
    if (verbose) console.log(`got secret key from process env`);
    return process.env.BINANCE_SECRET_KEY || '';
  } else if (getProcessArgv('--binance-secret-key')) {
    if (verbose)
      console.log(
        `got secret key from --binance-secret-key command line parameter`
      );
    return getProcessArgv('--binance-secret-key') || '';
  } else {
    throw new Error(
      'No secret key, use either env.BINANCE_SECRET_KEY or --binance-secret-key'
    );
  }
};

export const getApiKey = () => {
  if (process.env.BINANCE_API_KEY) {
    if (verbose) console.log(`got api key from process env`);
    return process.env.BINANCE_API_KEY || '';
  } else if (getProcessArgv('--binance-api-key')) {
    if (verbose)
      console.log(`got api key from --binance-api-key command line parameter`);
    return getProcessArgv('--binance-api-key') || '';
  } else {
    throw new Error(
      'No api key, use either env.BINANCE_API_KEY or --binance-api-key'
    );
  }
};

export const round2 = (a: number) => {
  return Math.round(100 * a) / 100;
};
export const round3 = (a: number) => {
  return Math.round(1000 * a) / 1000;
};
export const round4 = (a: number) => {
  return Math.round(10000 * a) / 10000;
};
