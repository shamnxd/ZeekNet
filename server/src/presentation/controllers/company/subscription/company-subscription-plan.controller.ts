import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { IGetAllSubscriptionPlansUseCase } from 'src/domain/interfaces/use-cases/admin/subscription/IGetAllSubscriptionPlansUseCase';
import { handleAsyncError, sendSuccessResponse } from 'src/shared/utils';
import { SUCCESS } from 'src/shared/constants/messages';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class CompanySubscriptionPlanController {
  constructor(@inject(TYPES.GetAllSubscriptionPlansUseCase) private readonly _getAllSubscriptionPlansUseCase: IGetAllSubscriptionPlansUseCase) { }

  getActiveSubscriptionPlans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this._getAllSubscriptionPlansUseCase.execute({ isActive: true });
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Subscription plans'), result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

