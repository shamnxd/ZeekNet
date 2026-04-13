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
  ACTION: (action: string) => `${action} successful`,
  OPERATION_SUCCESS: 'Operation completed successfully',
} as const;


/**
 * Common error messages
 */
export const ERROR = {
  INTERNAL_SERVER: 'An unexpected error occurred',
  NOT_FOUND: (entity: string) => `${entity} not found`,
  FAILED_TO: (action: string) => `Failed to ${action}`,
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Access denied',
  ALREADY_EXISTS: (entity: string) => `${entity} already exists`,
  NOT_IMPLEMENTED: 'Method not implemented',
  INVALID_SIGNATURE: 'Invalid signature verification failed',
  FILE_PROCESSING_ERROR: 'File processing error',
  MISSING_TOKEN: 'Missing or invalid token',
  INVALID_TOKEN: 'Invalid or expired token',
} as const;

export const COMPANY = {
  USER_ID_REQUIRED: 'User ID is required',
  ONLY_REJECTED_CAN_REAPPLY: 'Only rejected companies can reapply for verification',
  FAILED_TO_RETRIEVE_UPDATED_PROFILE: 'Failed to retrieve updated profile',
} as const;

export const TECHNICAL_TASK = {
  CANNOT_MARK_CANCELLED_AS_COMPLETED: 'Cannot mark a cancelled task as completed',
  CANNOT_CANCEL_COMPLETED: 'Cannot cancel a completed task',
  CANNOT_CANCEL_UNDER_REVIEW: 'Cannot cancel a task that is already under review',
  RATING_ALREADY_SUBMITTED: 'Technical task rating has already been submitted',
  FEEDBACK_ALREADY_SUBMITTED: 'Technical task feedback has already been submitted',
} as const;

/**
 * Subscription related messages
 */
export const SUBSCRIPTION = {
  NO_ACTIVE_SUBSCRIPTION: 'No active subscription found. Please subscribe to a plan to continue.',
  LIMIT_EXCEEDED: (limit: number, type: string) => `You have reached your ${type} limit of ${limit}. Please upgrade your plan.`,
} as const;



/**
 * Module specific messages
 */
export const AUTH = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_BLOCKED: 'User account is blocked. Please contact support for assistance.',
  OTP_SENT: 'OTP sent successfully',
  OTP_VERIFIED: 'OTP verified successfully',
  OTP_WAIT: 'Please wait before requesting another OTP',
  ALREADY_VERIFIED: 'User already verified',
  PASSWORD_RESET_SENT: 'Password reset link has been sent to your email.',
  VERIFICATION_REQUIRED: 'Verification required',
  REGISTRATION_SUCCESS: (entity: string) => `${entity} registered successfully. Please verify your email.`,
  ADMIN_REQUIRED: 'Admin access required',
} as const;





