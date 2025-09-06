import { Router } from 'express';
import { MetricsController } from '../controllers/metrics.controller';

const router = Router();

/**
 * GET /metrics/basic
 * Returns basic platform metrics including:
 * - totalUsers: Total number of registered users
 * - totalNfts: Total number of NFTs created
 * - nftsOnSale: Number of NFTs currently listed for sale
 * - totalVolume: Total volume from all sale transactions
 */
router.get('/basic', (req, res, next) => 
  MetricsController.getBasicMetrics(req, res).catch(next)
);

export default router;
