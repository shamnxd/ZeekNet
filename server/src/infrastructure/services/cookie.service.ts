import { Response } from 'express';
import { env } from '../config/env';
import { ICookieService, CookieOptions } from 'src/domain/interfaces/services/ICookieService';

export class CookieService implements ICookieService {
  private getRefreshTokenCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    };
  }

  private getLogoutCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    };
  }

  setRefreshToken(res: Response, token: string): void {
    const cookieName = env.COOKIE_NAME_REFRESH;
    if (!cookieName) {
      throw new Error('COOKIE_NAME_REFRESH is not configured');
    }
    res.cookie(cookieName, token, this.getRefreshTokenCookieOptions());
  }

  clearRefreshToken(res: Response): void {
    const cookieName = env.COOKIE_NAME_REFRESH;
    if (!cookieName) {
      throw new Error('COOKIE_NAME_REFRESH is not configured');
    }
    res.clearCookie(cookieName, this.getLogoutCookieOptions());
  }

  getRefreshTokenCookieName(): string {
    const cookieName = env.COOKIE_NAME_REFRESH;
    if (!cookieName) {
      throw new Error('COOKIE_NAME_REFRESH is not configured');
    }
    return cookieName;
  }
}

