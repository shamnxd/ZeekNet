import { Request, Response, NextFunction } from 'express';
import { IUserRepository } from '../../domain/interfaces/repositories/user/IUserRepository';
import { HttpStatus } from '../../domain/enums/http-status.enum';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    userId: string;
    email: string;
    role: string;
  };
}

export class UserBlockedMiddleware {
  constructor(
    private readonly _userRepository: IUserRepository,
  ) {}

  checkUserBlocked = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next();
      }

      const user = await this._userRepository.findById(userId);
      if (!user) {
        return next();
      }

      if (user.isBlocked) {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: 'User account is blocked. Please contact support for assistance.',
          data: null,
        });
        return;
      }


      next();
    } catch (error) {
      console.error('Error in user blocked middleware:', error);
      next(error);
    }
  };
}