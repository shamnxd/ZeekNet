import Stripe from 'stripe';
import { BillingCycle } from '../../../domain/enums/billing-cycle.enum';

export class StripeEventMapper {
  static parseSubscriptionDates(subscription: Stripe.Subscription, billingCycle?: string): { 
    currentPeriodStart: Date; 
    currentPeriodEnd: Date; 
  } {
    const rawPeriodStart = (subscription as Stripe.Subscription & { current_period_start?: number }).current_period_start;
    const rawPeriodEnd = (subscription as Stripe.Subscription & { current_period_end?: number }).current_period_end;
    
    let periodStartTimestamp: number;
    let periodEndTimestamp: number;
    
    if (rawPeriodStart && rawPeriodEnd && 
        typeof rawPeriodStart === 'number' && typeof rawPeriodEnd === 'number' &&
        rawPeriodStart > 0 && rawPeriodEnd > 0) {
      periodStartTimestamp = rawPeriodStart;
      periodEndTimestamp = rawPeriodEnd;
    } else {
      const baseTimestamp = subscription.start_date || subscription.created || Math.floor(Date.now() / 1000);
      periodStartTimestamp = baseTimestamp;
      const periodDurationSeconds = billingCycle === BillingCycle.YEARLY ? 31536000 : 2592000;
      periodEndTimestamp = baseTimestamp + periodDurationSeconds;
    }

    return {
      currentPeriodStart: new Date(periodStartTimestamp * 1000),
      currentPeriodEnd: new Date(periodEndTimestamp * 1000),
    };
  }

  static getPaymentIntentId(invoice: Stripe.Invoice): string | undefined {
    const paymentIntent = (invoice as Stripe.Invoice & { payment_intent?: string | { id?: string } }).payment_intent;
    if (!paymentIntent) {
      return undefined;
    }
    return typeof paymentIntent === 'string' ? paymentIntent : paymentIntent.id;
  }

  static getSubscriptionId(invoice: Stripe.Invoice): string | undefined {
    let invoiceSubscription: string | Stripe.Subscription | null = (invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null }).subscription || null;
    
    if (!invoiceSubscription) {
      const isSubscriptionInvoice = invoice.billing_reason?.includes('subscription');
      if (!isSubscriptionInvoice) {
        return undefined;
      }
      
      if (invoice.lines?.data?.[0]?.subscription) {
        invoiceSubscription = typeof invoice.lines.data[0].subscription === 'string' 
          ? invoice.lines.data[0].subscription 
          : invoice.lines.data[0].subscription.id;
      }
      
      if (!invoiceSubscription) {
        return undefined;
      }
    }

    return typeof invoiceSubscription === 'string' ? invoiceSubscription : invoiceSubscription.id;
  }
}
