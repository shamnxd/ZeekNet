import { injectable, inject } from 'inversify';
import { Response, NextFunction } from 'express';
import { TYPES } from 'src/shared/constants/types';
import { ValidationError } from 'src/domain/errors/errors';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { IGetActiveSubscriptionUseCase } from 'src/domain/interfaces/use-cases/subscription/IGetActiveSubscriptionUseCase';
import { IGetPaymentHistoryUseCase } from 'src/domain/interfaces/use-cases/payment/history/IGetPaymentHistoryUseCase';
import { ICreateCheckoutSessionUseCase } from 'src/domain/interfaces/use-cases/subscription/ICreateCheckoutSessionUseCase';
import { ICancelSubscriptionUseCase } from 'src/domain/interfaces/use-cases/subscription/ICancelSubscriptionUseCase';
import { IResumeSubscriptionUseCase } from 'src/domain/interfaces/use-cases/subscription/IResumeSubscriptionUseCase';
import { IChangeSubscriptionPlanUseCase } from 'src/domain/interfaces/use-cases/subscription/IChangeSubscriptionPlanUseCase';
import { IGetBillingPortalUseCase } from 'src/domain/interfaces/use-cases/subscription/IGetBillingPortalUseCase';
import { IPreviewPlanChangeUseCase } from 'src/domain/interfaces/use-cases/subscription/IPreviewPlanChangeUseCase';
import { sendSuccessResponse, validateUserId, handleAsyncError } from 'src/shared/utils';
import { SUCCESS, VALIDATION } from 'src/shared/constants/messages';

@injectable()
export class CompanySubscriptionController {
  constructor(
    @inject(TYPES.GetActiveSubscriptionUseCase) private readonly _getActiveSubscriptionUseCase: IGetActiveSubscriptionUseCase,
    @inject(TYPES.GetPaymentHistoryUseCase) private readonly _getPaymentHistoryUseCase: IGetPaymentHistoryUseCase,
    @inject(TYPES.CreateCheckoutSessionUseCase) private readonly _createCheckoutSessionUseCase: ICreateCheckoutSessionUseCase,
    @inject(TYPES.CancelSubscriptionUseCase) private readonly _cancelSubscriptionUseCase: ICancelSubscriptionUseCase,
    @inject(TYPES.ResumeSubscriptionUseCase) private readonly _resumeSubscriptionUseCase: IResumeSubscriptionUseCase,
    @inject(TYPES.ChangeSubscriptionPlanUseCase) private readonly _changeSubscriptionPlanUseCase: IChangeSubscriptionPlanUseCase,
    @inject(TYPES.GetBillingPortalUseCase) private readonly _getBillingPortalUseCase: IGetBillingPortalUseCase,
    @inject(TYPES.PreviewPlanChangeUseCase) private readonly _previewPlanChangeUseCase: IPreviewPlanChangeUseCase,
  ) { }

  getActiveSubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const subscription = await this._getActiveSubscriptionUseCase.execute(userId);

      sendSuccessResponse(res, SUCCESS.RETRIEVED('Active subscription'), subscription);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getPaymentHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const paymentOrders = await this._getPaymentHistoryUseCase.execute(userId);

      sendSuccessResponse(res, SUCCESS.RETRIEVED('Payment history'), paymentOrders);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  createCheckoutSession = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const { planId, billingCycle, successUrl, cancelUrl } = req.body;

      if (!planId) {
        throw new ValidationError(VALIDATION.REQUIRED('Plan ID'));
      }

      if (!successUrl || !cancelUrl) {
        throw new ValidationError(VALIDATION.REQUIRED('Success and cancel URLs'));
      }

      const result = await this._createCheckoutSessionUseCase.execute({
        userId,
        planId,
        billingCycle: billingCycle || 'monthly',
        successUrl,
        cancelUrl,
      });

      sendSuccessResponse(res, SUCCESS.ACTION('Checkout session creation'), result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  cancelSubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const subscription = await this._cancelSubscriptionUseCase.execute(userId);

      sendSuccessResponse(res, SUCCESS.ACTION('Subscription cancellation'), subscription);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  resumeSubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const subscription = await this._resumeSubscriptionUseCase.execute(userId);

      sendSuccessResponse(res, SUCCESS.ACTION('Subscription resumption'), subscription);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  changeSubscriptionPlan = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const { planId, billingCycle } = req.body;

      if (!planId) {
        throw new ValidationError(VALIDATION.REQUIRED('New plan ID'));
      }

      const result = await this._changeSubscriptionPlanUseCase.execute({
        userId,
        newPlanId: planId,
        billingCycle,
      });

      sendSuccessResponse(res, SUCCESS.ACTION('Subscription plan change'), result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getBillingPortal = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const { returnUrl } = req.body;

      if (!returnUrl) {
        throw new ValidationError(VALIDATION.REQUIRED('Return URL'));
      }

      const result = await this._getBillingPortalUseCase.execute({
        userId,
        returnUrl,
      });

      sendSuccessResponse(res, SUCCESS.ACTION('Billing portal session creation'), result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  previewPlanChange = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const { planId, billingCycle } = req.body;

      if (!planId) {
        throw new ValidationError(VALIDATION.REQUIRED('Plan ID'));
      }

      const result = await this._previewPlanChangeUseCase.execute({
        userId,
        newPlanId: planId,
        billingCycle,
      });

      sendSuccessResponse(res, SUCCESS.ACTION('Plan change preview generation'), result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

