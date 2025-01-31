import { Hono } from 'hono';
import { cors } from 'hono/cors';
import dotenv from 'dotenv';
import { serve } from '@hono/node-server';

dotenv.config();

const app = new Hono();

const PORT = Number(process.env.PORT ?? 3001);

app.use('*', cors());

// Root endpoint
app.get('/', (c) => {
  return c.text('emit HelloWorld();');
});

// Simple health check
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

// Liveness probe
app.get('/healthz', (c) => {
  return c.json({ status: 'ok' });
});

serve({
  fetch: app.fetch,
  port: PORT,
});

console.log(`Server is running on port: ${PORT}`);
