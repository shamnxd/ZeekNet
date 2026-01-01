import { Response, NextFunction } from 'express';
import { IGetActiveSubscriptionUseCase } from '../../../application/interfaces/use-cases/subscriptions/IGetActiveSubscriptionUseCase';
import { IGetPaymentHistoryUseCase } from '../../../domain/interfaces/use-cases/payments/IGetPaymentHistoryUseCase';
import { ICreateCheckoutSessionUseCase } from '../../../domain/interfaces/use-cases/payments/ICreateCheckoutSessionUseCase';
import { ICancelSubscriptionUseCase } from '../../../application/interfaces/use-cases/subscriptions/ICancelSubscriptionUseCase';
import { IResumeSubscriptionUseCase } from '../../../application/interfaces/use-cases/subscriptions/IResumeSubscriptionUseCase';
import { IChangeSubscriptionPlanUseCase } from '../../../application/interfaces/use-cases/subscriptions/IChangeSubscriptionPlanUseCase';
import { IGetBillingPortalUseCase } from '../../../domain/interfaces/use-cases/payments/IGetBillingPortalUseCase';
import { CompanySubscriptionResponseMapper } from '../../../application/mappers/subscription/company-subscription-response.mapper';
import { AuthenticationError, ValidationError } from '../../../domain/errors/errors';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import { PaymentMapper } from '../../../application/mappers/payment.mapper';
import { sendSuccessResponse } from '../../../shared/utils/controller.utils';
import { HttpStatus } from '../../../domain/enums/http-status.enum';

export class CompanySubscriptionController {
  constructor(
    private readonly _getActiveSubscriptionUseCase: IGetActiveSubscriptionUseCase,
    private readonly _getPaymentHistoryUseCase: IGetPaymentHistoryUseCase,
    private readonly _createCheckoutSessionUseCase: ICreateCheckoutSessionUseCase,
    private readonly _cancelSubscriptionUseCase: ICancelSubscriptionUseCase,
    private readonly _resumeSubscriptionUseCase: IResumeSubscriptionUseCase,
    private readonly _changeSubscriptionPlanUseCase: IChangeSubscriptionPlanUseCase,
    private readonly _getBillingPortalUseCase: IGetBillingPortalUseCase,
  ) {}

  getActiveSubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AuthenticationError();
      }

      const subscription = await this._getActiveSubscriptionUseCase.execute(userId);

      sendSuccessResponse(
        res,
        subscription ? 'Active subscription found' : 'No active subscription',
        subscription ? CompanySubscriptionResponseMapper.toDto(subscription) : null,
      );
    } catch (error) {
      next(error);
    }
  };

  getPaymentHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AuthenticationError();
      }

      const paymentOrders = await this._getPaymentHistoryUseCase.execute(userId);

      sendSuccessResponse(res, 'Payment history retrieved successfully', PaymentMapper.toResponseList(paymentOrders));
    } catch (error) {
      next(error);
    }
  };

  createCheckoutSession = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AuthenticationError();
      }

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
      next(error);
    }
  };

  cancelSubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AuthenticationError();
      }

      const subscription = await this._cancelSubscriptionUseCase.execute(userId);

      sendSuccessResponse(
        res,
        'Subscription will be canceled at the end of the billing period',
        CompanySubscriptionResponseMapper.toDto(subscription),
      );
    } catch (error) {
      next(error);
    }
  };

  resumeSubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AuthenticationError();
      }

      const subscription = await this._resumeSubscriptionUseCase.execute(userId);

      sendSuccessResponse(res, 'Subscription resumed successfully', CompanySubscriptionResponseMapper.toDto(subscription));
    } catch (error) {
      next(error);
    }
  };

  changeSubscriptionPlan = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AuthenticationError();
      }

      const { planId, billingCycle } = req.body;
      
      if (!planId) {
        throw new ValidationError('New plan ID is required');
      }

      const result = await this._changeSubscriptionPlanUseCase.execute({
        userId,
        newPlanId: planId,
        billingCycle,
      });

      sendSuccessResponse(res, 'Subscription plan changed successfully', {
        subscription: CompanySubscriptionResponseMapper.toDto(result.subscription),
      });
    } catch (error) {
      next(error);
    }
  };

  getBillingPortal = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AuthenticationError();
      }

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
      next(error);
    }
  };
}
