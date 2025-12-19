import { BillingCycle } from '../../../domain/enums/billing-cycle.enum';

export class StripeCheckoutMapper {
  static toSessionMetadata(data: {
    companyId: string;
    planId: string;
    userId: string;
    billingCycle: BillingCycle;
  }) {
    return {
      companyId: data.companyId,
      planId: data.planId,
      userId: data.userId,
      billingCycle: data.billingCycle,
    };
  }

  static toSubscriptionMetadata(data: {
    companyId: string;
    planId: string;
    billingCycle: BillingCycle;
  }) {
    return {
      companyId: data.companyId,
      planId: data.planId,
      billingCycle: data.billingCycle,
    };
  }

  static toCheckoutSessionParams(data: {
    customerId: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    metadata: Record<string, string>;
    subscriptionMetadata: Record<string, string>;
  }) {
    return {
      customerId: data.customerId,
      priceId: data.priceId,
      successUrl: data.successUrl,
      cancelUrl: data.cancelUrl,
      metadata: data.metadata,
      subscriptionMetadata: data.subscriptionMetadata,
    };
  }
}
