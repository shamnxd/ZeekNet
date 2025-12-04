import Stripe from 'stripe';
import {
  IStripeService,
  CreateProductParams,
  CreatePriceParams,
  CreateCheckoutSessionParams,
  CreateCustomerParams,
  UpdateSubscriptionParams,
} from '../../../domain/interfaces/services/IStripeService';
import { logger } from '../../config/logger';

export class StripeService implements IStripeService {
  private stripe: Stripe;
  private webhookSecret: string;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-11-17.clover',
      typescript: true,
    });

    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  }

  async createCustomer(params: CreateCustomerParams): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email: params.email,
        name: params.name,
        metadata: params.metadata,
      });
      logger.info(`Stripe customer created: ${customer.id}`);
      return customer;
    } catch (error) {
      logger.error('Failed to create Stripe customer', error);
      throw error;
    }
  }

  async getCustomer(customerId: string): Promise<Stripe.Customer | null> {
    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      if (customer.deleted) {
        return null;
      }
      return customer as Stripe.Customer;
    } catch (error) {
      logger.error(`Failed to get Stripe customer: ${customerId}`, error);
      return null;
    }
  }

  async createProduct(params: CreateProductParams): Promise<Stripe.Product> {
    try {
      const product = await this.stripe.products.create({
        name: params.name,
        description: params.description,
        metadata: params.metadata,
      });
      logger.info(`Stripe product created: ${product.id}`);
      return product;
    } catch (error) {
      logger.error('Failed to create Stripe product', error);
      throw error;
    }
  }

  async updateProduct(
    productId: string,
    params: Partial<CreateProductParams>,
  ): Promise<Stripe.Product> {
    try {
      const product = await this.stripe.products.update(productId, {
        name: params.name,
        description: params.description,
        metadata: params.metadata,
      });
      logger.info(`Stripe product updated: ${product.id}`);
      return product;
    } catch (error) {
      logger.error(`Failed to update Stripe product: ${productId}`, error);
      throw error;
    }
  }

  async archiveProduct(productId: string): Promise<Stripe.Product> {
    try {
      const product = await this.stripe.products.update(productId, {
        active: false,
      });
      logger.info(`Stripe product archived: ${product.id}`);
      return product;
    } catch (error) {
      logger.error(`Failed to archive Stripe product: ${productId}`, error);
      throw error;
    }
  }

  async createPrice(params: CreatePriceParams): Promise<Stripe.Price> {
    try {
      const price = await this.stripe.prices.create({
        product: params.productId,
        unit_amount: params.unitAmount,
        currency: params.currency,
        recurring: {
          interval: params.interval,
        },
        metadata: params.metadata,
      });
      logger.info(`Stripe price created: ${price.id}`);
      return price;
    } catch (error) {
      logger.error('Failed to create Stripe price', error);
      throw error;
    }
  }

  async archivePrice(priceId: string): Promise<Stripe.Price> {
    try {
      const price = await this.stripe.prices.update(priceId, {
        active: false,
      });
      logger.info(`Stripe price archived: ${price.id}`);
      return price;
    } catch (error) {
      logger.error(`Failed to archive Stripe price: ${priceId}`, error);
      throw error;
    }
  }

  async createCheckoutSession(
    params: CreateCheckoutSessionParams,
  ): Promise<Stripe.Checkout.Session> {
    try {
      const session = await this.stripe.checkout.sessions.create({
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
      return session;
    } catch (error) {
      logger.error('Failed to create Stripe checkout session', error);
      throw error;
    }
  }

  async createBillingPortalSession(
    customerId: string,
    returnUrl: string,
  ): Promise<Stripe.BillingPortal.Session> {
    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
      logger.info(`Stripe billing portal session created for customer: ${customerId}`);
      return session;
    } catch (error) {
      logger.error(`Failed to create billing portal session for customer: ${customerId}`, error);
      throw error;
    }
  }

  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
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
    data: Stripe.Subscription[];
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

      const subscriptions = await this.stripe.subscriptions.list(params);
      
      return {
        data: subscriptions.data,
        hasMore: subscriptions.has_more,
        lastId: subscriptions.data[subscriptions.data.length - 1]?.id,
      };
    } catch (error) {
      logger.error(`Failed to list subscriptions by price: ${priceId}`, error);
      throw error;
    }
  }

  async updateSubscription(params: UpdateSubscriptionParams): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(params.subscriptionId);
      
      const updatedSubscription = await this.stripe.subscriptions.update(params.subscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            price: params.priceId,
          },
        ],
        proration_behavior: params.prorationBehavior || 'create_prorations',
      });
      
      logger.info(`Stripe subscription updated: ${updatedSubscription.id}`);
      return updatedSubscription;
    } catch (error) {
      logger.error(`Failed to update Stripe subscription: ${params.subscriptionId}`, error);
      throw error;
    }
  }

  async cancelSubscription(
    subscriptionId: string,
    cancelAtPeriodEnd: boolean = true,
  ): Promise<Stripe.Subscription> {
    try {
      const subscription = cancelAtPeriodEnd
        ? await this.stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        })
        : await this.stripe.subscriptions.cancel(subscriptionId);
      
      logger.info(
        `Stripe subscription ${cancelAtPeriodEnd ? 'set to cancel at period end' : 'canceled immediately'}: ${subscriptionId}`,
      );
      return subscription;
    } catch (error) {
      logger.error(`Failed to cancel Stripe subscription: ${subscriptionId}`, error);
      throw error;
    }
  }

  async resumeSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });
      logger.info(`Stripe subscription resumed: ${subscriptionId}`);
      return subscription;
    } catch (error) {
      logger.error(`Failed to resume Stripe subscription: ${subscriptionId}`, error);
      throw error;
    }
  }

  async getInvoice(invoiceId: string): Promise<Stripe.Invoice | null> {
    try {
      return await this.stripe.invoices.retrieve(invoiceId);
    } catch (error) {
      logger.error(`Failed to get Stripe invoice: ${invoiceId}`, error);
      return null;
    }
  }

  constructWebhookEvent(payload: string | Buffer, signature: string): Stripe.Event {
    if (!this.webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
    }
    
    return this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
  }
}