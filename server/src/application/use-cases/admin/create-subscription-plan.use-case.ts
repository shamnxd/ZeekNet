import { ISubscriptionPlanRepository } from '../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { IStripeService } from '../../../domain/interfaces/services/IStripeService';
import { IPriceHistoryRepository } from '../../../domain/interfaces/repositories/price-history/IPriceHistoryRepository';
import { SubscriptionPlan } from '../../../domain/entities/subscription-plan.entity';
import { ICreateSubscriptionPlanUseCase } from '../../../domain/interfaces/use-cases/ISubscriptionPlanUseCases';
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
    price: number;
    duration: number;
    features: string[];
    jobPostLimit: number;
    featuredJobLimit: number;
    applicantAccessLimit: number;
    yearlyDiscount: number;
    isPopular?: boolean;
  }): Promise<SubscriptionPlan> {
    if (!data.name || !data.name.trim()) {
      throw new AppError('Plan name is required', 400);
    }

    if (!data.description || !data.description.trim()) {
      throw new AppError('Plan description is required', 400);
    }

    if (data.price < 0) {
      throw new AppError('Price must be a positive number', 400);
    }

    if (data.duration < 1) {
      throw new AppError('Duration must be at least 1 day', 400);
    }

    const normalizedName = data.name.trim();
    const existingPlan = await this._subscriptionPlanRepository.findByName(normalizedName);
    
    if (existingPlan) {
      throw new AppError('Subscription plan with this name already exists', 409);
    }

    if (data.isPopular) {
      await this._subscriptionPlanRepository.unmarkAllAsPopular();
    }

    // Create plan in database first
    const plan = await this._subscriptionPlanRepository.create({
      name: normalizedName,
      description: data.description.trim(),
      price: data.price,
      duration: data.duration,
      features: data.features,
      jobPostLimit: data.jobPostLimit,
      featuredJobLimit: data.featuredJobLimit,
      applicantAccessLimit: data.applicantAccessLimit,
      yearlyDiscount: data.yearlyDiscount,
      isActive: true,
      isPopular: data.isPopular ?? false,
    } as Omit<SubscriptionPlan, 'id' | '_id' | 'createdAt' | 'updatedAt'>);

    // Sync with Stripe if service is available and price > 0
    if (this._stripeService && data.price > 0) {
      try {
        // Create Stripe product
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

        // Create monthly price
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

        // Create yearly price if discount > 0
        let yearlyPriceId: string | undefined;
        let yearlyAmount: number | undefined;
        if (data.yearlyDiscount > 0) {
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

        // Update plan with Stripe IDs
        const updatedPlan = await this._subscriptionPlanRepository.updateStripeIds(plan.id, {
          stripeProductId: product.id,
          stripePriceIdMonthly: monthlyPrice.id,
          stripePriceIdYearly: yearlyPriceId,
        });

        // Create price history records
        if (this._priceHistoryRepository && updatedPlan) {
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
        // Return the plan even if Stripe sync fails - admin can retry later
      }
    }

    return plan;
  }
}
