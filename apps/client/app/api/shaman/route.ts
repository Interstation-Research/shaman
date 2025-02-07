import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { getSystemPrompt } from '@/prompts/system';
import { objectManager } from '@/services/filebase';

interface ShamanRequest {
  prompt: string;
  network: string;
  frequency: string;
  duration: number;
}

export async function POST(req: Request) {
  const { prompt }: ShamanRequest = await req.json();
  const system = getSystemPrompt();

  const result = await generateObject({
    model: openai('gpt-4o'),
    system,
    prompt,
    schema: z.object({
      code: z.string().describe('The code to be executed.'),
    }),
  });

  const encodedCode = Buffer.from(result.object.code, 'utf-8').toString(
    'base64'
  );

  const shamanId = uuidv4();

  const metadata = {
    shamanId,
    prompt,
    code: encodedCode,
    createdAt: new Date().toISOString(),
  };

  const upload = await objectManager.upload(
    shamanId,
    Buffer.from(JSON.stringify(metadata)),
    null,
    null
  );

  return Response.json({
    code: result.object.code,
    ipfs: upload.cid,
    metadata,
  });
}
