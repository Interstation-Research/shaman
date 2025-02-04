import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { getSystemPrompt } from '@/prompts/system';
import { objectManager } from '@/services/filebase';

interface ShamanRequest {
  prompt: string;
  shamanName: string;
  network: string;
  frequency: string;
  duration: number;
}

export async function POST(req: Request) {
  const { prompt, shamanName }: ShamanRequest = await req.json();
  const system = getSystemPrompt(shamanName);

  const result = await generateObject({
    model: openai('gpt-4o'),
    system,
    prompt,
    schema: z.object({
      code: z.string().describe('The code to be executed.'),
    }),
  });

  const code = await objectManager.upload(
    shamanName,
    Buffer.from(result.object.code),
    null,
    null
  );

  const metadata = {
    shamanName,
    prompt,
    code: code.cid,
    createdAt: new Date().toISOString(),
  };

  const upload = await objectManager.upload(
    shamanName,
    Buffer.from(JSON.stringify(metadata)),
    null,
    null
  );

  return Response.json({
    code: result.object.code,
    ipfs: upload.cid,
    metadata: metadata,
  });
}
