import { Request, Response, NextFunction } from 'express';
import { AuthenticationError, AuthorizationError } from '../../domain/errors/errors';
import { JwtTokenService } from '../../infrastructure/security/jwt-token-service';

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role: string };
}

const tokenService = new JwtTokenService();

export function authenticateToken(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

  if (!token) {
    return next(new AuthenticationError('Missing access token'));
  }
  try {
    const payload = tokenService.verifyAccess(token);

    req.user = {
      id: payload.sub,
      email: payload.email || '',
      role: payload.role || 'seeker',
    };
    next();
  } catch (error) {
    next(new AuthenticationError('Invalid or expired token'));
  }
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

// Optional authentication - doesn't throw error if token is missing
export function optionalAuthentication(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

  if (!token) {
    // No token, continue without user info
    return next();
  }

  try {
    const payload = tokenService.verifyAccess(token);
    req.user = {
      id: payload.sub,
      email: payload.email || '',
      role: payload.role || 'seeker',
    };
    next();
  } catch (error) {
    // Invalid token, continue without user info
    next();
  }
}