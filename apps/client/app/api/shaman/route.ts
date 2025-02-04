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
    model: openai('gpt-4o-mini'),
    system,
    prompt,
    schema: z.object({
      code: z.string().describe('The code to be executed.'),
    }),
  });

  const upload = await objectManager.upload(
    shamanName,
    Buffer.from(result.object.code),
    null,
    null
  );

  return Response.json({
    code: result.object.code,
    cid: upload.cid,
  });
}
