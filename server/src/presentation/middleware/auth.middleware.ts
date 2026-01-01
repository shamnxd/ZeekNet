import { Response, NextFunction } from 'express';
import { AuthenticationError, AuthorizationError } from '../../domain/errors/errors';
import { JwtTokenService } from '../../infrastructure/security/jwt-token-service';
import { AuthenticatedRequest } from '../../shared/types/authenticated-request';

export { AuthenticatedRequest };

/**
 * Authentication Middleware
 * 
 * Single Responsibility: Verify JWT tokens and populate user context
 * 
 * Refactored to follow SRP:
 * - Extracted token extraction logic
 * - Extracted user context creation logic
 * - Removed code duplication
 * - Uses dependency injection for token service
 */

/**
 * Extract Bearer token from Authorization header
 */
function extractBearerToken(authHeader?: string): string | undefined {
  return authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
}

/**
 * Create user context from JWT payload
 */
function createUserContext(payload: any): AuthenticatedRequest['user'] {
  return {
    id: payload.sub,
    userId: payload.sub,
    email: payload.email || '',
    role: payload.role || 'seeker',
  };
}

/**
 * Authentication Middleware Factory
 * 
 * Creates authentication middleware with injected token service
 * This allows for better testability and follows DIP
 */
export function createAuthenticationMiddleware(tokenService: JwtTokenService) {
  /**
   * Authenticate Token Middleware
   * 
   * Verifies JWT token and populates req.user
   * Returns 401 if token is missing or invalid
   */
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

  /**
   * Optional Authentication Middleware
   * 
   * Verifies JWT token if present, but allows request to continue if missing
   * Useful for endpoints that work for both authenticated and anonymous users
   */
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
      // Invalid token is ignored for optional authentication
      next();
    }
  }

  return {
    authenticateToken,
    optionalAuthentication,
  };
}

/**
 * Authorization Middleware Factory
 * 
 * Single Responsibility: Check user roles
 * Separated from authentication to follow SRP
 */
export function authorizeRoles(...roles: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    const role = req.user?.role;
    
    if (!role || !roles.includes(role)) {
      return next(new AuthorizationError());
    }
    
    next();
  };
}

// Default instance for backward compatibility
// TODO: Refactor to use DI container instead of singleton
const tokenService = new JwtTokenService();
const { authenticateToken, optionalAuthentication } = createAuthenticationMiddleware(tokenService);

export { authenticateToken, optionalAuthentication };
