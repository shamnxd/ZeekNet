import { Request, Response, NextFunction } from 'express';
import { IGetAllSubscriptionPlansUseCase } from 'src/domain/interfaces/use-cases/subscriptions/IGetAllSubscriptionPlansUseCase';
import { handleAsyncError, sendSuccessResponse } from '../../../shared/utils/presentation/controller.utils';

export class CompanySubscriptionPlanController {
  constructor(
    private readonly _getAllSubscriptionPlansUseCase: IGetAllSubscriptionPlansUseCase,
  ) {}

  getActiveSubscriptionPlans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this._getAllSubscriptionPlansUseCase.execute({ isActive: true });
      sendSuccessResponse(res, 'Subscription plans retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}


