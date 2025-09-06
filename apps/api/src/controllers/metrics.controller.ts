import { Request, Response } from 'express';
import { MetricsService } from '../services/metrics.service';
import { HttpError } from '../utils/errors';

/**
 * Controller for handling metrics-related HTTP requests
 */
export const MetricsController = {
  /**
   * Get basic platform metrics
   * GET /metrics/basic
   */
  async getBasicMetrics(req: Request, res: Response) {
    try {
      const metrics = await MetricsService.getBasicMetrics();
      res.json(metrics);
    } catch (error: any) {
      // Error handling is done in the service layer with proper HTTP status codes
      throw error;
    }
  }
};
