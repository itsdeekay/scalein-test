import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { createRateLimiter } from '../middleware/rateLimit';
import { requireAuth } from '../middleware/auth';

const router = Router();
const authLimiter = createRateLimiter({ windowMs: 60_000, max: 30 });
router.use(authLimiter);

router.post('/register', (req, res, next) => AuthController.register(req, res).catch(next));
router.post('/login', (req, res, next) => AuthController.login(req, res).catch(next));
router.post('/logout', (req, res, next) => AuthController.logout(req, res).catch(next));
router.get('/me', requireAuth, (req, res, next) => AuthController.me(req, res).catch(next));
router.get('/nonce', (req, res, next) => AuthController.nonce(req, res).catch(next));
router.post('/wallet', (req, res, next) => AuthController.wallet(req, res).catch(next));

export default router;