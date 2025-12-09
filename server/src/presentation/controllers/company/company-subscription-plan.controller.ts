import { Request, Response, NextFunction } from 'express';
import { IGetAllSubscriptionPlansUseCase } from '../../../domain/interfaces/use-cases/subscriptions/ISubscriptionPlanUseCases';
import { handleAsyncError, sendSuccessResponse } from '../../../shared/utils/controller.utils';

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
