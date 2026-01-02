import { Request, Response, NextFunction } from 'express';
import { IAuthGetUserByIdUseCase } from 'src/domain/interfaces/use-cases/auth/user/IAuthGetUserByIdUseCase';
import { IRefreshTokenUseCase } from 'src/domain/interfaces/use-cases/auth/session/IRefreshTokenUseCase';
import { ITokenService } from 'src/domain/interfaces/services/ITokenService';
import { ICookieService } from 'src/presentation/interfaces/services/ICookieService';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { handleValidationError, handleAsyncError, validateUserId, sendSuccessResponse, sendErrorResponse } from 'src/shared/utils/presentation/controller.utils';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { env } from 'src/infrastructure/config/env';

export class TokenController {
  constructor(
    private readonly _refreshTokenUseCase: IRefreshTokenUseCase,
    private readonly _getUserByIdUseCase: IAuthGetUserByIdUseCase,
    private readonly _tokenService: ITokenService,
    private readonly _cookieService: ICookieService,
  ) {}

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const cookieName = env.COOKIE_NAME_REFRESH;
    const fromCookie = (req as Request & { cookies?: Record<string, string> }).cookies?.[cookieName];
    const refreshToken = fromCookie || req.body?.refreshToken;

    if (!refreshToken || typeof refreshToken !== 'string') {
      return handleValidationError('Invalid refresh token', next);
    }

    try {
      const result = await this._refreshTokenUseCase.execute(refreshToken);

      if (result.tokens) {
        this._cookieService.setRefreshToken(res, result.tokens.refreshToken);
        sendSuccessResponse(res, 'Token refreshed', result.user, result.tokens.accessToken);
      } else {
        sendSuccessResponse(res, 'Token refreshed', result.user, undefined);
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
        return handleValidationError('User not found', next);
      }

      if (user.isBlocked) {
        return sendErrorResponse(res, 'User account is blocked', null, 403);
      }

      const accessToken = this._tokenService.signAccess({ sub: user.id, role: user.role as UserRole });

      sendSuccessResponse(res, 'Authenticated', user, accessToken);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

