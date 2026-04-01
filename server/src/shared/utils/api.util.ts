import { ValidationError } from 'src/domain/errors/errors';
import { ERROR } from 'src/shared/constants/messages';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  token?: string;
}

export const createSuccessResponse = <T>(message: string, data: T, token?: string): ApiResponse<T> => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  if (token) {
    response.token = token;
  }

  return response;
};

export const createErrorResponse = <T>(message: string, data: T = null as T): ApiResponse<T> => {
  return {
    success: false,
    message,
    data,
  };
};

export class ErrorHandler {
  static createValidationError(message: string): ValidationError {
    return new ValidationError(message);
  }

  static handleAsyncError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error(ERROR.INTERNAL_SERVER);
  }
}

