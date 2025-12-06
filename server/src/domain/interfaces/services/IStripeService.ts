import Stripe from 'stripe';

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
  createCustomer(params: CreateCustomerParams): Promise<Stripe.Customer>;
  getCustomer(customerId: string): Promise<Stripe.Customer | null>;

  createProduct(params: CreateProductParams): Promise<Stripe.Product>;
  updateProduct(productId: string, params: Partial<CreateProductParams>): Promise<Stripe.Product>;
  archiveProduct(productId: string): Promise<Stripe.Product>;
  createPrice(params: CreatePriceParams): Promise<Stripe.Price>;
  archivePrice(priceId: string): Promise<Stripe.Price>;

  createCheckoutSession(params: CreateCheckoutSessionParams): Promise<Stripe.Checkout.Session>;
  createBillingPortalSession(customerId: string, returnUrl: string): Promise<Stripe.BillingPortal.Session>;

  getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null>;
  listSubscriptionsByPrice(priceId: string, limit?: number, startingAfter?: string): Promise<{
    data: Stripe.Subscription[];
    hasMore: boolean;
    lastId?: string;
  }>;
  updateSubscription(params: UpdateSubscriptionParams): Promise<Stripe.Subscription>;
  cancelSubscription(subscriptionId: string, cancelAtPeriodEnd?: boolean): Promise<Stripe.Subscription>;
  resumeSubscription(subscriptionId: string): Promise<Stripe.Subscription>;

  getInvoice(invoiceId: string): Promise<Stripe.Invoice | null>;

  constructWebhookEvent(payload: string | Buffer, signature: string): Stripe.Event;
}