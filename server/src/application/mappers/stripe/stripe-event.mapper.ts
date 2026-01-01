import { BillingCycle } from '../../../domain/enums/billing-cycle.enum';
import {
  PaymentSubscription,
  PaymentInvoice,
} from '../../../domain/types/payment/payment-types';

export class StripeEventMapper {
  static parseSubscriptionDates(subscription: PaymentSubscription, billingCycle?: string): { 
    currentPeriodStart: Date; 
    currentPeriodEnd: Date; 
  } {
    const rawPeriodStart = subscription.currentPeriodStart;
    const rawPeriodEnd = subscription.currentPeriodEnd;
    
    let periodStartTimestamp: number;
    let periodEndTimestamp: number;
    
    if (rawPeriodStart && rawPeriodEnd && 
        rawPeriodStart > 0 && rawPeriodEnd > 0) {
      periodStartTimestamp = rawPeriodStart;
      periodEndTimestamp = rawPeriodEnd;
    } else {
      const baseTimestamp = subscription.startDate || subscription.created || Math.floor(Date.now() / 1000);
      periodStartTimestamp = baseTimestamp;
      const periodDurationSeconds = billingCycle === BillingCycle.YEARLY ? 31536000 : 2592000;
      periodEndTimestamp = baseTimestamp + periodDurationSeconds;
    }

    return {
      currentPeriodStart: new Date(periodStartTimestamp * 1000),
      currentPeriodEnd: new Date(periodEndTimestamp * 1000),
    };
  }

  static getPaymentIntentId(invoice: PaymentInvoice): string | undefined {
    // In our Domain Model, paymentIntent is already resolved to string or {id} or null
    // But our mapper logic in StripeService already resolves it to string or id.
    // Let's safe check our domain type.
    const paymentIntent = invoice.paymentIntent;
    if (!paymentIntent) {
      return undefined;
    }
    return typeof paymentIntent === 'string' ? paymentIntent : paymentIntent.id;
  }

  static getSubscriptionId(invoice: PaymentInvoice): string | undefined {
    return invoice.subscription || undefined;
  }
}
