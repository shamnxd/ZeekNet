import { Response, NextFunction } from 'express';
import { createSuccessResponse, createErrorResponse } from './response.utils';
import { ErrorHandler } from './error.utils';
import { AuthenticatedRequest } from '../../types/authenticated-request';
import { HttpStatus } from '../../../domain/enums/http-status.enum';

export function extractUserId(req: AuthenticatedRequest): string | null {
  return req.user?.id || null;
}

export function validateUserId(req: AuthenticatedRequest): string {
  const userId = extractUserId(req);
  if (!userId) {
    throw ErrorHandler.createValidationError('User ID not found');
  }
  return userId;
}

export function handleValidationError(message: string, next: NextFunction): void {
  next(ErrorHandler.createValidationError(message));
}

export function handleAsyncError(error: unknown, next: NextFunction): void {
  next(ErrorHandler.handleAsyncError(error));
}

export function sendSuccessResponse<T>(res: Response, message: string, data: T, token?: string, statusCode: number = HttpStatus.OK): void {
  res.status(statusCode).json(createSuccessResponse(message, data, token));
}

export function sendErrorResponse<T>(res: Response, message: string, data: T = null as T, statusCode: number = HttpStatus.BAD_REQUEST): void {
  res.status(statusCode).json(createErrorResponse(message, data));
}

export function sendNotFoundResponse(res: Response, message: string): void {
  res.status(HttpStatus.NOT_FOUND).json(createErrorResponse(message, null));
}

export function success<T>(res: Response, data: T, message: string, statusCode: number = HttpStatus.OK): void {
  sendSuccessResponse(res, message, data, undefined, statusCode);
}

export function created<T>(res: Response, data: T, message: string): void {
  sendSuccessResponse(res, message, data, undefined, HttpStatus.CREATED);
}

export function badRequest(res: Response, message: string): void {
  sendErrorResponse(res, message, null, HttpStatus.BAD_REQUEST);
}

export function handleError(res: Response, error: unknown): void {
  console.error('Controller error:', error);

  if (error && typeof error === 'object' && 'statusCode' in error && 'message' in error) {
    sendErrorResponse(res, (error as { message: string }).message, null, (error as { statusCode: number }).statusCode);
  } else if (error instanceof Error) {
    sendErrorResponse(res, error.message, null, HttpStatus.INTERNAL_SERVER_ERROR);
  } else {
    sendErrorResponse(res, 'Internal server error', null, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export function sendCreatedResponse<T>(res: Response, message: string, data: T): void {
  sendSuccessResponse(res, message, data, undefined, HttpStatus.CREATED);
}

export function sendBadRequestResponse<T>(res: Response, message: string, data?: T): void {
  sendErrorResponse(res, message, data, HttpStatus.BAD_REQUEST);
}

export function sendUnauthorizedResponse<T>(res: Response, message: string = 'Unauthorized', data?: T): void {
  sendErrorResponse(res, message, data, HttpStatus.UNAUTHORIZED);
}

export function sendForbiddenResponse<T>(res: Response, message: string = 'Forbidden', data?: T): void {
  sendErrorResponse(res, message, data, HttpStatus.FORBIDDEN);
}

export function sendConflictResponse<T>(res: Response, message: string, data?: T): void {
  sendErrorResponse(res, message, data, HttpStatus.CONFLICT);
}

export function sendInternalServerErrorResponse<T>(res: Response, message: string = 'Internal server error', data?: T): void {
  sendErrorResponse(res, message, data, HttpStatus.INTERNAL_SERVER_ERROR);
}

export function sendNoContentResponse(res: Response): void {
  res.status(HttpStatus.NO_CONTENT).send();
}

