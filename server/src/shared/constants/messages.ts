/**
 * Validation Constraints (Used primarily in Zod DTOs)
 */
export const VALIDATION = {
  REQUIRED: (field: string) => `${field} is required`,
  INVALID_EMAIL: 'Please enter a valid email address',
  MIN_LENGTH: (field: string, min: number) => `${field} must be at least ${min} characters`,
  MAX_LENGTH: (field: string, max: number) => `${field} must be less than ${max} characters`,
  INVALID_URL: (field: string) => `Invalid ${field} URL`,
  POSITIVE_NUMBER: (field: string) => `${field} must be positive`,
  INVALID_ENUM: (field: string) => `Invalid ${field} value`,
  PASSWORD_STRENGTH: 'Password must be at least 6 characters',
} as const;

/**
 * Common success messages for Controllers
 */
export const SUCCESS = {
  RETRIEVED: (entity: string) => `${entity} retrieved successfully`,
  CREATED: (entity: string) => `${entity} created successfully`,
  UPDATED: (entity: string) => `${entity} updated successfully`,
  DELETED: (entity: string) => `${entity} deleted successfully`,
  OPERATION_SUCCESS: 'Operation completed successfully',
} as const;

/**
 * Common error messages
 */
export const ERROR = {
  INTERNAL_SERVER: 'An unexpected error occurred',
  NOT_FOUND: (entity: string) => `${entity} not found`,
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Access denied',
  ALREADY_EXISTS: (entity: string) => `${entity} already exists`,
} as const;

/**
 * Module specific messages
 */
export const AUTH = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_BLOCKED: 'User account is blocked. Contact support for assistance.',
  OTP_SENT: 'OTP sent successfully',
  OTP_VERIFIED: 'OTP verified successfully',
} as const;
