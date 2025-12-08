import { Request, Response, NextFunction } from 'express';
import { RefreshTokenDto } from '../../../application/dto/auth/refresh-token.dto';
import { IRefreshTokenUseCase, IAuthGetUserByIdUseCase } from '../../../domain/interfaces/use-cases/auth/IAuthUseCases';
import { ITokenService } from '../../../domain/interfaces/services/ITokenService';
import { ICookieService } from '../../../domain/interfaces/services/ICookieService';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import { handleValidationError, handleAsyncError, validateUserId, sendSuccessResponse, sendErrorResponse } from '../../../shared/utils/controller.utils';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { env } from '../../../infrastructure/config/env';

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

    const parsed = fromCookie ? { success: true, data: { refreshToken: fromCookie } } : RefreshTokenDto.safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError('Invalid refresh token', next);
    }

    try {
      const result = await this._refreshTokenUseCase.execute(parsed.data.refreshToken);

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