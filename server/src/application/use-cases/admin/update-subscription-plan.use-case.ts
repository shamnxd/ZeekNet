import { ISubscriptionPlanRepository } from '../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { IStripeService } from '../../../domain/interfaces/services/IStripeService';
import { IPriceHistoryRepository } from '../../../domain/interfaces/repositories/price-history/IPriceHistoryRepository';
import { SubscriptionPlan } from '../../../domain/entities/subscription-plan.entity';
import { IUpdateSubscriptionPlanUseCase } from 'src/domain/interfaces/use-cases/subscriptions/IUpdateSubscriptionPlanUseCase';
import { AppError, NotFoundError } from '../../../domain/errors/errors';
import { logger } from '../../../infrastructure/config/logger';
import { UpdateSubscriptionPlanDto } from '../../dto/subscriptions/update-subscription-plan.dto';

export class UpdateSubscriptionPlanUseCase implements IUpdateSubscriptionPlanUseCase {
  constructor(
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly _stripeService?: IStripeService,
    private readonly _priceHistoryRepository?: IPriceHistoryRepository,
  ) {}

  async execute(dto: UpdateSubscriptionPlanDto): Promise<SubscriptionPlan> {
    const { planId, ...data } = dto;
    const existingPlan = await this._subscriptionPlanRepository.findById(planId);
    
    if (!existingPlan) {
      throw new NotFoundError('Subscription plan not found');
    }

    if (data.name !== undefined) {
      const normalizedName = data.name.trim();
      if (!normalizedName) {
        throw new AppError('Plan name cannot be empty', 400);
      }

      const planWithSameName = await this._subscriptionPlanRepository.findByName(normalizedName);
      if (planWithSameName && planWithSameName.id !== planId) {
        throw new AppError('Subscription plan with this name already exists', 409);
      }
      data.name = normalizedName;
    }

    if (data.description !== undefined && !data.description.trim()) {
      throw new AppError('Plan description cannot be empty', 400);
    }

    if (data.price !== undefined) {
      if (data.price < 0) {
        throw new AppError('Price must be a positive number', 400);
      }
    }

    if (data.duration !== undefined && data.duration < 1) {
      throw new AppError('Duration must be at least 1 day', 400);
    }

    if (data.yearlyDiscount !== undefined && (data.yearlyDiscount < 0 || data.yearlyDiscount > 100)) {
      throw new AppError('Yearly discount must be between 0 and 100', 400);
    }

    if (existingPlan.isDefault && data.isActive === false) {
      throw new AppError('Cannot unlist the default plan', 400);
    }

    if (existingPlan.isDefault) {
      if (data.price !== undefined && data.price !== 0) {
        throw new AppError('Default plan cannot have a price. Price cannot be set or must be 0.', 400);
      }
      if (data.duration !== undefined && data.duration > 0) {
        throw new AppError('Default plan cannot have a duration. Duration cannot be set.', 400);
      }
      if (data.yearlyDiscount !== undefined && data.yearlyDiscount > 0) {
        throw new AppError('Default plan cannot have a yearly discount. Yearly discount cannot be set.', 400);
      }
    }

    if (data.isDefault === true && !existingPlan.isDefault) {
      const existingDefault = await this._subscriptionPlanRepository.findDefault();
      if (existingDefault && existingDefault.id !== planId) {
        throw new AppError('A default plan already exists. Please unset the existing default plan first.', 409);
      }
      await this._subscriptionPlanRepository.unmarkAllAsDefault();
    }

    if (data.isPopular === true) {
      await this._subscriptionPlanRepository.unmarkAllAsPopular();
    }

    const priceChanged = data.price !== undefined && 
                         existingPlan.stripeProductId && 
                         data.price !== existingPlan.price;
    
    const yearlyDiscountChanged = data.yearlyDiscount !== undefined && 
                                  data.yearlyDiscount !== existingPlan.yearlyDiscount;

    let newMonthlyPriceId: string | undefined;
    let newYearlyPriceId: string | undefined;
    const finalPrice = data.price ?? existingPlan.price;
    const finalYearlyDiscount = data.yearlyDiscount ?? existingPlan.yearlyDiscount;

    if (priceChanged || yearlyDiscountChanged) {
      if (this._stripeService && existingPlan.stripeProductId) {
        try {
          if (existingPlan.stripePriceIdMonthly) {
            await this._stripeService.archivePrice(existingPlan.stripePriceIdMonthly);
            if (this._priceHistoryRepository) {
              await this._priceHistoryRepository.archivePrice(existingPlan.stripePriceIdMonthly);
            }
            logger.info(`Archived old monthly price: ${existingPlan.stripePriceIdMonthly}`);
          }

          if (existingPlan.stripePriceIdYearly) {
            await this._stripeService.archivePrice(existingPlan.stripePriceIdYearly);
            if (this._priceHistoryRepository) {
              await this._priceHistoryRepository.archivePrice(existingPlan.stripePriceIdYearly);
            }
            logger.info(`Archived old yearly price: ${existingPlan.stripePriceIdYearly}`);
          }

          const monthlyPriceInCents = Math.round(finalPrice * 100);
          const monthlyPrice = await this._stripeService.createPrice({
            productId: existingPlan.stripeProductId,
            unitAmount: monthlyPriceInCents,
            currency: 'inr',
            interval: 'month',
            metadata: {
              planId: existingPlan.id,
              billingCycle: 'monthly',
            },
          });
          newMonthlyPriceId = monthlyPrice.id;

          if (this._priceHistoryRepository) {
            await this._priceHistoryRepository.create({
              planId: existingPlan.id,
              stripePriceId: monthlyPrice.id,
              type: 'monthly',
              amount: finalPrice,
              isActive: true,
            });
          }

          if (finalYearlyDiscount > 0) {
            const yearlyPricePerMonth = finalPrice * (1 - finalYearlyDiscount / 100);
            const yearlyPriceInCents = Math.round(yearlyPricePerMonth * 12 * 100);
            
            const yearlyPrice = await this._stripeService.createPrice({
              productId: existingPlan.stripeProductId,
              unitAmount: yearlyPriceInCents,
              currency: 'inr',
              interval: 'year',
              metadata: {
                planId: existingPlan.id,
                billingCycle: 'yearly',
                discount: String(finalYearlyDiscount),
              },
            });
            newYearlyPriceId = yearlyPrice.id;

            if (this._priceHistoryRepository) {
              const yearlyAmount = yearlyPricePerMonth * 12;
              await this._priceHistoryRepository.create({
                planId: existingPlan.id,
                stripePriceId: yearlyPrice.id,
                type: 'yearly',
                amount: yearlyAmount,
                isActive: true,
              });
            }
          }

          if (newMonthlyPriceId || newYearlyPriceId) {
            await this._subscriptionPlanRepository.updateStripeIds(planId, {
              stripePriceIdMonthly: newMonthlyPriceId ?? existingPlan.stripePriceIdMonthly,
              stripePriceIdYearly: newYearlyPriceId ?? existingPlan.stripePriceIdYearly,
            });
          }

          logger.info(`Created new prices for plan ${existingPlan.name} - Monthly: ${newMonthlyPriceId}, Yearly: ${newYearlyPriceId ?? 'none'}`);
        } catch (error) {
          logger.error(`Failed to create new prices for plan ${existingPlan.name}`, error);
          throw new AppError('Failed to update plan prices in Stripe', 500);
        }
      }
    }

    if (newMonthlyPriceId || newYearlyPriceId !== undefined) {
      await this._subscriptionPlanRepository.updateStripeIds(planId, {
        stripePriceIdMonthly: newMonthlyPriceId ?? existingPlan.stripePriceIdMonthly,
        stripePriceIdYearly: newYearlyPriceId ?? existingPlan.stripePriceIdYearly,
      });
    }

    const updatedPlan = await this._subscriptionPlanRepository.update(planId, data as Partial<SubscriptionPlan>);
    
    if (!updatedPlan) {
      throw new NotFoundError('Subscription plan not found after update');
    }

    if (this._stripeService && updatedPlan.stripeProductId) {
      try {
        if (data.isActive === false) {
          if (updatedPlan.stripePriceIdMonthly) {
            await this._stripeService.archivePrice(updatedPlan.stripePriceIdMonthly);
            if (this._priceHistoryRepository) {
              await this._priceHistoryRepository.archivePrice(updatedPlan.stripePriceIdMonthly);
            }
            logger.info(`Archived Stripe monthly price: ${updatedPlan.stripePriceIdMonthly}`);
          }
          if (updatedPlan.stripePriceIdYearly) {
            await this._stripeService.archivePrice(updatedPlan.stripePriceIdYearly);
            if (this._priceHistoryRepository) {
              await this._priceHistoryRepository.archivePrice(updatedPlan.stripePriceIdYearly);
            }
            logger.info(`Archived Stripe yearly price: ${updatedPlan.stripePriceIdYearly}`);
          }
          await this._stripeService.archiveProduct(updatedPlan.stripeProductId);
          logger.info(`Archived Stripe product: ${updatedPlan.stripeProductId}`);
          
          await this._subscriptionPlanRepository.update(planId, {
            stripeProductId: undefined,
            stripePriceIdMonthly: undefined,
            stripePriceIdYearly: undefined,
          } as Partial<SubscriptionPlan>);
          
          logger.info(`Subscription plan ${updatedPlan.name} unlisted and archived in Stripe`);
        } else if (!priceChanged && !yearlyDiscountChanged) {
          await this._stripeService.updateProduct(updatedPlan.stripeProductId, {
            name: updatedPlan.name,
            description: updatedPlan.description,
            metadata: {
              planId: updatedPlan.id,
              jobPostLimit: String(updatedPlan.jobPostLimit),
              featuredJobLimit: String(updatedPlan.featuredJobLimit),
              applicantAccessLimit: String(updatedPlan.applicantAccessLimit),
            },
          });

          logger.info(`Subscription plan ${updatedPlan.name} synced with Stripe: ${updatedPlan.stripeProductId}`);
        }
      } catch (error) {
        logger.error(`Failed to sync plan ${updatedPlan.name} with Stripe`, error);
      }
    }

    return updatedPlan;
  }
}
