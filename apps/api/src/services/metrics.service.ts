import { User } from '../models/User';
import { NFT } from '../models/NFT';
import { Transaction } from '../models/Transaction';
import { HttpError } from '../utils/errors';

/**
 * Interface for basic metrics response
 */
export interface BasicMetrics {
  totalUsers: number;
  totalNfts: number;
  nftsOnSale: number;
  totalVolume: number;
}

/**
 * Service for handling metrics-related operations
 */
export const MetricsService = {
  /**
   * Get basic platform metrics
   * Uses efficient aggregation queries for optimal performance
   */
  async getBasicMetrics(): Promise<BasicMetrics> {
    try {
      // Execute all queries in parallel for optimal performance
      const [totalUsers, totalNfts, nftsOnSale, totalVolume] = await Promise.all([
        // Count total users
        User.countDocuments(),
        
        // Count total NFTs
        NFT.countDocuments(),
        
        // Count NFTs currently on sale
        NFT.countDocuments({ onSale: true }),
        
        // Calculate total volume from sale transactions
        Transaction.aggregate([
          {
            $match: {
              type: 'sale',
              price: { $exists: true, $ne: null }
            }
          },
          {
            $group: {
              _id: null,
              totalVolume: { $sum: '$price' }
            }
          }
        ]).then(result => result[0]?.totalVolume || 0)
      ]);

      return {
        totalUsers,
        totalNfts,
        nftsOnSale,
        totalVolume: Math.round(totalVolume * 100) / 100 // Round to 2 decimal places
      };
    } catch (error) {
      // Log error for debugging but don't expose internal details
      console.error('Error fetching basic metrics:', error);
      
      // Check if it's a database connection error
      if (error instanceof Error && error.message.includes('connection')) {
        throw HttpError.internalServerError('Service temporarily unavailable');
      }
      
      // Generic server error for other cases
      throw HttpError.internalServerError('Failed to fetch metrics');
    }
  }
};
