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
  const { fetch } = context;
  const response = await fetch('https://coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&order=market_cap_by_total_volume&per_page=100&page=1&sparkline=false&price_change_percentage=24h&locale=en');
  const data = await response.json();

  return data;
}

Your task is to write the code for the Shaman, described in the prompt.
`;

  const result = await generateObject({
    model: openai('gpt-4'),
    system: systemMessage,
    prompt: prompt,
    schema: z.object({
      code: z.string().describe('The code to be executed.'),
    }),
  });

  return result.toJsonResponse();
}
