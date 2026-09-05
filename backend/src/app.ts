import cors from 'cors';
import 'dotenv/config.js';
import express from 'express';
import rateLimit from "express-rate-limit"
import path from 'node:path';
import { config } from './config.js';
import { createRepositoryFactory } from './domain/repositories/factory.js';
import { supabase } from './infrastructure/persistence/supabase.js';
import { SupabaseBmkgCache } from './infrastructure/cache/supabase-bmkg-cache.js';
import { BmkgAdapter } from './infrastructure/bmkg/bmkg-adapter.js';
import { requireAuth } from './shared/auth.js';
import { createApiRouter } from './routes/api.js';

const app = express();

app.set('trust proxy', 1);

app.disable('x-powered-by');
app.use(
  cors({
    origin: config.clientOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: '100kb' }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
  }),
);

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/docs', (_request, response) => {
  response.json({
    title: 'RembukTani M2 API',
    openapi: '/api/openapi.yaml',
    description: 'Authenticated API for land, evidence, assessment, review, human decision, and deterministic brief workflows.',
  });
});
app.get('/api/openapi.yaml', (_request, response) => {
  response.sendFile(path.resolve(process.cwd(), 'docs', 'openapi.yaml'));
});

app.use(
  '/api',
  requireAuth(supabase),
  createApiRouter(createRepositoryFactory(supabase), {
    bmkgAdapter: new BmkgAdapter(undefined, new SupabaseBmkgCache(supabase, config.bmkgCacheTtlMinutes)),
  }),
);

app.use((_request, response) => {
  response.status(404).json({ error: 'Not found' });
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  response.status(500).json({ error: 'Internal server error' });
});

export default app;