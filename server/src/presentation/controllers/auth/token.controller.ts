import { env } from 'src/infrastructure/config/env';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { IAuthGetUserByIdUseCase } from 'src/domain/interfaces/use-cases/auth/user/IAuthGetUserByIdUseCase';
import { IRefreshTokenUseCase } from 'src/domain/interfaces/use-cases/auth/session/IRefreshTokenUseCase';
import { ITokenService } from 'src/domain/interfaces/services/ITokenService';
import { ICookieService } from 'src/presentation/services/ICookieService';
import { handleValidationError, handleAsyncError, validateUserId, sendSuccessResponse, sendErrorResponse } from 'src/shared/utils';
import { SUCCESS, AUTH, ERROR } from 'src/shared/constants/messages';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class TokenController {
  constructor(
    @inject(TYPES.RefreshTokenUseCase) private readonly _refreshTokenUseCase: IRefreshTokenUseCase,
    @inject(TYPES.GetUserByIdUseCase) private readonly _getUserByIdUseCase: IAuthGetUserByIdUseCase,
    @inject(TYPES.TokenService) private readonly _tokenService: ITokenService,
    @inject(TYPES.CookieService) private readonly _cookieService: ICookieService,
  ) { }


  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const cookieName = env.COOKIE_NAME_REFRESH;
    const fromCookie = (req as Request & { cookies?: Record<string, string> }).cookies?.[cookieName];
    const refreshToken = fromCookie || req.body?.refreshToken;

    if (!refreshToken || typeof refreshToken !== 'string') {
      return handleValidationError(AUTH.INVALID_CREDENTIALS, next);
    }

    try {
      const result = await this._refreshTokenUseCase.execute(refreshToken);

      if (result.tokens) {
        this._cookieService.setRefreshToken(res, result.tokens.refreshToken);
        sendSuccessResponse(res, SUCCESS.ACTION('Token refresh'), result.user, result.tokens.accessToken);
      } else {
        sendSuccessResponse(res, SUCCESS.ACTION('Token refresh'), result.user, undefined);
      }
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  checkAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const user = await this._getUserByIdUseCase.execute(userId);

      if (!user) {
        return handleValidationError(ERROR.NOT_FOUND('User'), next);
      }

      if (user.isBlocked) {
        return sendErrorResponse(res, AUTH.ACCOUNT_BLOCKED, null, 403);
      }

      const accessToken = this._tokenService.signAccess({ sub: user.id, role: user.role as UserRole });

      sendSuccessResponse(res, SUCCESS.ACTION('Authentication check'), user, accessToken);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}


