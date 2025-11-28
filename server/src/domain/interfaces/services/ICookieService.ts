import { Response } from 'express';

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  maxAge: number;
  path: string;
}

export interface ICookieService {
  setRefreshToken(res: Response, token: string): void;
  clearRefreshToken(res: Response): void;
  getRefreshTokenCookieName(): string;
}

