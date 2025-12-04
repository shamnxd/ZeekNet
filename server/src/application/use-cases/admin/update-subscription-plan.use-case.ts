import { ISubscriptionPlanRepository } from '../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { IStripeService } from '../../../domain/interfaces/services/IStripeService';
import { IPriceHistoryRepository } from '../../../domain/interfaces/repositories/price-history/IPriceHistoryRepository';
import { SubscriptionPlan } from '../../../domain/entities/subscription-plan.entity';
import { IUpdateSubscriptionPlanUseCase } from '../../../domain/interfaces/use-cases/ISubscriptionPlanUseCases';
import { AppError, NotFoundError } from '../../../domain/errors/errors';
import { logger } from '../../../infrastructure/config/logger';

export class UpdateSubscriptionPlanUseCase implements IUpdateSubscriptionPlanUseCase {
  constructor(
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly _stripeService?: IStripeService,
    private readonly _priceHistoryRepository?: IPriceHistoryRepository,
  ) {}

  async execute(
    planId: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      duration?: number;
      features?: string[];
      jobPostLimit?: number;
      featuredJobLimit?: number;
      applicantAccessLimit?: number;
      yearlyDiscount?: number;
      isActive?: boolean;
      isPopular?: boolean;
    },
  ): Promise<SubscriptionPlan> {
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

    if (data.isPopular === true) {
      await this._subscriptionPlanRepository.unmarkAllAsPopular();
    }

    // Handle price change: create new Stripe prices and archive old ones
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
          // Archive old prices in Stripe
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

          // Create new monthly price
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

          // Create price history for new monthly price
          if (this._priceHistoryRepository) {
            await this._priceHistoryRepository.create({
              planId: existingPlan.id,
              stripePriceId: monthlyPrice.id,
              type: 'monthly',
              amount: finalPrice,
              isActive: true,
            });
          }

          // Create new yearly price if discount > 0
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

            // Create price history for new yearly price
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

          // Update plan with new price IDs
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

    // Update plan with Stripe IDs if prices changed
    if (newMonthlyPriceId || newYearlyPriceId !== undefined) {
      await this._subscriptionPlanRepository.updateStripeIds(planId, {
        stripePriceIdMonthly: newMonthlyPriceId ?? existingPlan.stripePriceIdMonthly,
        stripePriceIdYearly: newYearlyPriceId ?? existingPlan.stripePriceIdYearly,
      });
    }

    // Update plan with other changes
    const updatedPlan = await this._subscriptionPlanRepository.update(planId, data as Partial<SubscriptionPlan>);
    
    if (!updatedPlan) {
      throw new NotFoundError('Subscription plan not found after update');
    }

    // Sync with Stripe if service is available and plan has Stripe product
    if (this._stripeService && updatedPlan.stripeProductId) {
      try {
        // If plan is being deactivated (unlisted), archive in Stripe
        if (data.isActive === false) {
          // Archive prices
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
          // Archive product
          await this._stripeService.archiveProduct(updatedPlan.stripeProductId);
          logger.info(`Archived Stripe product: ${updatedPlan.stripeProductId}`);
          
          // Clear Stripe IDs from database since product is archived
          await this._subscriptionPlanRepository.update(planId, {
            stripeProductId: undefined,
            stripePriceIdMonthly: undefined,
            stripePriceIdYearly: undefined,
          } as Partial<SubscriptionPlan>);
          
          logger.info(`Subscription plan ${updatedPlan.name} unlisted and archived in Stripe`);
        } else if (!priceChanged && !yearlyDiscountChanged) {
          // Update Stripe product metadata (only if price didn't change)
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
        // Don't throw - the plan is already updated in database
      }
    }

    return updatedPlan;
  }
}
