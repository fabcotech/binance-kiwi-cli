## Binance Kiwi CLI

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

Coming soon

#### Swap all to USDC

Coming soon

#### Buy with USDC with a limit order at market price

Coming soon

### Building (dev)

```sh
yarn
yarn build
```
