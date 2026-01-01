import { Response } from 'express';
import { env } from 'src/infrastructure/config/env';
import { ICookieService } from 'src/presentation/interfaces/services/ICookieService';

export class CookieService implements ICookieService {
  private readonly _cookieName: string = env.COOKIE_NAME_REFRESH;

  private readonly _refreshTokenCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    path: '/',
  };

  private readonly _logoutCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 0,
    path: '/',
  };

  setRefreshToken(res: Response, token: string): void {
    res.cookie(this._cookieName, token, this._refreshTokenCookieOptions);
  }

  clearRefreshToken(res: Response): void {
    res.clearCookie(this._cookieName, this._logoutCookieOptions);
  }
}

