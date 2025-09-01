import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import compression from 'compression';
import logger from 'http-req-logger';
import path from 'path';
import routes from './routes';
import { corsMiddleware } from './middleware/cors';
import { errorHandler, notFound } from './middleware/error';

export function createApp() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  app.use(morgan('dev'));
  app.use(compression());
  app.use(cookieParser());
  app.use(corsMiddleware);

  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.use(routes);

  app.use(notFound);
  app.use(errorHandler);
  logger();
  return app;
}