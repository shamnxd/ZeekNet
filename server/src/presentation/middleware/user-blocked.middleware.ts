import { Request, Response, NextFunction } from 'express';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { HttpStatus } from 'src/domain/enums/http-status.enum';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { sendForbiddenResponse } from 'src/shared/utils/presentation/controller.utils';


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
        sendForbiddenResponse(res, 'User account is blocked. Please contact support for assistance.');
        return;
      }


      next();
    } catch (error) {
      console.error('Error in user blocked middleware:', error);
      next(error);
    }
  };
}

