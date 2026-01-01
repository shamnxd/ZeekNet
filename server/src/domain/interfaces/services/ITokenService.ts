import { UserRole } from 'src/domain/enums/user-role.enum';

export interface ITokenPayload {
  sub: string;
  role?: UserRole;
  email?: string;
}

export interface ITokenService {
  signAccess(payload: ITokenPayload): string;
  signRefresh(payload: ITokenPayload): string;
  verifyAccess(token: string): ITokenPayload;
  verifyRefresh(token: string): ITokenPayload;
}
