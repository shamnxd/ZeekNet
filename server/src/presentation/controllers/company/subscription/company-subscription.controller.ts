import { Response, NextFunction } from 'express';
import { IGetActiveSubscriptionUseCase } from 'src/domain/interfaces/use-cases/subscription/IGetActiveSubscriptionUseCase';
import { IGetPaymentHistoryUseCase } from 'src/domain/interfaces/use-cases/payment/history/IGetPaymentHistoryUseCase';
import { ICreateCheckoutSessionUseCase } from 'src/domain/interfaces/use-cases/subscription/ICreateCheckoutSessionUseCase';
import { ICancelSubscriptionUseCase } from 'src/domain/interfaces/use-cases/subscription/ICancelSubscriptionUseCase';
import { IResumeSubscriptionUseCase } from 'src/domain/interfaces/use-cases/subscription/IResumeSubscriptionUseCase';
import { IChangeSubscriptionPlanUseCase } from 'src/domain/interfaces/use-cases/subscription/IChangeSubscriptionPlanUseCase';
import { IGetBillingPortalUseCase } from 'src/domain/interfaces/use-cases/subscription/IGetBillingPortalUseCase';
import { IPreviewPlanChangeUseCase } from 'src/domain/interfaces/use-cases/subscription/IPreviewPlanChangeUseCase';
import { ValidationError } from 'src/domain/errors/errors';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { sendSuccessResponse, validateUserId, handleAsyncError } from 'src/shared/utils/presentation/controller.utils';

export class CompanySubscriptionController {
  constructor(
    private readonly _getActiveSubscriptionUseCase: IGetActiveSubscriptionUseCase,
    private readonly _getPaymentHistoryUseCase: IGetPaymentHistoryUseCase,
    private readonly _createCheckoutSessionUseCase: ICreateCheckoutSessionUseCase,
    private readonly _cancelSubscriptionUseCase: ICancelSubscriptionUseCase,
    private readonly _resumeSubscriptionUseCase: IResumeSubscriptionUseCase,
    private readonly _changeSubscriptionPlanUseCase: IChangeSubscriptionPlanUseCase,
    private readonly _getBillingPortalUseCase: IGetBillingPortalUseCase,
    private readonly _previewPlanChangeUseCase: IPreviewPlanChangeUseCase,
  ) { }

  getActiveSubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const subscription = await this._getActiveSubscriptionUseCase.execute(userId);

      sendSuccessResponse(
        res,
        subscription ? 'Active subscription found' : 'No active subscription',
        subscription,
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getPaymentHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const paymentOrders = await this._getPaymentHistoryUseCase.execute(userId);

      sendSuccessResponse(res, 'Payment history retrieved successfully', paymentOrders);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  createCheckoutSession = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const { planId, billingCycle, successUrl, cancelUrl } = req.body;

      if (!planId) {
        throw new ValidationError('Plan ID is required');
      }

      if (!successUrl || !cancelUrl) {
        throw new ValidationError('Success and cancel URLs are required');
      }

      const result = await this._createCheckoutSessionUseCase.execute({
        userId,
        planId,
        billingCycle: billingCycle || 'monthly',
        successUrl,
        cancelUrl,
      });

      sendSuccessResponse(res, 'Checkout session created', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  cancelSubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const subscription = await this._cancelSubscriptionUseCase.execute(userId);

      sendSuccessResponse(
        res,
        'Subscription will be canceled at the end of the billing period',
        subscription,
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  resumeSubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const subscription = await this._resumeSubscriptionUseCase.execute(userId);

      sendSuccessResponse(res, 'Subscription resumed successfully', subscription);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  changeSubscriptionPlan = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const { planId, billingCycle } = req.body;

      if (!planId) {
        throw new ValidationError('New plan ID is required');
      }

      const result = await this._changeSubscriptionPlanUseCase.execute({
        userId,
        newPlanId: planId,
        billingCycle,
      });

      sendSuccessResponse(res, 'Subscription plan changed successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getBillingPortal = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const { returnUrl } = req.body;

      if (!returnUrl) {
        throw new ValidationError('Return URL is required');
      }

      const result = await this._getBillingPortalUseCase.execute({
        userId,
        returnUrl,
      });

      sendSuccessResponse(res, 'Billing portal session created', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  previewPlanChange = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const { planId, billingCycle } = req.body;

      if (!planId) {
        throw new ValidationError('Plan ID is required');
      }

      const result = await this._previewPlanChangeUseCase.execute({
        userId,
        newPlanId: planId,
        billingCycle,
      });

      sendSuccessResponse(res, 'Plan change preview generated', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}



