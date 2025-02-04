import { ObjectManager } from '@filebase/sdk';

export const objectManager = new ObjectManager(
  process.env.S3_KEY!,
  process.env.S3_SECRET!,
  {
    bucket: process.env.S3_BUCKET!,
  }
);
