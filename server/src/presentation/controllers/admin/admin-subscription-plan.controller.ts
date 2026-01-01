import { Request, Response, NextFunction } from 'express';
import { CreateSubscriptionPlanDto } from 'src/application/dtos/admin/subscription/requests/create-subscription-plan-request.dto';
import { UpdateSubscriptionPlanDto } from 'src/application/dtos/admin/subscription/requests/update-subscription-plan-request.dto';
import { GetAllSubscriptionPlansDto } from 'src/application/dtos/admin/subscription/requests/get-all-subscription-plans-query.dto';
import { MigratePlanSubscribersDto } from 'src/application/dtos/admin/subscription/requests/migrate-plan-subscribers-request.dto';
import { IUpdateSubscriptionPlanUseCase } from 'src/domain/interfaces/use-cases/admin/subscription/IUpdateSubscriptionPlanUseCase';
import { IGetSubscriptionPlanByIdUseCase } from 'src/domain/interfaces/use-cases/admin/subscription/IGetSubscriptionPlanByIdUseCase';
import { IGetAllSubscriptionPlansUseCase } from 'src/domain/interfaces/use-cases/admin/subscription/IGetAllSubscriptionPlansUseCase';
import { ICreateSubscriptionPlanUseCase } from 'src/domain/interfaces/use-cases/admin/subscription/ICreateSubscriptionPlanUseCase';
import { MigratePlanSubscribersUseCase } from 'src/application/use-cases/admin/subscription/migrate-plan-subscribers.use-case';
import { handleValidationError, handleAsyncError, sendSuccessResponse, sendCreatedResponse } from 'src/shared/utils/presentation/controller.utils';

export class AdminSubscriptionPlanController {
  constructor(
    private readonly _createSubscriptionPlanUseCase: ICreateSubscriptionPlanUseCase,
    private readonly _getAllSubscriptionPlansUseCase: IGetAllSubscriptionPlansUseCase,
    private readonly _getSubscriptionPlanByIdUseCase: IGetSubscriptionPlanByIdUseCase,
    private readonly _updateSubscriptionPlanUseCase: IUpdateSubscriptionPlanUseCase,
    private readonly _migratePlanSubscribersUseCase: MigratePlanSubscribersUseCase,
  ) {}

  createSubscriptionPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = CreateSubscriptionPlanDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(
        `Invalid subscription plan data: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
        next,
      );
    }

    try {
      const plan = await this._createSubscriptionPlanUseCase.execute(parsed.data);
      sendCreatedResponse(res, 'Subscription plan created successfully', plan);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getAllSubscriptionPlans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = GetAllSubscriptionPlansDto.safeParse(req.query);
      if (!query.success) {
        return handleValidationError(
          `Invalid query parameters: ${query.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
          next,
        );
      }

      const result = await this._getAllSubscriptionPlansUseCase.execute(query.data);
      sendSuccessResponse(res, 'Subscription plans retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getSubscriptionPlanById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      return handleValidationError('Subscription plan ID is required', next);
    }

    try {
      const plan = await this._getSubscriptionPlanByIdUseCase.execute(id);
      sendSuccessResponse(res, 'Subscription plan retrieved successfully', plan);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateSubscriptionPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      return handleValidationError('Subscription plan ID is required', next);
    }

    const parsed = UpdateSubscriptionPlanDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(
        `Invalid subscription plan data: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
        next,
      );
    }

    try {
      const { planId: _, ...updateData } = parsed.data;
      const plan = await this._updateSubscriptionPlanUseCase.execute({ planId: id, ...updateData });
      sendSuccessResponse(res, 'Subscription plan updated successfully', plan);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  migratePlanSubscribers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      return handleValidationError('Subscription plan ID is required', next);
    }

    const parsed = MigratePlanSubscribersDto.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(
        `Invalid migration data: ${parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
        next,
      );
    }

    try {
      const result = await this._migratePlanSubscribersUseCase.execute({
        planId: id,
        billingCycle: parsed.data.billingCycle,
        prorationBehavior: parsed.data.prorationBehavior,
      });
      sendSuccessResponse(res, `Migration completed: ${result.migratedCount} subscribers migrated`, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}



