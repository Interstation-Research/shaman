import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { prompt, shamanName }: { prompt: string; shamanName: string } =
    await req.json();

  const systemMessage = `
You are writing code for a decentralized execution environment called Shaman.

The Shaman is a decentralized execution environment that allows you to execute code on the blockchain.

The Shaman is named ${shamanName}.

It needs to run on Deno, and it needs to be able to fetch data from the internet.

Here is a sample code:
export default async (context: ShamanContext) => {
  const { fetch, publicClient, walletClient } = context;
  const { parseEther, encodeFunctionData } = await import('viem');

  // Fetch ETH price from CoinGecko
  const response = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
  );
  const priceData = await response.json();
  const ethPrice = priceData.ethereum.usd;

  // Contract addresses
  const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  const UNISWAP_V3_ROUTER = '0xE592427A0AEce92De3Edee1F18E0157C05861564';

  // Check if we have enough ETH
  const balance = await publicClient.getBalance({
    address: walletClient.account.address,
  });

  if (balance.lte(0)) {
    throw new Error('Insufficient ETH balance');
  }

  // Calculate amount of ETH to swap (0.1 ETH in this example)
  const amountIn = parseEther('0.1');
  
  // Encode the swap function call
  const swapData = encodeFunctionData({
    abi: [
      {
        inputs: [
          {
            internalType: 'struct ISwapRouter.ExactInputSingleParams',
            name: 'params',
            type: 'tuple',
            components: [
              { name: 'tokenIn', type: 'address' },
              { name: 'tokenOut', type: 'address' },
              { name: 'fee', type: 'uint24' },
              { name: 'recipient', type: 'address' },
              { name: 'deadline', type: 'uint256' },
              { name: 'amountIn', type: 'uint256' },
              { name: 'amountOutMinimum', type: 'uint256' },
              { name: 'sqrtPriceLimitX96', type: 'uint160' }
            ]
          }
        ],
        name: 'exactInputSingle',
        outputs: [{ name: 'amountOut', type: 'uint256' }],
        stateMutability: 'payable',
        type: 'function'
      }
    ],
    functionName: 'exactInputSingle',
    args: [{
      tokenIn: WETH_ADDRESS,
      tokenOut: USDC_ADDRESS,
      fee: 3000, // 0.3% fee tier
      recipient: walletClient.account.address,
      deadline: BigInt(Math.floor(Date.now() / 1000) + 1800), // 30 minutes from now
      amountIn,
      amountOutMinimum: BigInt(0), // Note: In production, calculate this based on price impact
      sqrtPriceLimitX96: BigInt(0)
    }]
  });

  // Execute the swap
  const tx = await walletClient.sendTransaction({
    to: UNISWAP_V3_ROUTER,
    data: swapData,
    value: amountIn,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });

  return {
    ethPrice,
    transactionHash: receipt.transactionHash,
    gasUsed: receipt.gasUsed.toString(),
  };
}

Your task is to write the code for the Shaman, described in the prompt.
`;

  const result = await generateObject({
    model: openai('gpt-4o-mini'),
    system: systemMessage,
    prompt: prompt,
    schema: z.object({
      code: z.string().describe('The code to be executed.'),
    }),
  });

  return result.toJsonResponse();
}
