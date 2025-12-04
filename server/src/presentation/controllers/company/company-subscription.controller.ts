import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { GetActiveSubscriptionUseCase } from '../../../application/use-cases/company/get-active-subscription.use-case';
import { GetPaymentHistoryUseCase } from '../../../application/use-cases/company/get-payment-history.use-case';
import { CreateCheckoutSessionUseCase } from '../../../application/use-cases/company/create-checkout-session.use-case';
import { CancelSubscriptionUseCase } from '../../../application/use-cases/company/cancel-subscription.use-case';
import { ResumeSubscriptionUseCase } from '../../../application/use-cases/company/resume-subscription.use-case';
import { ChangeSubscriptionPlanUseCase } from '../../../application/use-cases/company/change-subscription-plan.use-case';
import { GetBillingPortalUseCase } from '../../../application/use-cases/company/get-billing-portal.use-case';
import { CompanySubscriptionResponseMapper } from '../../../application/mappers/subscription/company-subscription-response.mapper';
import { AppError } from '../../../domain/errors/errors';

export class CompanySubscriptionController {
  constructor(
    private readonly _getActiveSubscriptionUseCase: GetActiveSubscriptionUseCase,
    private readonly _getPaymentHistoryUseCase: GetPaymentHistoryUseCase,
    private readonly _createCheckoutSessionUseCase: CreateCheckoutSessionUseCase,
    private readonly _cancelSubscriptionUseCase: CancelSubscriptionUseCase,
    private readonly _resumeSubscriptionUseCase: ResumeSubscriptionUseCase,
    private readonly _changeSubscriptionPlanUseCase: ChangeSubscriptionPlanUseCase,
    private readonly _getBillingPortalUseCase: GetBillingPortalUseCase,
  ) {}

  getActiveSubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const subscription = await this._getActiveSubscriptionUseCase.execute(userId);

      res.status(200).json({
        success: true,
        message: subscription ? 'Active subscription found' : 'No active subscription',
        data: subscription ? CompanySubscriptionResponseMapper.toDto(subscription) : null,
      });
    } catch (error) {
      next(error);
    }
  };

  getPaymentHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const paymentOrders = await this._getPaymentHistoryUseCase.execute(userId);

      res.status(200).json({
        success: true,
        message: 'Payment history retrieved successfully',
        data: paymentOrders.map(order => ({
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          status: order.status,
          paymentMethod: order.paymentMethod,
          invoiceId: order.invoiceId,
          transactionId: order.transactionId,
          stripeInvoiceUrl: order.stripeInvoiceUrl,
          stripeInvoicePdf: order.stripeInvoicePdf,
          billingCycle: order.billingCycle,
          createdAt: order.createdAt,
        })),
      });
    } catch (error) {
      next(error);
    }
  };

  createCheckoutSession = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const { planId, billingCycle, successUrl, cancelUrl } = req.body;
      
      if (!planId) {
        throw new AppError('Plan ID is required', 400);
      }

      if (!successUrl || !cancelUrl) {
        throw new AppError('Success and cancel URLs are required', 400);
      }

      const result = await this._createCheckoutSessionUseCase.execute(
        userId,
        planId,
        billingCycle || 'monthly',
        successUrl,
        cancelUrl,
      );

      res.status(200).json({
        success: true,
        message: 'Checkout session created',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  cancelSubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const subscription = await this._cancelSubscriptionUseCase.execute(userId);

      res.status(200).json({
        success: true,
        message: 'Subscription will be canceled at the end of the billing period',
        data: CompanySubscriptionResponseMapper.toDto(subscription),
      });
    } catch (error) {
      next(error);
    }
  };

  resumeSubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const subscription = await this._resumeSubscriptionUseCase.execute(userId);

      res.status(200).json({
        success: true,
        message: 'Subscription resumed successfully',
        data: CompanySubscriptionResponseMapper.toDto(subscription),
      });
    } catch (error) {
      next(error);
    }
  };

  changeSubscriptionPlan = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const { planId, billingCycle } = req.body;
      
      if (!planId) {
        throw new AppError('New plan ID is required', 400);
      }

      const result = await this._changeSubscriptionPlanUseCase.execute(userId, planId, billingCycle);

      res.status(200).json({
        success: true,
        message: 'Subscription plan changed successfully',
        data: {
          subscription: CompanySubscriptionResponseMapper.toDto(result.subscription),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getBillingPortal = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const { returnUrl } = req.body;
      
      if (!returnUrl) {
        throw new AppError('Return URL is required', 400);
      }

      const result = await this._getBillingPortalUseCase.execute(userId, returnUrl);

      res.status(200).json({
        success: true,
        message: 'Billing portal session created',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

