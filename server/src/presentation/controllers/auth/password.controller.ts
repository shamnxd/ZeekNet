import { Request, Response, NextFunction } from 'express';
import { ILogoutUseCase } from 'src/domain/interfaces/use-cases/auth/session/ILogoutUseCase';
import { IResetPasswordUseCase } from 'src/domain/interfaces/use-cases/auth/password/IResetPasswordUseCase';
import { IForgotPasswordUseCase } from 'src/domain/interfaces/use-cases/auth/password/IForgotPasswordUseCase';
import { IChangePasswordUseCase } from 'src/domain/interfaces/use-cases/auth/password/IChangePasswordUseCase';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { validateUserId, handleValidationError, sendSuccessResponse, handleAsyncError } from 'src/shared/utils/presentation/controller.utils';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';
import { z } from 'zod';
import { ICookieService } from 'src/presentation/services/ICookieService';

export class PasswordController {
  constructor(
    private readonly _forgotPasswordUseCase: IForgotPasswordUseCase,
    private readonly _resetPasswordUseCase: IResetPasswordUseCase,
    private readonly _changePasswordUseCase: IChangePasswordUseCase,
    private readonly _logoutUseCase: ILogoutUseCase,
    private readonly _cookieService: ICookieService,
  ) { }

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = z.object({
      email: z.string().email('Invalid email address'),
    }).safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      await this._forgotPasswordUseCase.execute(parsed.data.email);
      sendSuccessResponse(res, 'Password reset link has been sent to your email.', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = z.object({
      token: z.string().min(1, 'Token is required'),
      newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    }).safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      await this._resetPasswordUseCase.execute(parsed.data.token, parsed.data.newPassword);
      sendSuccessResponse(res, 'Password has been reset successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  changePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = z.object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    }).safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const userId = validateUserId(req);
      await this._changePasswordUseCase.execute(userId, parsed.data.currentPassword, parsed.data.newPassword);
      sendSuccessResponse(res, 'Password has been updated successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      await this._logoutUseCase.execute(userId);
      this._cookieService.clearRefreshToken(res);
      sendSuccessResponse(res, 'Logged out', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

