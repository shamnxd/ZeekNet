import { Request, Response, NextFunction } from 'express';
import { IAuthGetUserByIdUseCase } from 'src/domain/interfaces/use-cases/auth/user/IAuthGetUserByIdUseCase';
import { HttpStatus } from 'src/domain/enums/http-status.enum';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { sendForbiddenResponse, validateUserId } from 'src/shared/utils/presentation/controller.utils';


export class UserBlockedMiddleware {
  constructor(
    private readonly _getUserByIdUseCase: IAuthGetUserByIdUseCase,
  ) { }

  checkUserBlocked = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const user = await this._getUserByIdUseCase.execute(userId);
      
      if (!user) {
        return next();
      }

      if (user.isBlocked) {
        sendForbiddenResponse(res, 'User account is blocked. Please contact support for assistance.');
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

