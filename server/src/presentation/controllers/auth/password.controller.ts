import { Request, Response, NextFunction } from 'express';
import { ILogoutUseCase } from 'src/domain/interfaces/use-cases/auth/session/ILogoutUseCase';
import { IResetPasswordUseCase } from 'src/domain/interfaces/use-cases/auth/password/IResetPasswordUseCase';
import { IForgotPasswordUseCase } from 'src/domain/interfaces/use-cases/auth/password/IForgotPasswordUseCase';
import { IChangePasswordUseCase } from 'src/domain/interfaces/use-cases/auth/password/IChangePasswordUseCase';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { formatZodErrors, handleAsyncError, handleValidationError, sendSuccessResponse, validateUserId } from 'src/shared/utils';
import { z } from 'zod';
import { ICookieService } from 'src/presentation/services/ICookieService';
import { SUCCESS, AUTH, VALIDATION } from 'src/shared/constants/messages';

export class PasswordController {
  constructor(
    private readonly _forgotPasswordUseCase: IForgotPasswordUseCase,
    private readonly _resetPasswordUseCase: IResetPasswordUseCase,
    private readonly _changePasswordUseCase: IChangePasswordUseCase,
    private readonly _logoutUseCase: ILogoutUseCase,
    private readonly _cookieService: ICookieService,
  ) { }


  // be - move zod schema to dtos
  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = z.object({
      email: z.string().email(VALIDATION.INVALID_EMAIL),
    }).safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      await this._forgotPasswordUseCase.execute(parsed.data.email);
      sendSuccessResponse(res, AUTH.PASSWORD_RESET_SENT, null);

    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = z.object({
      token: z.string().min(1, VALIDATION.REQUIRED('Token')),
      newPassword: z.string().min(6, VALIDATION.MIN_LENGTH('New password', 6)),
    }).safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      await this._resetPasswordUseCase.execute(parsed.data.token, parsed.data.newPassword);
      sendSuccessResponse(res, SUCCESS.UPDATED('Password'), null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  changePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const parsed = z.object({
      currentPassword: z.string().min(1, VALIDATION.REQUIRED('Current password')),
      newPassword: z.string().min(6, VALIDATION.MIN_LENGTH('New password', 6)),
    }).safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const userId = validateUserId(req);
      await this._changePasswordUseCase.execute(userId, parsed.data.currentPassword, parsed.data.newPassword);
      sendSuccessResponse(res, SUCCESS.UPDATED('Password'), null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      await this._logoutUseCase.execute(userId);
      this._cookieService.clearRefreshToken(res);
      sendSuccessResponse(res, AUTH.LOGOUT_SUCCESS, null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}


