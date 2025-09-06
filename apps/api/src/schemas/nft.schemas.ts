import { z } from 'zod';

/**
 * Schema for validating NFT listing requests
 * Ensures price is a positive number and properly formatted
 */
export const ListForSaleSchema = z.object({
  price: z
    .number('Price must be a number')
    .positive('Price must be a positive number')
    .finite('Price must be a finite number')
    .refine((val) => val > 0, {
      message: 'Price must be greater than 0',
    }),
});

/**
 * Schema for validating NFT ID parameter
 * Ensures the ID is a valid MongoDB ObjectId format
 */
export const NftIdSchema = z.object({
  id: z
    .string('NFT ID must be a string')
    .min(1, 'NFT ID cannot be empty')
    .regex(/^[0-9a-fA-F]{24}$/, 'NFT ID must be a valid MongoDB ObjectId'),
});

/**
 * Type definitions for the validated data
 */
export type ListForSaleInput = z.infer<typeof ListForSaleSchema>;
export type NftIdParams = z.infer<typeof NftIdSchema>;
