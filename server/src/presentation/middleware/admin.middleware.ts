import { Request, Response, NextFunction } from 'express';
import { AuthenticationError, AuthorizationError } from 'src/domain/errors/errors';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { AUTH, ERROR } from 'src/shared/constants/messages';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    userId: string;
    email: string;
    role: UserRole;
  };
}

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const user = req.user;
    if (!user) {
      throw new AuthenticationError(ERROR.UNAUTHORIZED);
    }

    if (user.role !== UserRole.ADMIN) {
      throw new AuthorizationError(AUTH.ADMIN_REQUIRED);
    }

    next();
  } catch (error) {
    next(error);
  }
};

