import { ISubscriptionPlanRepository } from '../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { IStripeService } from '../../../domain/interfaces/services/IStripeService';
import { IPriceHistoryRepository } from '../../../domain/interfaces/repositories/price-history/IPriceHistoryRepository';
import { SubscriptionPlan } from '../../../domain/entities/subscription-plan.entity';
import { ICreateSubscriptionPlanUseCase } from '../../../domain/interfaces/use-cases/subscriptions/ICreateSubscriptionPlanUseCase';
import { BadRequestError, ConflictError } from '../../../domain/errors/errors';
import { ILogger } from '../../../domain/interfaces/services/ILogger';
import { PriceType } from '../../../domain/entities/price-history.entity';
import { CreateSubscriptionPlanDto } from '../../dto/subscriptions/create-subscription-plan.dto';
import { CreateInput } from '../../../domain/types/common.types';

export class CreateSubscriptionPlanUseCase implements ICreateSubscriptionPlanUseCase {
  constructor(
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly _logger: ILogger,
    private readonly _stripeService?: IStripeService,
    private readonly _priceHistoryRepository?: IPriceHistoryRepository,
  ) {}

  async execute(data: CreateSubscriptionPlanDto): Promise<SubscriptionPlan> {
    if (!data.name || !data.name.trim()) {
      throw new BadRequestError('Plan name is required');
    }

    if (!data.description || !data.description.trim()) {
      throw new BadRequestError('Plan description is required');
    }

    if (data.isDefault) {
      if (data.price !== undefined && data.price !== 0) {
        throw new BadRequestError('Default plan cannot have a price. Price must be 0 or not set.');
      }
      if (data.duration !== undefined && data.duration > 0) {
        throw new BadRequestError('Default plan cannot have a duration. Duration must not be set.');
      }
      if (data.yearlyDiscount !== undefined && data.yearlyDiscount > 0) {
        throw new BadRequestError('Default plan cannot have a yearly discount. Yearly discount must not be set.');
      }
      
      const existingDefault = await this._subscriptionPlanRepository.findDefault();
      if (existingDefault) {
        throw new ConflictError('A default plan already exists. Please edit the existing default plan or unset it first.');
      }
    } else {
      if (data.price === undefined || data.price < 0) {
        throw new BadRequestError('Price is required and must be a positive number');
      }
      if (data.duration === undefined || data.duration < 1) {
        throw new BadRequestError('Duration is required and must be at least 1 day');
      }
    }

    const normalizedName = data.name.trim();
    const existingPlan = await this._subscriptionPlanRepository.findByName(normalizedName);
    
    if (existingPlan) {
      throw new ConflictError('Subscription plan with this name already exists');
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
    } as CreateInput<SubscriptionPlan>);

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
          const yearlyPriceInCents = Math.round(yearlyAmount * 100); 
          
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
            type: PriceType.MONTHLY,
            amount: data.price,
            isActive: true,
          });

          if (yearlyPriceId && yearlyAmount) {
            await this._priceHistoryRepository.create({
              planId: updatedPlan.id,
              stripePriceId: yearlyPriceId,
              type: PriceType.YEARLY,
              amount: yearlyAmount,
              isActive: true,
            });
          }
        }

        if (updatedPlan) {
          this._logger.info(`Subscription plan ${normalizedName} synced with Stripe: ${product.id}`);
          return updatedPlan;
        }
      } catch (error) {
        this._logger.error(`Failed to sync plan ${normalizedName} with Stripe`, error);
      }
    }

    return plan;
  }
}
