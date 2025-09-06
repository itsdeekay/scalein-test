import { ZodSchema, ZodError } from 'zod';
import { HttpError } from './errors';

/**
 * Parse and validate data using a Zod schema
 * Provides detailed error messages for validation failures
 * 
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @param context - Optional context for error messages (e.g., 'request body', 'URL parameters')
 * @returns Validated data
 */
export function parse<T>(schema: ZodSchema<T>, data: unknown, context: string = 'input'): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.issues.map((err) => {
        const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
        return `${path}${err.message}`;
      });
      throw HttpError.badRequest(`Validation failed for ${context}: ${errorMessages.join(', ')}`);
    }
    throw HttpError.badRequest(`Invalid ${context}`);
  }
}

/**
 * Parse and validate request body data using a Zod schema
 * Convenience function for request body validation
 */
export function parseBody<T>(schema: ZodSchema<T>, data: unknown): T {
  return parse(schema, data, 'request body');
}

/**
 * Parse and validate URL parameters using a Zod schema
 * Convenience function for parameter validation
 */
export function parseParams<T>(schema: ZodSchema<T>, data: unknown): T {
  return parse(schema, data, 'URL parameters');
}