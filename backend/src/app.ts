import cors from 'cors';
import 'dotenv/config.js';
import express from 'express';
import rateLimit from "express-rate-limit"
import { config } from './config';

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

app.use((_request, response) => {
  response.status(404).json({ error: 'Not found' });
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  response.status(500).json({ error: 'Internal server error' });
});

export default app;