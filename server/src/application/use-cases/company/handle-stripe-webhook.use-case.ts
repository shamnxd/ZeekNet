import Stripe from 'stripe';
import { IStripeService } from '../../../domain/interfaces/services/IStripeService';
import { ISubscriptionPlanRepository } from '../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { ICompanySubscriptionRepository } from '../../../domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { IPaymentOrderRepository } from '../../../domain/interfaces/repositories/payment/IPaymentOrderRepository';
import { INotificationRepository } from '../../../domain/interfaces/repositories/notification/INotificationRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { PaymentOrder } from '../../../domain/entities/payment-order.entity';
import { SubscriptionStatus } from '../../../domain/entities/company-subscription.entity';
import { NotificationType, Notification } from '../../../domain/entities/notification.entity';
import { logger } from '../../../infrastructure/config/logger';

export class HandleStripeWebhookUseCase {
  constructor(
    private readonly _stripeService: IStripeService,
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
    private readonly _paymentOrderRepository: IPaymentOrderRepository,
    private readonly _notificationRepository: INotificationRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(payload: string | Buffer, signature: string): Promise<{ received: boolean }> {
    try {
      const event = this._stripeService.constructWebhookEvent(payload, signature);

      switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'invoice.paid':
      case 'invoice.payment_succeeded':
        await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      }

      return { received: true };
    } catch (error) {
      logger.error(`Error processing Stripe webhook: ${(error as Error).message}`, { error });
      return { received: true };
    }
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
    try {
      const { companyId, planId, billingCycle } = session.metadata || {};
      
      if (!companyId || !planId || !session.subscription) {
        logger.error('Missing required metadata in checkout session', { sessionId: session.id });
        return;
      }

      const stripeSubscriptionId = typeof session.subscription === 'string' 
        ? session.subscription 
        : session.subscription.id;

      const existingSubscription = await this._companySubscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId);
      if (existingSubscription) {
        return;
      }

      const stripeSubscription = await this._stripeService.getSubscription(stripeSubscriptionId);
      if (!stripeSubscription) {
        logger.error('Failed to get Stripe subscription', { stripeSubscriptionId });
        return;
      }

      const plan = await this._subscriptionPlanRepository.findById(planId);
      if (!plan) {
        logger.error('Plan not found', { planId });
        return;
      }

      const rawPeriodStart = (stripeSubscription as Stripe.Subscription & { current_period_start?: number }).current_period_start;
      const rawPeriodEnd = (stripeSubscription as Stripe.Subscription & { current_period_end?: number }).current_period_end;
      
      let periodStartTimestamp: number;
      let periodEndTimestamp: number;
      
      if (rawPeriodStart && rawPeriodEnd && 
          typeof rawPeriodStart === 'number' && typeof rawPeriodEnd === 'number' &&
          rawPeriodStart > 0 && rawPeriodEnd > 0) {
        periodStartTimestamp = rawPeriodStart;
        periodEndTimestamp = rawPeriodEnd;
      } else {
        const baseTimestamp = stripeSubscription.start_date || stripeSubscription.created || Math.floor(Date.now() / 1000);
        periodStartTimestamp = baseTimestamp;
        const periodDurationSeconds = billingCycle === 'yearly' ? 31536000 : 2592000;
        periodEndTimestamp = baseTimestamp + periodDurationSeconds;
      }

      const currentPeriodStart = new Date(periodStartTimestamp * 1000);
      const currentPeriodEnd = new Date(periodEndTimestamp * 1000);

      if (isNaN(currentPeriodStart.getTime()) || isNaN(currentPeriodEnd.getTime())) {
        throw new Error('Invalid date conversion from Stripe subscription');
      }

      const subscription = await this._companySubscriptionRepository.create({
        companyId,
        planId,
        startDate: currentPeriodStart,
        expiryDate: currentPeriodEnd,
        isActive: true,
        jobPostsUsed: 0,
        featuredJobsUsed: 0,
        applicantAccessUsed: 0,
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId,
        stripeStatus: stripeSubscription.status as SubscriptionStatus,
        billingCycle: billingCycle as 'monthly' | 'yearly',
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end || false,
        currentPeriodStart,
        currentPeriodEnd,
      });

      if (stripeSubscription.latest_invoice) {
        const invoiceId = typeof stripeSubscription.latest_invoice === 'string'
          ? stripeSubscription.latest_invoice
          : stripeSubscription.latest_invoice.id;
        const invoice = await this._stripeService.getInvoice(invoiceId);

        if (invoice && invoice.status === 'paid' && invoice.amount_paid) {
          const existingPaymentOrder = await this._paymentOrderRepository.findByStripeInvoiceId(invoice.id);
          if (!existingPaymentOrder) {
            await this._paymentOrderRepository.create(
              PaymentOrder.create({
                id: '',
                companyId,
                planId,
                amount: invoice.amount_paid / 100,
                currency: invoice.currency.toUpperCase(),
                status: 'completed',
                paymentMethod: 'stripe',
                invoiceId: invoice.number || undefined,
                transactionId: this.getPaymentIntentId(invoice),
                stripeInvoiceId: invoice.id,
                stripeInvoiceUrl: invoice.hosted_invoice_url || undefined,
                stripeInvoicePdf: invoice.invoice_pdf || undefined,
                stripePaymentIntentId: this.getPaymentIntentId(invoice),
                subscriptionId: subscription.id,
                billingCycle: billingCycle as 'monthly' | 'yearly',
                metadata: {
                  planName: plan.name,
                  billingCycle: billingCycle,
                },
              }),
            );
          }
        }
      }

      const companyProfile = await this._companyProfileRepository.findById(companyId);
      if (companyProfile) {
        await this._notificationRepository.create({
          userId: companyProfile.userId,
          title: 'Subscription Activated',
          message: `Your ${plan.name} subscription has been activated successfully.`,
          type: NotificationType.SYSTEM,
          isRead: false,
        } as Omit<Notification, 'id' | '_id' | 'createdAt' | 'updatedAt'>);
      }
    } catch (error) {
      logger.error('Error handling checkout.session.completed webhook', { error, sessionId: session.id });
      throw error;
    }
  }

  private getPaymentIntentId(invoice: Stripe.Invoice): string | undefined {
    const paymentIntent = (invoice as Stripe.Invoice & { payment_intent?: string | { id?: string } }).payment_intent;
    if (!paymentIntent) {
      return undefined;
    }
    return typeof paymentIntent === 'string' ? paymentIntent : paymentIntent.id;
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    let invoiceSubscription: string | Stripe.Subscription | null = (invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null }).subscription || null;
    
    if (!invoiceSubscription) {
      const isSubscriptionInvoice = invoice.billing_reason?.includes('subscription');
      if (!isSubscriptionInvoice) {
        return;
      }
      
      if (invoice.lines?.data?.[0]?.subscription) {
        invoiceSubscription = typeof invoice.lines.data[0].subscription === 'string' 
          ? invoice.lines.data[0].subscription 
          : invoice.lines.data[0].subscription.id;
      }
      
      if (!invoiceSubscription) {
        return;
      }
    }

    const stripeSubscriptionId = typeof invoiceSubscription === 'string'
      ? invoiceSubscription
      : invoiceSubscription.id;

    const existingPaymentOrder = await this._paymentOrderRepository.findByStripeInvoiceId(invoice.id);
    if (existingPaymentOrder) {
      const subscription = await this._companySubscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId);
      if (subscription) {
        const stripeSubscription = await this._stripeService.getSubscription(stripeSubscriptionId);
        const periodEndTimestamp = (stripeSubscription as Stripe.Subscription & { current_period_end?: number })?.current_period_end;
        if (stripeSubscription && periodEndTimestamp) {
          const currentPeriodEnd = new Date(periodEndTimestamp * 1000);
          if (!isNaN(currentPeriodEnd.getTime())) {
            await this._companySubscriptionRepository.update(subscription.id, {
              expiryDate: currentPeriodEnd,
              currentPeriodEnd,
              stripeStatus: stripeSubscription.status as SubscriptionStatus,
              isActive: true,
            });
          }
        }
      }
      return;
    }

    let subscription = await this._companySubscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId);
    
    if (!subscription) {
      const stripeSubscription = await this._stripeService.getSubscription(stripeSubscriptionId);
      if (stripeSubscription?.metadata?.companyId && stripeSubscription.metadata.planId) {
        const plan = await this._subscriptionPlanRepository.findById(stripeSubscription.metadata.planId);
        if (plan) {
          await this._paymentOrderRepository.create(
            PaymentOrder.create({
              id: '',
              companyId: stripeSubscription.metadata.companyId,
              planId: stripeSubscription.metadata.planId,
              amount: (invoice.amount_paid || 0) / 100,
              currency: invoice.currency.toUpperCase(),
              status: 'completed',
              paymentMethod: 'stripe',
              invoiceId: invoice.number || undefined,
              transactionId: this.getPaymentIntentId(invoice),
              stripeInvoiceId: invoice.id,
              stripeInvoiceUrl: invoice.hosted_invoice_url || undefined,
              stripeInvoicePdf: invoice.invoice_pdf || undefined,
              stripePaymentIntentId: this.getPaymentIntentId(invoice),
              billingCycle: stripeSubscription.metadata.billingCycle as 'monthly' | 'yearly' | undefined,
              metadata: {
                planName: plan.name,
                billingCycle: stripeSubscription.metadata.billingCycle,
              },
            }),
          );
        }
      }
      return;
    }

    const stripeSubscription = await this._stripeService.getSubscription(stripeSubscriptionId);
    if (stripeSubscription) {
      const periodEndTimestamp = (stripeSubscription as Stripe.Subscription & { current_period_end?: number }).current_period_end;
      if (periodEndTimestamp) {
        const currentPeriodEnd = new Date(periodEndTimestamp * 1000);
        if (!isNaN(currentPeriodEnd.getTime())) {
          await this._companySubscriptionRepository.update(subscription.id, {
            expiryDate: currentPeriodEnd,
            currentPeriodEnd,
            stripeStatus: stripeSubscription.status as SubscriptionStatus,
            isActive: true,
          });
        }
      }
    }

    const plan = await this._subscriptionPlanRepository.findById(subscription.planId);
    await this._paymentOrderRepository.create(
      PaymentOrder.create({
        id: '',
        companyId: subscription.companyId,
        planId: subscription.planId,
        amount: (invoice.amount_paid || 0) / 100,
        currency: invoice.currency.toUpperCase(),
        status: 'completed',
        paymentMethod: 'stripe',
        invoiceId: invoice.number || undefined,
        transactionId: this.getPaymentIntentId(invoice),
        stripeInvoiceId: invoice.id,
        stripeInvoiceUrl: invoice.hosted_invoice_url || undefined,
        stripeInvoicePdf: invoice.invoice_pdf || undefined,
        stripePaymentIntentId: this.getPaymentIntentId(invoice),
        subscriptionId: subscription.id,
        billingCycle: subscription.billingCycle,
        metadata: {
          planName: plan?.name || 'Unknown Plan',
          billingCycle: subscription.billingCycle,
        },
      }),
    );
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    const invoiceSubscription = (invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null }).subscription;
    if (!invoiceSubscription) {
      return;
    }

    const stripeSubscriptionId = typeof invoiceSubscription === 'string'
      ? invoiceSubscription
      : invoiceSubscription.id;

    const subscription = await this._companySubscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId);
    if (!subscription) {
      return;
    }

    await this._companySubscriptionRepository.update(subscription.id, {
      stripeStatus: 'past_due',
      isActive: false,
    });

    const companyProfile = await this._companyProfileRepository.findById(subscription.companyId);
    if (companyProfile) {
      await this._notificationRepository.create({
        userId: companyProfile.userId,
        title: 'Payment Failed',
        message: 'Your subscription payment has failed. Please update your payment method to continue using premium features.',
        type: NotificationType.SYSTEM,
        isRead: false,
      } as Omit<Notification, 'id' | '_id' | 'createdAt' | 'updatedAt'>);
    }

    await this._paymentOrderRepository.create(
      PaymentOrder.create({
        id: '',
        companyId: subscription.companyId,
        planId: subscription.planId,
        amount: (invoice.amount_due || 0) / 100,
        currency: invoice.currency.toUpperCase(),
        status: 'failed',
        paymentMethod: 'stripe',
        invoiceId: invoice.number || undefined,
        stripeInvoiceId: invoice.id,
        subscriptionId: subscription.id,
        billingCycle: subscription.billingCycle,
        metadata: {
          failureReason: 'Payment declined',
        },
      }),
    );
  }

  private async handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription): Promise<void> {
    const subscription = await this._companySubscriptionRepository.findByStripeSubscriptionId(stripeSubscription.id);
    if (!subscription) {
      return;
    }

    const periodStartTimestamp = (stripeSubscription as Stripe.Subscription & { current_period_start?: number }).current_period_start;
    const periodEndTimestamp = (stripeSubscription as Stripe.Subscription & { current_period_end?: number }).current_period_end;
    
    let currentPeriodStart: Date | undefined;
    let currentPeriodEnd: Date | undefined;

    if (periodStartTimestamp && periodEndTimestamp) {
      currentPeriodStart = new Date(periodStartTimestamp * 1000);
      currentPeriodEnd = new Date(periodEndTimestamp * 1000);
      if (isNaN(currentPeriodStart.getTime()) || isNaN(currentPeriodEnd.getTime())) {
        currentPeriodStart = undefined;
        currentPeriodEnd = undefined;
      }
    }

    const newPriceId = stripeSubscription.items.data[0]?.price.id;
    let newPlanId = subscription.planId;

    if (newPriceId) {
      const newPlan = await this._subscriptionPlanRepository.findByStripePriceId(newPriceId);
      if (newPlan && newPlan.id !== subscription.planId) {
        newPlanId = newPlan.id;
        const companyProfile = await this._companyProfileRepository.findById(subscription.companyId);
        if (companyProfile) {
          await this._notificationRepository.create({
            userId: companyProfile.userId,
            title: 'Subscription Plan Changed',
            message: `Your subscription has been changed to ${newPlan.name}.`,
            type: NotificationType.SYSTEM,
            isRead: false,
          } as Omit<Notification, 'id' | '_id' | 'createdAt' | 'updatedAt'>);
        }
      }
    }

    await this._companySubscriptionRepository.update(subscription.id, {
      planId: newPlanId,
      stripeStatus: stripeSubscription.status as SubscriptionStatus,
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      currentPeriodStart,
      currentPeriodEnd,
      expiryDate: currentPeriodEnd || subscription.expiryDate,
      isActive: stripeSubscription.status === 'active' || stripeSubscription.status === 'trialing',
    });
  }

  private async handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription): Promise<void> {
    const subscription = await this._companySubscriptionRepository.findByStripeSubscriptionId(stripeSubscription.id);
    if (!subscription) {
      return;
    }

    await this._companySubscriptionRepository.update(subscription.id, {
      isActive: false,
      stripeStatus: 'canceled',
    });

    const companyProfile = await this._companyProfileRepository.findById(subscription.companyId);
    if (companyProfile) {
      await this._notificationRepository.create({
        userId: companyProfile.userId,
        title: 'Subscription Ended',
        message: 'Your subscription has ended. Upgrade to continue enjoying premium features.',
        type: NotificationType.SYSTEM,
        isRead: false,
      } as Omit<Notification, 'id' | '_id' | 'createdAt' | 'updatedAt'>);
    }
  }
}
