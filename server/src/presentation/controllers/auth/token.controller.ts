import { Request, Response, NextFunction } from 'express';
import { RefreshTokenDto } from '../../../application/dto/auth/refresh-token.dto';
import { IRefreshTokenUseCase, IAuthGetUserByIdUseCase } from '../../../domain/interfaces/use-cases/IAuthUseCases';
import { ITokenService } from '../../../domain/interfaces/services/ITokenService';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import { handleValidationError, handleAsyncError, validateUserId, sendSuccessResponse, sendErrorResponse } from '../../../shared/utils/controller.utils';
import { createRefreshTokenCookieOptions } from '../../../shared/utils/cookie.utils';
import { env } from '../../../infrastructure/config/env';
import { UserRole } from '../../../domain/enums/user-role.enum';

export class TokenController {
  constructor(
    private readonly _refreshTokenUseCase: IRefreshTokenUseCase,
    private readonly _getUserByIdUseCase: IAuthGetUserByIdUseCase,
    private readonly _tokenService: ITokenService,
  ) {}

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const cookieName = env.COOKIE_NAME_REFRESH || 'refresh_token';
    const fromCookie = (req as Request & { cookies?: Record<string, string> }).cookies?.[cookieName];

    const parsed = fromCookie ? { success: true, data: { refreshToken: fromCookie } } : RefreshTokenDto.safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError('Invalid refresh token', next);
    }

    try {
      const result = await this._refreshTokenUseCase.execute(parsed.data.refreshToken);

      if (result.tokens) {
        res.cookie(env.COOKIE_NAME_REFRESH!, result.tokens.refreshToken, createRefreshTokenCookieOptions());
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