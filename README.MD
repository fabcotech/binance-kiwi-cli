## Binance Kiwi CLI

![state of the workflow](https://github.com/fabcotech/binance-kiwi-cli/actions/workflows/main.yml/badge.svg)

![Kiwi](https://raw.githubusercontent.com/fabcotech/binance-kiwi-cli/main/assets/kiwi.png)

A fun CLI that makes (some) regular binance API operations very easy to execute. For example `--cancel-open-orders`, `--swap-all-to-usd`, and `--buy ETH --amount 10`. `USDC` is the base USD currency.

### Using API

#### Authentication

Make sure you either privide `--binance-secret-key x --binance-api-key y` as CLI parameters, or env variables `BINANCE_API_KEY` and `BINANCE_SECRET_KEY`. Make sure your IP is whitelisted as well in the security settings.

```sh
node kiwi --binance-secret-key x --binance-api-key y ...rest of CLI parameters
BINANCE_API_KEY=y BINANCE_SECRET_KEY=x node kiwi ...rest of CLI parameters
```

#### Check balances

`--balances` or just `-b`.

```sh
# All non-zero balances and their approx value in USDC
node kiwi --balances
# Same with JSON output
node kiwi --balances --json

# Only ETH and SOL
node kiwi -b ETH,SOL
# Same with JSON output
node kiwi -b ETH,SOL --json
```

#### Cancel all open orders

```sh
node kiwi --cancel-open-orders
node kiwi -c
```

#### Swap all to USDC

Will swap every available asset (only >5USD balances) to master USD (right now USDC). Will use market limit order.

```sh
node kiwi --swap-all-usd
```

#### Buy with USDC with a limit order at market price

```sh
# swap 100% of available USDC to ETH
node kiwi --swap "USDC->ETH"
# swap 100% of available DOGE to USDC
node kiwi -s "DOGE->USDC"
```

### Building (dev)

```sh
yarn
yarn build
```
