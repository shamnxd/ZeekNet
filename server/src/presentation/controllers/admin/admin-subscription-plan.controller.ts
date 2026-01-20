import { NextFunction, Request, Response } from 'express';
import { ICreateSubscriptionPlanUseCase } from 'src/domain/interfaces/use-cases/admin/subscription/ICreateSubscriptionPlanUseCase';
import { IGetAllSubscriptionPlansUseCase } from 'src/domain/interfaces/use-cases/admin/subscription/IGetAllSubscriptionPlansUseCase';
import { IGetSubscriptionPlanByIdUseCase } from 'src/domain/interfaces/use-cases/admin/subscription/IGetSubscriptionPlanByIdUseCase';
import { IMigratePlanSubscribersUseCase } from 'src/domain/interfaces/use-cases/admin/subscription/IMigratePlanSubscribersUseCase';
import { IUpdateSubscriptionPlanUseCase } from 'src/domain/interfaces/use-cases/admin/subscription/IUpdateSubscriptionPlanUseCase';
import { ParamsWithIdDto } from 'src/application/dtos/common/params-with-id.dto';
import { CreateSubscriptionPlanDto } from 'src/application/dtos/admin/subscription/requests/create-subscription-plan-request.dto';
import { GetAllSubscriptionPlansDto } from 'src/application/dtos/admin/subscription/requests/get-all-subscription-plans-query.dto';
import { MigratePlanSubscribersDto } from 'src/application/dtos/admin/subscription/requests/migrate-plan-subscribers-request.dto';
import { UpdateSubscriptionPlanDto } from 'src/application/dtos/admin/subscription/requests/update-subscription-plan-request.dto';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';
import { handleAsyncError, handleValidationError, sendCreatedResponse, sendSuccessResponse } from 'src/shared/utils/presentation/controller.utils';

export class AdminSubscriptionPlanController {
  constructor(
    private readonly _createSubscriptionPlanUseCase: ICreateSubscriptionPlanUseCase,
    private readonly _getAllSubscriptionPlansUseCase: IGetAllSubscriptionPlansUseCase,
    private readonly _getSubscriptionPlanByIdUseCase: IGetSubscriptionPlanByIdUseCase,
    private readonly _updateSubscriptionPlanUseCase: IUpdateSubscriptionPlanUseCase,
    private readonly _migratePlanSubscribersUseCase: IMigratePlanSubscribersUseCase,
  ) { }

  createSubscriptionPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = CreateSubscriptionPlanDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const plan = await this._createSubscriptionPlanUseCase.execute(parsed.data);
      sendCreatedResponse(res, 'Subscription plan created successfully', plan);
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
      sendSuccessResponse(res, 'Subscription plans retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getSubscriptionPlanById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsedParams = ParamsWithIdDto.safeParse(req.params);
    if (!parsedParams.success) {
      return handleValidationError(formatZodErrors(parsedParams.error), next);
    }

    try {
      const plan = await this._getSubscriptionPlanByIdUseCase.execute(parsedParams.data.id);
      sendSuccessResponse(res, 'Subscription plan retrieved successfully', plan);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateSubscriptionPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsedParams = ParamsWithIdDto.safeParse(req.params);
    if (!parsedParams.success) {
      return handleValidationError(formatZodErrors(parsedParams.error), next);
    }

    const parsedBody = UpdateSubscriptionPlanDto.safeParse({ ...req.body, planId: parsedParams.data.id });
    if (!parsedBody.success) {
      return handleValidationError(formatZodErrors(parsedBody.error), next);
    }

    try {
      const plan = await this._updateSubscriptionPlanUseCase.execute(parsedBody.data);
      sendSuccessResponse(res, 'Subscription plan updated successfully', plan);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  migratePlanSubscribers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsedParams = ParamsWithIdDto.safeParse(req.params);
    if (!parsedParams.success) {
      return handleValidationError(formatZodErrors(parsedParams.error), next);
    }

    const parsedBody = MigratePlanSubscribersDto.safeParse({ ...req.body, planId: parsedParams.data.id });
    if (!parsedBody.success) {
      return handleValidationError(formatZodErrors(parsedBody.error), next);
    }

    try {
      const result = await this._migratePlanSubscribersUseCase.execute(parsedBody.data);
      sendSuccessResponse(res, `Migration completed: ${result.migratedCount} subscribers migrated`, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
