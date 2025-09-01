import { Request, Response } from 'express';
import { AuthService, signJWT } from '../services/auth.service';
import { config } from '../config';

export const AuthController = {
  async register(req: Request, res: Response) {
    const user = await AuthService.register(req.body);
    const token = signJWT((user as any).id.toString());
    res
      .cookie(config.cookieName, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: config.isProd,
      })
      .json(user);
  },

  async login(req: Request, res: Response) {
    const user = await AuthService.login(req.body);
    const token = signJWT((user as any).id.toString());
    res
      .cookie(config.cookieName, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: config.isProd,
      })
      .json(user);
  },

  async logout(_req: Request, res: Response) {
    res.clearCookie(config.cookieName).json({ ok: true });
  },

  async me(req: Request, res: Response) {
    const me = await AuthService.me((req as any).user.id);
    res.json(me);
  },

  async nonce(req: Request, res: Response) {
    const address = String(req.query.address || '').toLowerCase();
    const domain = req.headers.host || 'localhost';
    const uri = `${req.protocol}://${req.get('host')}`;
    const data = await AuthService.issueNonce(address, domain, uri);
    res.json(data);
  },

  async wallet(req: Request, res: Response) {
    const address = String(req.body.address || '').toLowerCase();
    const signature = String(req.body.signature || '');
    const domain = req.headers.host || 'localhost';
    const uri = `${req.protocol}://${req.get('host')}`;
    const user = await AuthService.walletLogin(address, signature, domain, uri);
    const token = signJWT((user as any).id.toString());
    res
      .cookie(config.cookieName, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: config.isProd,
      })
      .json(user);
  },
};