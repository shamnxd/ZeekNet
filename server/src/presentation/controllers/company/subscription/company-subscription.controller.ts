import { Response, NextFunction } from 'express';
import { IGetActiveSubscriptionUseCase } from 'src/domain/interfaces/use-cases/subscription/IGetActiveSubscriptionUseCase';
import { IGetPaymentHistoryUseCase } from 'src/domain/interfaces/use-cases/payment/history/IGetPaymentHistoryUseCase';
import { ICreateCheckoutSessionUseCase } from 'src/domain/interfaces/use-cases/subscription/ICreateCheckoutSessionUseCase';
import { ICancelSubscriptionUseCase } from 'src/domain/interfaces/use-cases/subscription/ICancelSubscriptionUseCase';
import { IResumeSubscriptionUseCase } from 'src/domain/interfaces/use-cases/subscription/IResumeSubscriptionUseCase';
import { IChangeSubscriptionPlanUseCase } from 'src/domain/interfaces/use-cases/subscription/IChangeSubscriptionPlanUseCase';
import { IGetBillingPortalUseCase } from 'src/domain/interfaces/use-cases/subscription/IGetBillingPortalUseCase';
import { CompanySubscriptionResponseMapper } from 'src/application/mappers/company/subscription/company-subscription-response.mapper';
import { AuthenticationError, ValidationError } from 'src/domain/errors/errors';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { PaymentMapper } from 'src/application/mappers/payment/payment.mapper';
import { sendSuccessResponse } from 'src/shared/utils/presentation/controller.utils';
import { HttpStatus } from 'src/domain/enums/http-status.enum';

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
        subscription,
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

      sendSuccessResponse(res, 'Subscription plan changed successfully', result);
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



