# Shaman Contracts

MUD smart contracts for the Shaman project.

## Token Economics

The ZugToken contract implements the following token economics:
- Total Max Supply: 1 billion tokens (1,000,000,000)
- Max Sale Supply: 10 million tokens (10,000,000)
- Decimals: 0 (whole numbers only)

## Prerequisites

- Foundry installed
- `.env` file configured with required environment variables

## Environment Variables

Make sure your `.env` file includes:

```env
PRIVATE_KEY=your_private_key
BASE_SEPOLIA_RPC_URL=your_base_sepolia_rpc
ARB_SEPOLIA_RPC_URL=your_arb_sepolia_rpc
WORLD_ADDRESS=your_world_address # only for ZugToken actions
```

## Deployment

To deploy the contracts:

```bash
# For initial deployment
./tasks/deploy.sh deploy arb-sepolia

# For upgrading existing deployment
./tasks/deploy.sh upgrade arb-sepolia

# For contract verification
./tasks/deploy.sh verify arb-sepolia
```

## Running Scripts

### Enable Token Sale

To enable the token sale functionality:

```bash
source .env && forge script script/SetSaleActive.s.sol --rpc-url ${ARB_SEPOLIA_RPC_URL} --broadcast --private-key ${PRIVATE_KEY} -vvvv
```

### Verify ZugToken Contract

To verify the ZugToken contract on Arbitrum Sepolia:

```bash
source .env && forge verify-contract --chain-id 421614 --num-of-optimizations 200 --watch --constructor-args $(cast abi-encode "constructor(uint256,uint256)" "1000000000" "10000000") 0x04B8aeE9ce061886c83B4aF8751790C76D4444C1 src/ZugToken.sol:ZugToken --etherscan-api-key ${ARB_ETHERSCAN_KEY} --verifier-url "https://api-sepolia.arbiscan.io/api"
```

Note: Replace the constructor args and contract address as needed for different deployments.
