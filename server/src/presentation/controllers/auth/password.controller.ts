import { Request, Response, NextFunction } from 'express';
import { ILogoutUseCase } from 'src/domain/interfaces/use-cases/auth/session/ILogoutUseCase';
import { IResetPasswordUseCase } from 'src/domain/interfaces/use-cases/auth/password/IResetPasswordUseCase';
import { IForgotPasswordUseCase } from 'src/domain/interfaces/use-cases/auth/password/IForgotPasswordUseCase';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { extractUserId, handleValidationError, sendSuccessResponse, handleAsyncError } from 'src/shared/utils/presentation/controller.utils';
import { ICookieService } from 'src/presentation/interfaces/services/ICookieService';

export class PasswordController {
  constructor(
    private readonly _forgotPasswordUseCase: IForgotPasswordUseCase,
    private readonly _resetPasswordUseCase: IResetPasswordUseCase,
    private readonly _logoutUseCase: ILogoutUseCase,
    private readonly _cookieService: ICookieService,
  ) {}

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return handleValidationError('Invalid email address', next);
    }

    try {
      await this._forgotPasswordUseCase.execute(email);
      sendSuccessResponse(res, 'Password reset link has been sent to your email.', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token, newPassword } = req.body;
    if (!token || typeof token !== 'string') {
      return handleValidationError('Token is required', next);
    }
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return handleValidationError('New password must be at least 6 characters', next);
    }

    try {
      await this._resetPasswordUseCase.execute(token, newPassword);
      sendSuccessResponse(res, 'Password has been reset successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = extractUserId(req) ?? req.body?.userId;

      if (userId) {
        try {
          await this._logoutUseCase.execute(userId);
        } catch (_err) {}
      }

      this._cookieService.clearRefreshToken(res);
      sendSuccessResponse(res, 'Logged out', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

