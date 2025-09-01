import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/errors';

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: 'Not Found' });
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
}