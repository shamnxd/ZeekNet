import { Response, NextFunction } from 'express';
import { createSuccessResponse, createErrorResponse } from './response.utils';
import { ErrorHandler } from './error.utils';
import { AuthenticatedRequest } from '../types/authenticated-request';

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

export function sendSuccessResponse<T>(res: Response, message: string, data: T, token?: string, statusCode: number = 200): void {
  res.status(statusCode).json(createSuccessResponse(message, data, token));
}

export function sendErrorResponse<T>(res: Response, message: string, data: T = null as T, statusCode: number = 400): void {
  res.status(statusCode).json(createErrorResponse(message, data));
}

export function sendNotFoundResponse(res: Response, message: string): void {
  res.status(404).json(createErrorResponse(message, null));
}

export function success<T>(res: Response, data: T, message: string, statusCode: number = 200): void {
  sendSuccessResponse(res, message, data, undefined, statusCode);
}

export function created<T>(res: Response, data: T, message: string): void {
  sendSuccessResponse(res, message, data, undefined, 201);
}

export function unauthorized(res: Response, message: string): void {
  sendErrorResponse(res, message, null, 401);
}

export function badRequest(res: Response, message: string): void {
  sendErrorResponse(res, message, null, 400);
}

export function handleError(res: Response, error: unknown): void {
  console.error('Controller error:', error);

  if (error && typeof error === 'object' && 'statusCode' in error && 'message' in error) {
    sendErrorResponse(res, (error as { message: string }).message, null, (error as { statusCode: number }).statusCode);
  } else if (error instanceof Error) {
    sendErrorResponse(res, error.message, null, 500);
  } else {
    sendErrorResponse(res, 'Internal server error', null, 500);
  }
}