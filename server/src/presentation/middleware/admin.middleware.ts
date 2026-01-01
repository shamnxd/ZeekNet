import { Request, Response, NextFunction } from 'express';
import { AuthenticationError, AuthorizationError } from '../../domain/errors/errors';
import { UserRole } from '../../domain/enums/user-role.enum';

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
      throw new AuthenticationError('Authentication required');
    }

    if (user.role !== UserRole.ADMIN) {
      throw new AuthorizationError('Admin access required');
    }

    next();
  } catch (error) {
    next(error);
  }
};
