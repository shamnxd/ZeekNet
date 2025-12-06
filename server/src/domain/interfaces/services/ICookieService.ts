import { Response } from 'express';

export interface ICookieService {
  setRefreshToken(res: Response, token: string): void;
  clearRefreshToken(res: Response): void;
}

