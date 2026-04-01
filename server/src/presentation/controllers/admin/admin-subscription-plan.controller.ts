import { NextFunction, Request, Response } from 'express';
import { ICreateSubscriptionPlanUseCase } from 'src/domain/interfaces/use-cases/admin/subscription/ICreateSubscriptionPlanUseCase';
import { IGetAllSubscriptionPlansUseCase } from 'src/domain/interfaces/use-cases/admin/subscription/IGetAllSubscriptionPlansUseCase';
import { IGetSubscriptionPlanByIdUseCase } from 'src/domain/interfaces/use-cases/admin/subscription/IGetSubscriptionPlanByIdUseCase';
import { IUpdateSubscriptionPlanUseCase } from 'src/domain/interfaces/use-cases/admin/subscription/IUpdateSubscriptionPlanUseCase';
import { CreateSubscriptionPlanDto } from 'src/application/dtos/admin/subscription/requests/create-subscription-plan-request.dto';
import { GetAllSubscriptionPlansDto } from 'src/application/dtos/admin/subscription/requests/get-all-subscription-plans-query.dto';
import { UpdateSubscriptionPlanDto } from 'src/application/dtos/admin/subscription/requests/update-subscription-plan-request.dto';
import { formatZodErrors, handleAsyncError, handleValidationError, sendCreatedResponse, sendSuccessResponse } from 'src/shared/utils';
import { SUCCESS } from 'src/shared/constants/messages';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class AdminSubscriptionPlanController {
  constructor(
    @inject(TYPES.CreateSubscriptionPlanUseCase) private readonly _createSubscriptionPlanUseCase: ICreateSubscriptionPlanUseCase,
    @inject(TYPES.GetAllSubscriptionPlansUseCase) private readonly _getAllSubscriptionPlansUseCase: IGetAllSubscriptionPlansUseCase,
    @inject(TYPES.GetSubscriptionPlanByIdUseCase) private readonly _getSubscriptionPlanByIdUseCase: IGetSubscriptionPlanByIdUseCase,
    @inject(TYPES.UpdateSubscriptionPlanUseCase) private readonly _updateSubscriptionPlanUseCase: IUpdateSubscriptionPlanUseCase,
  ) { }

  createSubscriptionPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = CreateSubscriptionPlanDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const plan = await this._createSubscriptionPlanUseCase.execute(parsed.data);
      sendCreatedResponse(res, SUCCESS.CREATED('Subscription plan'), plan);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getAllSubscriptionPlans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = GetAllSubscriptionPlansDto.safeParse(req.query);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._getAllSubscriptionPlansUseCase.execute(parsed.data);
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Subscription plans'), result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getSubscriptionPlanById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const plan = await this._getSubscriptionPlanByIdUseCase.execute(id);
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Subscription plan'), plan);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateSubscriptionPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const parsedBody = UpdateSubscriptionPlanDto.safeParse({ ...req.body, planId: id });
    if (!parsedBody.success) {
      return handleValidationError(formatZodErrors(parsedBody.error), next);
    }

    try {
      const plan = await this._updateSubscriptionPlanUseCase.execute(parsedBody.data);
      sendSuccessResponse(res, SUCCESS.UPDATED('Subscription plan'), plan);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

