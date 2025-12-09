import { Request, Response, NextFunction } from 'express';
import { LoginDto } from '../../../application/dto/auth/login.dto';
import { ILoginUserUseCase, IAdminLoginUseCase, IGoogleLoginUseCase } from '../../../domain/interfaces/use-cases/auth/IAuthUseCases';
import { handleValidationError, handleAsyncError, sendSuccessResponse } from '../../../shared/utils/controller.utils';
import { ICookieService } from '../../../domain/interfaces/services/ICookieService';

export class LoginController {
  constructor(
    private readonly _loginUserUseCase: ILoginUserUseCase,
    private readonly _adminLoginUseCase: IAdminLoginUseCase,
    private readonly _googleLoginUseCase: IGoogleLoginUseCase,
    private readonly _cookieService: ICookieService,
  ) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = LoginDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError('Invalid login credentials', next);
    }

    try {
      const result = await this._loginUserUseCase.execute(parsed.data.email, parsed.data.password);

      if (result.tokens) {
        this._cookieService.setRefreshToken(res, result.tokens.refreshToken);
        sendSuccessResponse(res, 'Login successful', result.user, result.tokens.accessToken);
      } else {
        sendSuccessResponse(res, 'Login successful, verification required', result.user, undefined);
      }
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = LoginDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError('Invalid login credentials', next);
    }

    try {
      const result = await this._adminLoginUseCase.execute(parsed.data.email, parsed.data.password);

      if (result.tokens) {
        this._cookieService.setRefreshToken(res, result.tokens.refreshToken);
        sendSuccessResponse(res, 'Admin login successful', result.user, result.tokens.accessToken);
      } else {
        sendSuccessResponse(res, 'Admin login successful', result.user, undefined);
      }
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { idToken } = req.body;
    if (!idToken || typeof idToken !== 'string' || idToken.length < 10) {
      return handleValidationError('Invalid Google token', next);
    }

    try {
      const result = await this._googleLoginUseCase.execute(idToken);

      if (result.tokens) {
        this._cookieService.setRefreshToken(res, result.tokens.refreshToken);
        sendSuccessResponse(res, 'Login successful', result.user, result.tokens.accessToken);
      } else {
        sendSuccessResponse(res, 'Login successful', result.user, undefined);
      }
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}