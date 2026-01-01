import {
  PaymentCustomer,
  PaymentProduct,
  PaymentPrice,
  PaymentSession,
  PaymentSubscription,
  PaymentBillingPortalSession,
  PaymentEvent,
  PaymentInvoice,
} from '../../types/payment/payment-types';

export interface CreateProductParams {
  name: string;
  description: string;
  metadata?: Record<string, string>;
}

export interface CreatePriceParams {
  productId: string;
  unitAmount: number;
  currency: string;
  interval: 'month' | 'year';
  metadata?: Record<string, string>;
}

export interface CreateCheckoutSessionParams {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
  subscriptionMetadata?: Record<string, string>;
}

export interface CreateCustomerParams {
  email: string;
  name: string;
  metadata?: Record<string, string>;
}

export interface UpdateSubscriptionParams {
  subscriptionId: string;
  priceId: string;
  prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice';
}

export interface IStripeService {
  createCustomer(params: CreateCustomerParams): Promise<PaymentCustomer>;
  getCustomer(customerId: string): Promise<PaymentCustomer | null>;

  createProduct(params: CreateProductParams): Promise<PaymentProduct>;
  updateProduct(productId: string, params: Partial<CreateProductParams>): Promise<PaymentProduct>;
  archiveProduct(productId: string): Promise<PaymentProduct>;
  createPrice(params: CreatePriceParams): Promise<PaymentPrice>;
  archivePrice(priceId: string): Promise<PaymentPrice>;

  createCheckoutSession(params: CreateCheckoutSessionParams): Promise<PaymentSession>;
  createBillingPortalSession(customerId: string, returnUrl: string): Promise<PaymentBillingPortalSession>;

  getSubscription(subscriptionId: string): Promise<PaymentSubscription | null>;
  listSubscriptionsByPrice(priceId: string, limit?: number, startingAfter?: string): Promise<{
    data: PaymentSubscription[];
    hasMore: boolean;
    lastId?: string;
  }>;
  updateSubscription(params: UpdateSubscriptionParams): Promise<PaymentSubscription>;
  cancelSubscription(subscriptionId: string, cancelAtPeriodEnd?: boolean): Promise<PaymentSubscription>;
  resumeSubscription(subscriptionId: string): Promise<PaymentSubscription>;

  getInvoice(invoiceId: string): Promise<PaymentInvoice | null>;

  constructWebhookEvent(payload: string | Buffer, signature: string): PaymentEvent;
}
