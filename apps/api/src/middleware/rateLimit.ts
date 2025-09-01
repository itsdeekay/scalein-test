import { Request, Response, NextFunction } from 'express';

type Options = {
  windowMs: number;
  max: number;
  keyGenerator?: (req: Request) => string;
};

export function createRateLimiter(opts: Options) {
  const hits = new Map<string, { count: number; ts: number }>();
  const windowMs = opts.windowMs;
  const max = opts.max;
  const keyGen =
    opts.keyGenerator ||
    ((req: Request) => {
      const ip =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.ip ||
        'unknown';
      return `${ip}:${req.baseUrl}${req.path}`;
    });

  return function limiter(req: Request, res: Response, next: NextFunction) {
    const key = keyGen(req);
    const now = Date.now();
    const rec = hits.get(key);
    if (!rec || now - rec.ts > windowMs) {
      hits.set(key, { count: 1, ts: now });
      return next();
    }
    rec.count++;
    if (rec.count > max) {
      const retry = Math.ceil((rec.ts + windowMs - now) / 1000);
      res.setHeader('Retry-After', String(retry));
      return res
        .status(429)
        .json({ error: 'Too many requests. Please try again later.' });
    }
    next();
  };
}