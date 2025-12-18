import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { sendBadRequestResponse, sendInternalServerErrorResponse } from '../../shared/utils/controller.utils';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        sendBadRequestResponse(res, 'Validation failed', errorMessages);
        return;
      }

      sendInternalServerErrorResponse(res);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.query);
      req.query = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        sendBadRequestResponse(res, 'Query validation failed', errorMessages);
        return;
      }

      sendInternalServerErrorResponse(res);
    }
  };
};