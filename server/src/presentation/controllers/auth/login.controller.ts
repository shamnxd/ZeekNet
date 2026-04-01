import { Request, Response, NextFunction } from 'express';
import { LoginDto } from 'src/application/dtos/auth/session/login.dto';
import { GoogleLoginDto } from 'src/application/dtos/auth/session/google-login.dto';
import { ILoginUserUseCase } from 'src/domain/interfaces/use-cases/auth/session/ILoginUserUseCase';
import { IAdminLoginUseCase } from 'src/domain/interfaces/use-cases/auth/session/IAdminLoginUseCase';
import { IGoogleLoginUseCase } from 'src/domain/interfaces/use-cases/auth/session/IGoogleLoginUseCase';
import { ICookieService } from 'src/presentation/services/ICookieService';
import { formatZodErrors, handleAsyncError, handleValidationError, sendSuccessResponse } from 'src/shared/utils';
import { AUTH } from 'src/shared/constants/messages';

export class LoginController {
  constructor(
    private readonly _loginUserUseCase: ILoginUserUseCase,
    private readonly _adminLoginUseCase: IAdminLoginUseCase,
    private readonly _googleLoginUseCase: IGoogleLoginUseCase,
    private readonly _cookieService: ICookieService,
  ) { }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = LoginDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._loginUserUseCase.execute(parsed.data);

      if (result.tokens) {
        this._cookieService.setRefreshToken(res, result.tokens.refreshToken);
        sendSuccessResponse(res, AUTH.LOGIN_SUCCESS, result.user, result.tokens.accessToken);
      } else {
        sendSuccessResponse(res, `${AUTH.LOGIN_SUCCESS}. ${AUTH.VERIFICATION_REQUIRED}`, result.user);
      }
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = LoginDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._adminLoginUseCase.execute(parsed.data);

      if (result.tokens) {
        this._cookieService.setRefreshToken(res, result.tokens.refreshToken);
        sendSuccessResponse(res, AUTH.LOGIN_SUCCESS, result.user, result.tokens.accessToken);
      } else {
        sendSuccessResponse(res, AUTH.LOGIN_SUCCESS, result.user);
      }
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = GoogleLoginDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._googleLoginUseCase.execute(parsed.data);

      if (result.tokens) {
        this._cookieService.setRefreshToken(res, result.tokens.refreshToken);
        sendSuccessResponse(res, AUTH.LOGIN_SUCCESS, result.user, result.tokens.accessToken);
      } else {
        sendSuccessResponse(res, AUTH.LOGIN_SUCCESS, result.user);
      }
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}



