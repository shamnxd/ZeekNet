import Stripe from 'stripe';
import {
  IStripeService,
  CreateProductParams,
  CreatePriceParams,
  CreateCheckoutSessionParams,
  CreateCustomerParams,
  UpdateSubscriptionParams,
} from 'src/domain/interfaces/services/IStripeService';
import {
  PaymentCustomer,
  PaymentProduct,
  PaymentPrice,
  PaymentSession,
  PaymentSubscription,
  PaymentBillingPortalSession,
  PaymentEvent,
  PaymentInvoice,
} from 'src/domain/types/payment/payment-types';
import { logger } from 'src/infrastructure/config/logger';
import { env } from 'src/infrastructure/config/env';
import { StripeWebApiMapper } from 'src/infrastructure/external-services/stripe/mappers/stripe-web-api.mapper';

export class StripeService implements IStripeService {
  private _stripe: Stripe;
  private _webhookSecret: string;

  constructor() {
    this._stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-11-17.clover' as Stripe.LatestApiVersion,
      typescript: true,
    });

    this._webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  }

  

  async createCustomer(params: CreateCustomerParams): Promise<PaymentCustomer> {
    try {
      const customer = await this._stripe.customers.create({
        email: params.email,
        name: params.name,
        metadata: params.metadata,
      });
      logger.info(`Stripe customer created: ${customer.id}`);
      return StripeWebApiMapper.mapCustomer(customer);
    } catch (error) {
      logger.error('Failed to create Stripe customer', error);
      throw error;
    }
  }

  async getCustomer(customerId: string): Promise<PaymentCustomer | null> {
    try {
      const customer = await this._stripe.customers.retrieve(customerId);
      if (customer.deleted) {
        return null;
      }
      return StripeWebApiMapper.mapCustomer(customer as Stripe.Customer);
    } catch (error) {
      logger.error(`Failed to get Stripe customer: ${customerId}`, error);
      return null;
    }
  }

  async createProduct(params: CreateProductParams): Promise<PaymentProduct> {
    try {
      const product = await this._stripe.products.create({
        name: params.name,
        description: params.description,
        metadata: params.metadata,
      });
      logger.info(`Stripe product created: ${product.id}`);
      return StripeWebApiMapper.mapProduct(product);
    } catch (error) {
      logger.error('Failed to create Stripe product', error);
      throw error;
    }
  }

  async updateProduct(
    productId: string,
    params: Partial<CreateProductParams>,
  ): Promise<PaymentProduct> {
    try {
      const product = await this._stripe.products.update(productId, {
        name: params.name,
        description: params.description,
        metadata: params.metadata,
      });
      logger.info(`Stripe product updated: ${product.id}`);
      return StripeWebApiMapper.mapProduct(product);
    } catch (error) {
      logger.error(`Failed to update Stripe product: ${productId}`, error);
      throw error;
    }
  }

  async archiveProduct(productId: string): Promise<PaymentProduct> {
    try {
      const product = await this._stripe.products.update(productId, {
        active: false,
      });
      logger.info(`Stripe product archived: ${product.id}`);
      return StripeWebApiMapper.mapProduct(product);
    } catch (error) {
      logger.error(`Failed to archive Stripe product: ${productId}`, error);
      throw error;
    }
  }

  async createPrice(params: CreatePriceParams): Promise<PaymentPrice> {
    try {
      const price = await this._stripe.prices.create({
        product: params.productId,
        unit_amount: params.unitAmount,
        currency: params.currency,
        recurring: {
          interval: params.interval,
        },
        metadata: params.metadata,
      });
      logger.info(`Stripe price created: ${price.id}`);
      return StripeWebApiMapper.mapPrice(price);
    } catch (error) {
      logger.error('Failed to create Stripe price', error);
      throw error;
    }
  }

  async archivePrice(priceId: string): Promise<PaymentPrice> {
    try {
      const price = await this._stripe.prices.update(priceId, {
        active: false,
      });
      logger.info(`Stripe price archived: ${price.id}`);
      return StripeWebApiMapper.mapPrice(price);
    } catch (error) {
      logger.error(`Failed to archive Stripe price: ${priceId}`, error);
      throw error;
    }
  }

  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<PaymentSession> {
    try {
      const session = await this._stripe.checkout.sessions.create({
        customer: params.customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: params.priceId,
            quantity: 1,
          },
        ],
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        metadata: params.metadata,
        subscription_data: {
          metadata: params.subscriptionMetadata,
        },
        billing_address_collection: 'required',
        customer_update: {
          address: 'auto',
          name: 'auto',
        },
      });
      logger.info(`Stripe checkout session created: ${session.id}`);
      return StripeWebApiMapper.mapSession(session);
    } catch (error) {
      logger.error('Failed to create Stripe checkout session', error);
      throw error;
    }
  }

  async createBillingPortalSession(
    customerId: string,
    returnUrl: string,
  ): Promise<PaymentBillingPortalSession> {
    try {
      const session = await this._stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
      logger.info(`Stripe billing portal session created for customer: ${customerId}`);
      return {
        id: session.id,
        url: session.url,
        returnUrl: session.return_url || undefined,
      };
    } catch (error) {
      logger.error(`Failed to create billing portal session for customer: ${customerId}`, error);
      throw error;
    }
  }

  async getSubscription(subscriptionId: string): Promise<PaymentSubscription | null> {
    try {
      const subscription = await this._stripe.subscriptions.retrieve(subscriptionId);
      return StripeWebApiMapper.mapSubscription(subscription);
    } catch (error) {
      logger.error(`Failed to get Stripe subscription: ${subscriptionId}`, error);
      return null;
    }
  }

  async listSubscriptionsByPrice(
    priceId: string,
    limit: number = 100,
    startingAfter?: string,
  ): Promise<{
    data: PaymentSubscription[];
    hasMore: boolean;
    lastId?: string;
  }> {
    try {
      const params: Stripe.SubscriptionListParams = {
        price: priceId,
        status: 'active',
        limit,
      };

      if (startingAfter) {
        params.starting_after = startingAfter;
      }

      const subscriptions = await this._stripe.subscriptions.list(params);
      
      return {
        data: subscriptions.data.map(s => StripeWebApiMapper.mapSubscription(s)),
        hasMore: subscriptions.has_more,
        lastId: subscriptions.data[subscriptions.data.length - 1]?.id,
      };
    } catch (error) {
      logger.error(`Failed to list subscriptions by price: ${priceId}`, error);
      throw error;
    }
  }

  async updateSubscription(params: UpdateSubscriptionParams): Promise<PaymentSubscription> {
    try {
      const subscription = await this._stripe.subscriptions.retrieve(params.subscriptionId);
      
      const updatedSubscription = await this._stripe.subscriptions.update(params.subscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            price: params.priceId,
          },
        ],
        proration_behavior: params.prorationBehavior || 'create_prorations',
      });
      
      logger.info(`Stripe subscription updated: ${updatedSubscription.id}`);
      return StripeWebApiMapper.mapSubscription(updatedSubscription);
    } catch (error) {
      logger.error(`Failed to update Stripe subscription: ${params.subscriptionId}`, error);
      throw error;
    }
  }

  async cancelSubscription(
    subscriptionId: string,
    cancelAtPeriodEnd: boolean = true,
  ): Promise<PaymentSubscription> {
    try {
      const subscription = cancelAtPeriodEnd
        ? await this._stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        })
        : await this._stripe.subscriptions.cancel(subscriptionId);
      
      logger.info(
        `Stripe subscription ${cancelAtPeriodEnd ? 'set to cancel at period end' : 'canceled immediately'}: ${subscriptionId}`,
      );
      return StripeWebApiMapper.mapSubscription(subscription);
    } catch (error) {
      logger.error(`Failed to cancel Stripe subscription: ${subscriptionId}`, error);
      throw error;
    }
  }

  async resumeSubscription(subscriptionId: string): Promise<PaymentSubscription> {
    try {
      const subscription = await this._stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });
      logger.info(`Stripe subscription resumed: ${subscriptionId}`);
      return StripeWebApiMapper.mapSubscription(subscription);
    } catch (error) {
      logger.error(`Failed to resume Stripe subscription: ${subscriptionId}`, error);
      throw error;
    }
  }

  async getInvoice(invoiceId: string): Promise<PaymentInvoice | null> {
    try { 
      const invoice = await this._stripe.invoices.retrieve(invoiceId);
      return StripeWebApiMapper.mapInvoice(invoice);
    } catch (error) {
      logger.error(`Failed to get Stripe invoice: ${invoiceId}`, error);
      return null;
    }
  }

  constructWebhookEvent(payload: string | Buffer, signature: string): PaymentEvent {
    const event = this._stripe.webhooks.constructEvent(payload, signature, this._webhookSecret);
    return StripeWebApiMapper.mapEvent(event);
  }
}
