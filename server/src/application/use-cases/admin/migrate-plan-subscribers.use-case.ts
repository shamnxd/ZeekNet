import { ISubscriptionPlanRepository } from '../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { IStripeService } from '../../../domain/interfaces/services/IStripeService';
import { IPriceHistoryRepository } from '../../../domain/interfaces/repositories/price-history/IPriceHistoryRepository';
import { NotFoundError, AppError } from '../../../domain/errors/errors';
import { logger } from '../../../infrastructure/config/logger';

type BillingCycle = 'monthly' | 'yearly' | 'both';
type ProrationBehavior = 'none' | 'create_prorations' | 'always_invoice';

interface MigratePlanSubscribersResult {
  planId: string;
  planName: string;
  billingCycle: BillingCycle;
  fromPriceId: string;
  toPriceId: string;
  migratedCount: number;
  failedCount: number;
  errors: string[];
}

export class MigratePlanSubscribersUseCase {
  constructor(
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly _stripeService: IStripeService,
    private readonly _priceHistoryRepository: IPriceHistoryRepository,
  ) {}

  async execute(
    planId: string,
    billingCycle: BillingCycle = 'both',
    prorationBehavior: ProrationBehavior = 'none',
  ): Promise<MigratePlanSubscribersResult> {
    const plan = await this._subscriptionPlanRepository.findById(planId);
    
    if (!plan) {
      throw new NotFoundError('Subscription plan not found');
    }

    if (!plan.stripeProductId) {
      throw new AppError('Plan does not have Stripe integration', 400);
    }

    const result: MigratePlanSubscribersResult = {
      planId: plan.id,
      planName: plan.name,
      billingCycle,
      fromPriceId: '',
      toPriceId: '',
      migratedCount: 0,
      failedCount: 0,
      errors: [],
    };

    // Migrate monthly subscriptions
    if (billingCycle === 'monthly' || billingCycle === 'both') {
      const monthlyResult = await this.migrateByType(plan.id, 'monthly', prorationBehavior);
      result.fromPriceId = monthlyResult.fromPriceId || result.fromPriceId;
      result.toPriceId = monthlyResult.toPriceId || result.toPriceId;
      result.migratedCount += monthlyResult.migratedCount;
      result.failedCount += monthlyResult.failedCount;
      result.errors.push(...monthlyResult.errors);
    }

    // Migrate yearly subscriptions
    if (billingCycle === 'yearly' || billingCycle === 'both') {
      const yearlyResult = await this.migrateByType(plan.id, 'yearly', prorationBehavior);
      if (!result.fromPriceId) {
        result.fromPriceId = yearlyResult.fromPriceId || '';
      }
      if (!result.toPriceId) {
        result.toPriceId = yearlyResult.toPriceId || '';
      }
      result.migratedCount += yearlyResult.migratedCount;
      result.failedCount += yearlyResult.failedCount;
      result.errors.push(...yearlyResult.errors);
    }

    logger.info(
      `Migration completed for plan ${plan.name}: ${result.migratedCount} migrated, ${result.failedCount} failed`,
    );

    return result;
  }

  private async migrateByType(
    planId: string,
    type: 'monthly' | 'yearly',
    prorationBehavior: ProrationBehavior,
  ): Promise<{
    fromPriceId: string;
    toPriceId: string;
    migratedCount: number;
    failedCount: number;
    errors: string[];
  }> {
    // Find last archived price (the one we want to migrate FROM)
    const oldPriceHistory = await this._priceHistoryRepository.findLastArchivedByPlanIdAndType(planId, type);
    
    if (!oldPriceHistory) {
      logger.info(`No archived ${type} price found for plan ${planId}`);
      return {
        fromPriceId: '',
        toPriceId: '',
        migratedCount: 0,
        failedCount: 0,
        errors: [`No archived ${type} price found`],
      };
    }

    // Find current active price (the one we want to migrate TO)
    const currentPriceHistory = await this._priceHistoryRepository.findActiveByPlanIdAndType(planId, type);
    
    if (!currentPriceHistory) {
      logger.warn(`No active ${type} price found for plan ${planId}`);
      return {
        fromPriceId: oldPriceHistory.stripePriceId,
        toPriceId: '',
        migratedCount: 0,
        failedCount: 0,
        errors: [`No active ${type} price found`],
      };
    }

    const fromPriceId = oldPriceHistory.stripePriceId;
    const toPriceId = currentPriceHistory.stripePriceId;

    logger.info(`Migrating ${type} subscriptions from ${fromPriceId} to ${toPriceId}`);

    let migratedCount = 0;
    let failedCount = 0;
    const errors: string[] = [];
    let startingAfter: string | undefined;

    // Paginate through all subscriptions on the old price
    do {
      try {
        const { data: subscriptions, hasMore, lastId } = await this._stripeService.listSubscriptionsByPrice(
          fromPriceId,
          100,
          startingAfter,
        );

        // Migrate each subscription
        for (const subscription of subscriptions) {
          try {
            const subscriptionItem = subscription.items.data[0];
            if (!subscriptionItem) {
              errors.push(`Subscription ${subscription.id} has no items`);
              failedCount++;
              continue;
            }

            await this._stripeService.updateSubscription({
              subscriptionId: subscription.id,
              priceId: toPriceId,
              prorationBehavior,
            });

            migratedCount++;
            logger.info(`Migrated subscription ${subscription.id} from ${fromPriceId} to ${toPriceId}`);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            errors.push(`Failed to migrate subscription ${subscription.id}: ${errorMessage}`);
            failedCount++;
            logger.error(`Failed to migrate subscription ${subscription.id}`, error);
          }
        }

        startingAfter = hasMore ? lastId : undefined;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push(`Failed to list subscriptions: ${errorMessage}`);
        logger.error(`Failed to list subscriptions for price ${fromPriceId}`, error);
        break;
      }
    } while (startingAfter);

    return {
      fromPriceId,
      toPriceId,
      migratedCount,
      failedCount,
      errors,
    };
  }
}
