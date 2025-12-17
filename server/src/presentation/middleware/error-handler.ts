import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../../domain/errors/errors';
import { ZodError } from 'zod';
import { HttpStatus } from '../../domain/enums/http-status.enum';

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof ZodError) {
    const first = error.issues[0];
    const err = new ValidationError(first?.message ?? 'Validation error', first?.path?.join('.') ?? undefined);
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: { field: err.field },
    });
    return;
  }
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ success: false, message: error.message });
    return;
  }
  const message = error instanceof Error ? error.message : 'Internal server error';
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message });
}