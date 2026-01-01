import { ISubscriptionPlanRepository } from '../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { IStripeService } from '../../../domain/interfaces/services/IStripeService';
import { IPriceHistoryRepository } from '../../../domain/interfaces/repositories/price-history/IPriceHistoryRepository';
import { ICompanySubscriptionRepository } from '../../../domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { IMailerService } from '../../../domain/interfaces/services/IMailerService';
import { IEmailTemplateService } from '../../../domain/interfaces/services/IEmailTemplateService';
import { BadRequestError, NotFoundError } from '../../../domain/errors/errors';
import { ILogger } from '../../../domain/interfaces/services/ILogger';
import { IMigratePlanSubscribersUseCase } from '../../interfaces/use-cases/subscriptions/IMigratePlanSubscribersUseCase';
import { MigratePlanSubscribersRequestDto } from '../../dto/admin/subscription-plan-management.dto';
import { MigratePlanSubscribersResult } from '../../dto/subscriptions/migrate-plan-subscribers-result.dto';
import { PriceType } from '../../../domain/entities/price-history.entity';
import { PaymentSubscription } from '../../../domain/types/payment/payment-types';

export class MigratePlanSubscribersUseCase implements IMigratePlanSubscribersUseCase {
  constructor(
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly _stripeService: IStripeService,
    private readonly _priceHistoryRepository: IPriceHistoryRepository,
    private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
    private readonly _mailerService: IMailerService,
    private readonly _logger: ILogger,
    private readonly _emailTemplateService: IEmailTemplateService,
  ) {}

  async execute(data: MigratePlanSubscribersRequestDto): Promise<MigratePlanSubscribersResult> {
    const { planId, billingCycle = 'both', prorationBehavior = 'none' } = data;
    const plan = await this._subscriptionPlanRepository.findById(planId);
    
    if (!plan) {
      throw new NotFoundError('Subscription plan not found');
    }

    if (!plan.stripeProductId) {
      throw new BadRequestError('Plan does not have Stripe integration');
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

    if (billingCycle === 'monthly' || billingCycle === 'both') {
      const monthlyResult = await this.migrateByType(plan.id, plan.name, PriceType.MONTHLY, prorationBehavior);
      result.fromPriceId = monthlyResult.fromPriceId || result.fromPriceId;
      result.toPriceId = monthlyResult.toPriceId || result.toPriceId;
      result.migratedCount += monthlyResult.migratedCount;
      result.failedCount += monthlyResult.failedCount;
      result.errors.push(...monthlyResult.errors);
    }

    if (billingCycle === 'yearly' || billingCycle === 'both') {
      const yearlyResult = await this.migrateByType(plan.id, plan.name, PriceType.YEARLY, prorationBehavior);
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

    this._logger.info(
      `Migration completed for plan ${plan.name}: ${result.migratedCount} migrated, ${result.failedCount} failed`,
    );

    return result;
  }

  private async migrateByType(
    planId: string,
    planName: string,
    type: PriceType,
    prorationBehavior: 'none' | 'create_prorations' | 'always_invoice',
  ): Promise<{
    fromPriceId: string;
    toPriceId: string;
    migratedCount: number;
    failedCount: number;
    errors: string[];
  }> {
    const oldPriceHistory = await this._priceHistoryRepository.findLastArchivedByPlanIdAndType(planId, type);
    
    if (!oldPriceHistory) {
      this._logger.info(`No archived ${type} price found for plan ${planId}`);
      return {
        fromPriceId: '',
        toPriceId: '',
        migratedCount: 0,
        failedCount: 0,
        errors: [`No archived ${type} price found`],
      };
    }

    const currentPriceHistory = await this._priceHistoryRepository.findActiveByPlanIdAndType(planId, type);
    
    if (!currentPriceHistory) {
      this._logger.warn(`No active ${type} price found for plan ${planId}`);
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

    this._logger.info(`Migrating ${type} subscriptions from ${fromPriceId} to ${toPriceId}`);

    let migratedCount = 0;
    let failedCount = 0;
    const errors: string[] = [];
    let startingAfter: string | undefined;

    do {
      try {
        const { data: subscriptions, hasMore, lastId } = await this._stripeService.listSubscriptionsByPrice(
          fromPriceId,
          100,
          startingAfter,
        );

        for (const subscription of subscriptions) {
          try {
            const subscriptionItem = subscription.items.data[0];
            if (!subscriptionItem) {
              errors.push(`Subscription ${subscription.id} has no items`);
              failedCount++;
              continue;
            }

            // subscriptionItem.price now refers to PaymentPrice which has unitAmount
            const priceAmount = typeof subscriptionItem.price.unitAmount === 'number' 
                ? subscriptionItem.price.unitAmount 
                : 0;
            const oldPrice = priceAmount / 100;
            
            await this._stripeService.updateSubscription({
              subscriptionId: subscription.id,
              priceId: toPriceId,
              prorationBehavior,
            });

            const updatedSubscription = await this._stripeService.getSubscription(subscription.id);
            const newPriceItem = updatedSubscription?.items.data[0];
            
            const newPriceAmount = newPriceItem?.price.unitAmount && typeof newPriceItem.price.unitAmount === 'number' 
                ? newPriceItem.price.unitAmount 
                : (priceAmount || 0);
            
            const newPrice = newPriceAmount / 100;

            await this.sendMigrationEmail(subscription, planName, oldPrice, newPrice, type);

            migratedCount++;
            this._logger.info(`Migrated subscription ${subscription.id} from ${fromPriceId} to ${toPriceId}`);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            errors.push(`Failed to migrate subscription ${subscription.id}: ${errorMessage}`);
            failedCount++;
            this._logger.error(`Failed to migrate subscription ${subscription.id}`, error);
          }
        }

        startingAfter = hasMore ? lastId : undefined;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push(`Failed to list subscriptions: ${errorMessage}`);
        this._logger.error(`Failed to list subscriptions for price ${fromPriceId}`, error);
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

  private async sendMigrationEmail(
    subscription: PaymentSubscription,
    planName: string,
    oldPrice: number,
    newPrice: number,
    billingCycle: 'monthly' | 'yearly',
  ): Promise<void> {
    try {
      let customerEmail: string | undefined;
      let companyName: string | undefined;

      if (typeof subscription.customerId === 'string') {
        const customer = await this._stripeService.getCustomer(subscription.customerId);
        if (customer && !customer.deleted) {
          customerEmail = customer.email || undefined;
          companyName = customer.name || undefined;
        }
      } else if (subscription.customerId && typeof subscription.customerId === 'object') {
        const customer = subscription.customerId;
        if (!customer.deleted) {
          customerEmail = customer.email || undefined;
          companyName = customer.name || undefined;
        }
      }

      if (!companyName && subscription.id) {
        await this._companySubscriptionRepository.findByStripeSubscriptionId(subscription.id);
      }

      if (!customerEmail) {
        this._logger.warn(`Cannot send migration email: No email found for subscription ${subscription.id}`);
        return;
      }

      const { subject, html } = this._emailTemplateService.getSubscriptionMigrationEmail(planName, oldPrice, newPrice, billingCycle, companyName);
      
      await this._mailerService.sendMail(customerEmail, subject, html);
      this._logger.info(`Sent migration email to ${customerEmail} for subscription ${subscription.id}`);
    } catch (error) {
      this._logger.error(`Failed to send migration email for subscription ${subscription.id}`, error);
    }
  }
}
