import jwt, { SignOptions } from 'jsonwebtoken';
import { ITokenPayload, ITokenService } from '../../domain/interfaces/services/ITokenService';
import { env } from '../config/env';

export class JwtTokenService implements ITokenService {
  signAccess(payload: ITokenPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    } as SignOptions);
  }

  signRefresh(payload: ITokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    } as SignOptions);
  }

  verifyAccess(token: string): ITokenPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as ITokenPayload;
  }

  verifyRefresh(token: string): ITokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as ITokenPayload;
  }
}
