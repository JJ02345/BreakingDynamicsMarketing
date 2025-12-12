// Validators - Wrapper functions for Zod schemas
import type { ZodSchema, ZodError } from 'zod';
import type { ValidationResult, ValidationError } from '../types';

/**
 * Validate data against a Zod schema
 */
export function validate<T>(
  data: unknown,
  schema: ZodSchema<T>
): ValidationResult<T> {
  try {
    const result = schema.safeParse(data);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    }

    return {
      success: false,
      errors: formatZodErrors(result.error),
    };
  } catch (error) {
    console.error('[Validation] Unexpected error:', error);
    return {
      success: false,
      errors: [
        {
          field: 'unknown',
          message: 'An unexpected validation error occurred',
          code: 'VALIDATION_ERROR',
        },
      ],
    };
  }
}

/**
 * Validate and throw if invalid (for use in async handlers)
 */
export function validateOrThrow<T>(data: unknown, schema: ZodSchema<T>): T {
  const result = validate(data, schema);

  if (!result.success) {
    const errorMessage = result.errors
      ?.map((e) => `${e.field}: ${e.message}`)
      .join(', ');
    throw new Error(`Validation failed: ${errorMessage}`);
  }

  return result.data as T;
}

/**
 * Format Zod errors into our standard format
 */
function formatZodErrors(error: ZodError): ValidationError[] {
  return error.errors.map((err) => ({
    field: err.path.join('.') || 'value',
    message: err.message,
    code: err.code,
  }));
}

/**
 * Check if a value passes validation
 */
export function isValid<T>(data: unknown, schema: ZodSchema<T>): data is T {
  return validate(data, schema).success;
}

/**
 * Get first error message from validation result
 */
export function getFirstError(result: ValidationResult): string | null {
  if (result.success || !result.errors || result.errors.length === 0) {
    return null;
  }
  return result.errors[0].message;
}

/**
 * Get all error messages as a map (field -> message)
 */
export function getErrorMap(
  result: ValidationResult
): Record<string, string> {
  if (result.success || !result.errors) {
    return {};
  }

  const map: Record<string, string> = {};
  for (const error of result.errors) {
    if (!map[error.field]) {
      map[error.field] = error.message;
    }
  }
  return map;
}
