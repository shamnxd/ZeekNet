import { Response, NextFunction } from 'express';
import { AuthenticationError, AuthorizationError } from 'src/domain/errors/errors';
import { JwtTokenService } from 'src/infrastructure/security/jwt-token-service';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { ITokenPayload } from 'src/domain/interfaces/services/ITokenService';

export { AuthenticatedRequest };




function extractBearerToken(authHeader?: string): string | undefined {
  return authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
}


function createUserContext(payload: ITokenPayload): AuthenticatedRequest['user'] {
  return {
    id: payload.sub,
    userId: payload.sub,
    email: payload.email || '',
    role: payload.role || 'seeker',
  };
}


export function createAuthenticationMiddleware(tokenService: JwtTokenService) {
  
  function authenticateToken(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      return next(new AuthenticationError('Missing access token'));
    }

    try {
      const payload = tokenService.verifyAccess(token);
      req.user = createUserContext(payload);
      next();
    } catch (error) {
      next(new AuthenticationError('Invalid or expired token'));
    }
  }

  
  function optionalAuthentication(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      return next();
    }

    try {
      const payload = tokenService.verifyAccess(token);
      req.user = createUserContext(payload);
      next();
    } catch (error) {
      
      next();
    }
  }

  return {
    authenticateToken,
    optionalAuthentication,
  };
}


export function authorizeRoles(...roles: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    const role = req.user?.role;
    
    if (!role || !roles.includes(role)) {
      return next(new AuthorizationError());
    }
    
    next();
  };
}



const tokenService = new JwtTokenService();
const { authenticateToken, optionalAuthentication } = createAuthenticationMiddleware(tokenService);

export { authenticateToken, optionalAuthentication };
