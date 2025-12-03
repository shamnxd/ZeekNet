import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { PurchaseSubscriptionUseCase } from '../../../application/use-cases/company/purchase-subscription.use-case';
import { GetActiveSubscriptionUseCase } from '../../../application/use-cases/company/get-active-subscription.use-case';
import { GetPaymentHistoryUseCase } from '../../../application/use-cases/company/get-payment-history.use-case';
import { CompanySubscriptionResponseMapper } from '../../../application/mappers/subscription/company-subscription-response.mapper';
import { AppError } from '../../../domain/errors/errors';

export class CompanySubscriptionController {
  constructor(
    private readonly _purchaseSubscriptionUseCase: PurchaseSubscriptionUseCase,
    private readonly _getActiveSubscriptionUseCase: GetActiveSubscriptionUseCase,
    private readonly _getPaymentHistoryUseCase: GetPaymentHistoryUseCase,
  ) {}

  purchaseSubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const { planId, billingCycle } = req.body;
      if (!planId) {
        throw new AppError('Plan ID is required', 400);
      }

      const { subscription, paymentOrder } = await this._purchaseSubscriptionUseCase.execute(
        userId,
        planId,
        billingCycle || 'monthly',
      );

      res.status(201).json({
        success: true,
        message: 'Subscription purchased successfully',
        data: {
          subscription: CompanySubscriptionResponseMapper.toDto(subscription),
          paymentOrder: {
            id: paymentOrder.id,
            amount: paymentOrder.amount,
            currency: paymentOrder.currency,
            status: paymentOrder.status,
            invoiceId: paymentOrder.invoiceId,
            transactionId: paymentOrder.transactionId,
            paymentMethod: paymentOrder.paymentMethod,
            createdAt: paymentOrder.createdAt,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

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
          createdAt: order.createdAt,
        })),
      });
    } catch (error) {
      next(error);
    }
  };
}

