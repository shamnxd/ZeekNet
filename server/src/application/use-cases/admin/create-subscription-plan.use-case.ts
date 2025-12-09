import { ISubscriptionPlanRepository } from '../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { IStripeService } from '../../../domain/interfaces/services/IStripeService';
import { IPriceHistoryRepository } from '../../../domain/interfaces/repositories/price-history/IPriceHistoryRepository';
import { SubscriptionPlan } from '../../../domain/entities/subscription-plan.entity';
import { ICreateSubscriptionPlanUseCase } from 'src/domain/interfaces/use-cases/subscriptions/ICreateSubscriptionPlanUseCase';
import { AppError } from '../../../domain/errors/errors';
import { logger } from '../../../infrastructure/config/logger';

export class CreateSubscriptionPlanUseCase implements ICreateSubscriptionPlanUseCase {
  constructor(
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly _stripeService?: IStripeService,
    private readonly _priceHistoryRepository?: IPriceHistoryRepository,
  ) {}

  async execute(data: {
    name: string;
    description: string;
    price?: number;
    duration?: number;
    features: string[];
    jobPostLimit: number;
    featuredJobLimit: number;
    applicantAccessLimit: number;
    yearlyDiscount?: number;
    isPopular?: boolean;
    isDefault?: boolean;
  }): Promise<SubscriptionPlan> {
    if (!data.name || !data.name.trim()) {
      throw new AppError('Plan name is required', 400);
    }

    if (!data.description || !data.description.trim()) {
      throw new AppError('Plan description is required', 400);
    }

    if (data.isDefault) {
      if (data.price !== undefined && data.price !== 0) {
        throw new AppError('Default plan cannot have a price. Price must be 0 or not set.', 400);
      }
      if (data.duration !== undefined && data.duration > 0) {
        throw new AppError('Default plan cannot have a duration. Duration must not be set.', 400);
      }
      if (data.yearlyDiscount !== undefined && data.yearlyDiscount > 0) {
        throw new AppError('Default plan cannot have a yearly discount. Yearly discount must not be set.', 400);
      }
      
      const existingDefault = await this._subscriptionPlanRepository.findDefault();
      if (existingDefault) {
        throw new AppError('A default plan already exists. Please edit the existing default plan or unset it first.', 409);
      }
    } else {
      if (data.price === undefined || data.price < 0) {
        throw new AppError('Price is required and must be a positive number', 400);
      }
      if (data.duration === undefined || data.duration < 1) {
        throw new AppError('Duration is required and must be at least 1 day', 400);
      }
    }

    const normalizedName = data.name.trim();
    const existingPlan = await this._subscriptionPlanRepository.findByName(normalizedName);
    
    if (existingPlan) {
      throw new AppError('Subscription plan with this name already exists', 409);
    }

    if (data.isPopular) {
      await this._subscriptionPlanRepository.unmarkAllAsPopular();
    }

    if (data.isDefault) {
      await this._subscriptionPlanRepository.unmarkAllAsDefault();
    }

    const plan = await this._subscriptionPlanRepository.create({
      name: normalizedName,
      description: data.description.trim(),
      price: data.isDefault ? 0 : (data.price ?? 0),
      duration: data.isDefault ? 0 : (data.duration ?? 0),
      features: data.features,
      jobPostLimit: data.jobPostLimit,
      featuredJobLimit: data.featuredJobLimit,
      applicantAccessLimit: data.applicantAccessLimit,
      yearlyDiscount: data.isDefault ? 0 : (data.yearlyDiscount ?? 0),
      isActive: true,
      isPopular: data.isPopular ?? false,
      isDefault: data.isDefault ?? false,
    } as Omit<SubscriptionPlan, 'id' | '_id' | 'createdAt' | 'updatedAt'>);

    if (this._stripeService && data.price !== undefined && data.price > 0 && !data.isDefault) {
      try {
        const product = await this._stripeService.createProduct({
          name: normalizedName,
          description: data.description.trim(),
          metadata: {
            planId: plan.id,
            jobPostLimit: String(data.jobPostLimit),
            featuredJobLimit: String(data.featuredJobLimit),
            applicantAccessLimit: String(data.applicantAccessLimit),
          },
        });

        const monthlyPriceInCents = Math.round(data.price * 100);
        const monthlyPrice = await this._stripeService.createPrice({
          productId: product.id,
          unitAmount: monthlyPriceInCents,
          currency: 'inr',
          interval: 'month',
          metadata: {
            planId: plan.id,
            billingCycle: 'monthly',
          },
        });

        let yearlyPriceId: string | undefined;
        let yearlyAmount: number | undefined;
        if (data.yearlyDiscount !== undefined && data.yearlyDiscount > 0 && data.price !== undefined) {
          const yearlyPricePerMonth = data.price * (1 - data.yearlyDiscount / 100);
          yearlyAmount = yearlyPricePerMonth * 12;
          const yearlyPriceInCents = Math.round(yearlyAmount * 100); // Total yearly amount
          
          const yearlyPrice = await this._stripeService.createPrice({
            productId: product.id,
            unitAmount: yearlyPriceInCents,
            currency: 'inr',
            interval: 'year',
            metadata: {
              planId: plan.id,
              billingCycle: 'yearly',
              discount: String(data.yearlyDiscount),
            },
          });
          yearlyPriceId = yearlyPrice.id;
        }

        const updatedPlan = await this._subscriptionPlanRepository.updateStripeIds(plan.id, {
          stripeProductId: product.id,
          stripePriceIdMonthly: monthlyPrice.id,
          stripePriceIdYearly: yearlyPriceId,
        });

        if (this._priceHistoryRepository && updatedPlan && data.price !== undefined) {
          await this._priceHistoryRepository.create({
            planId: updatedPlan.id,
            stripePriceId: monthlyPrice.id,
            type: 'monthly',
            amount: data.price,
            isActive: true,
          });

          if (yearlyPriceId && yearlyAmount) {
            await this._priceHistoryRepository.create({
              planId: updatedPlan.id,
              stripePriceId: yearlyPriceId,
              type: 'yearly',
              amount: yearlyAmount,
              isActive: true,
            });
          }
        }

        if (updatedPlan) {
          logger.info(`Subscription plan ${normalizedName} synced with Stripe: ${product.id}`);
          return updatedPlan;
        }
      } catch (error) {
        logger.error(`Failed to sync plan ${normalizedName} with Stripe`, error);
      }
    }

    return plan;
  }
}
