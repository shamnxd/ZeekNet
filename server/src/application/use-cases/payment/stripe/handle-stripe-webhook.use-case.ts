import { IStripeService } from 'src/domain/interfaces/services/IStripeService';
import { ISubscriptionPlanRepository } from 'src/domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { ICompanySubscriptionRepository } from 'src/domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { IPaymentOrderRepository } from 'src/domain/interfaces/repositories/payment/IPaymentOrderRepository';
import { INotificationRepository } from 'src/domain/interfaces/repositories/notification/INotificationRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { SubscriptionStatus } from 'src/domain/enums/subscription-status.enum';
import { NotificationType } from 'src/domain/enums/notification-type.enum';
import { ILogger } from 'src/domain/interfaces/services/ILogger';
import { IRevertToDefaultPlanUseCase } from 'src/domain/interfaces/use-cases/subscription/IRevertToDefaultPlanUseCase';
import { HandleStripeWebhookRequestDto } from 'src/application/dtos/payment/stripe/requests/handle-stripe-webhook.dto';
import { IHandleStripeWebhookUseCase } from 'src/domain/interfaces/use-cases/payment/stripe/IHandleStripeWebhookUseCase';
import { PaymentStatus } from 'src/domain/enums/payment-status.enum';
import { PaymentMethod } from 'src/domain/enums/payment-method.enum';
import { BillingCycle } from 'src/domain/enums/billing-cycle.enum';
import { JobStatus } from 'src/domain/enums/job-status.enum';
import { CompanySubscriptionResponseMapper } from 'src/application/mappers/company/subscription/company-subscription-response.mapper';
import { PaymentMapper } from 'src/application/mappers/payment/payment.mapper';
import { NotificationMapper } from 'src/application/mappers/notification/notification.mapper';
import { StripeEventMapper } from 'src/application/mappers/payment/stripe/stripe-event.mapper';
import {
  PaymentEvent,
  PaymentSession,
  PaymentInvoice,
  PaymentSubscription,
} from 'src/domain/types/payment/payment-types';

export class HandleStripeWebhookUseCase implements IHandleStripeWebhookUseCase {
  constructor(
    private readonly _stripeService: IStripeService,
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
    private readonly _paymentOrderRepository: IPaymentOrderRepository,
    private readonly _notificationRepository: INotificationRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _logger: ILogger,
    private readonly _revertToDefaultPlanUseCase: IRevertToDefaultPlanUseCase,
  ) {}

  async execute(data: HandleStripeWebhookRequestDto): Promise<{ received: boolean }> {
    const { payload, signature } = data;
    try {
      const event: PaymentEvent = this._stripeService.constructWebhookEvent(payload, signature);

      switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object as PaymentSession);
        break;
      case 'invoice.paid':
      case 'invoice.payment_succeeded':
        await this.handleInvoicePaid(event.data.object as PaymentInvoice);
        break;
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as PaymentInvoice);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as PaymentSubscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as PaymentSubscription);
        break;
      }

      return { received: true };
    } catch (error) {
      this._logger.error(`Error processing Stripe webhook: ${(error as Error).message}`, { error });
      return { received: true };
    }
  }

  private async handleCheckoutSessionCompleted(session: PaymentSession): Promise<void> {
    try {
      const { companyId, planId, billingCycle } = session.metadata || {};
      
      if (!companyId || !planId || !session.subscription) {
        this._logger.error('Missing required metadata in checkout session', { sessionId: session.id });
        return;
      }

      const stripeSubscriptionId = typeof session.subscription === 'string' 
        ? session.subscription 
        : session.subscription.id;

      const existingSubscriptionByStripeId = await this._companySubscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId);
      if (existingSubscriptionByStripeId) {
        this._logger.info(`Subscription ${stripeSubscriptionId} already exists, skipping creation`);
        return;
      }

      const existingActiveSubscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyId);
      if (existingActiveSubscription && existingActiveSubscription.stripeSubscriptionId !== stripeSubscriptionId) {
        if (existingActiveSubscription.stripeSubscriptionId) {
          try {
            await this._stripeService.cancelSubscription(existingActiveSubscription.stripeSubscriptionId, false);
            this._logger.info(`Canceled old Stripe subscription ${existingActiveSubscription.stripeSubscriptionId} for company ${companyId}`);
          } catch (error) {
            this._logger.error(`Failed to cancel old Stripe subscription ${existingActiveSubscription.stripeSubscriptionId}`, error);
          }
        }
        
        await this._companySubscriptionRepository.update(existingActiveSubscription.id, {
          isActive: false,
          stripeStatus: SubscriptionStatus.CANCELED,
        });
        this._logger.info(`Deactivated old subscription ${existingActiveSubscription.id} for company ${companyId}`);
      }

      const stripeSubscription = await this._stripeService.getSubscription(stripeSubscriptionId);
      if (!stripeSubscription) {
        this._logger.error('Failed to get Stripe subscription', { stripeSubscriptionId });
        return;
      }

      const plan = await this._subscriptionPlanRepository.findById(planId);
      if (!plan) {
        this._logger.error('Plan not found', { planId });
        return;
      }

      const { currentPeriodStart, currentPeriodEnd } = StripeEventMapper.parseSubscriptionDates(stripeSubscription, billingCycle);

      if (isNaN(currentPeriodStart.getTime()) || isNaN(currentPeriodEnd.getTime())) {
        throw new Error('Invalid date conversion from Stripe subscription');
      }

      let unlistedCount = 0;
      let remainingRegularJobs = 0;
      let remainingFeaturedJobs = 0;

      if (existingActiveSubscription && existingActiveSubscription.stripeSubscriptionId !== stripeSubscriptionId) {
        const oldPlan = await this._subscriptionPlanRepository.findById(existingActiveSubscription.planId);
        const isDowngrade = oldPlan && plan.jobPostLimit < oldPlan.jobPostLimit;

        if (isDowngrade) {
          const allJobs = await this._jobPostingRepository.getJobsByCompany(companyId, {
            status: 1,
            isFeatured: 1,
            createdAt: 1,
          });

          const activeJobs = allJobs.filter(job => job.status === JobStatus.ACTIVE);
          
          activeJobs.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });

          const newJobLimit = plan.jobPostLimit === -1 ? activeJobs.length : plan.jobPostLimit;
          const jobsToKeep = activeJobs.slice(0, newJobLimit);
          const jobsToUnlist = activeJobs.slice(newJobLimit);

          for (const job of jobsToUnlist) {
            try {
              await this._jobPostingRepository.update(job.id!, { status: JobStatus.UNLISTED });
              unlistedCount++;
              this._logger.info(`Unlisted job ${job.id} for company ${companyId} due to plan downgrade`);
            } catch (error) {
              this._logger.error(`Failed to unlist job ${job.id} for company ${companyId}`, error);
            }
          }

          remainingFeaturedJobs = jobsToKeep.filter(job => job.isFeatured).length;
          remainingRegularJobs = jobsToKeep.length - remainingFeaturedJobs;
        } else {
          remainingRegularJobs = existingActiveSubscription.jobPostsUsed;
          remainingFeaturedJobs = existingActiveSubscription.featuredJobsUsed;
        }
      }

      const subscriptionData = CompanySubscriptionResponseMapper.toEntity({
        companyId,
        planId,
        startDate: currentPeriodStart,
        expiryDate: currentPeriodEnd,
        isActive: true,
        jobPostsUsed: remainingRegularJobs,
        featuredJobsUsed: remainingFeaturedJobs,
        applicantAccessUsed: existingActiveSubscription?.applicantAccessUsed || 0,
        stripeCustomerId: session.customerId as string,
        stripeSubscriptionId,
        stripeStatus: stripeSubscription.status as SubscriptionStatus,
        billingCycle: billingCycle as BillingCycle,
        cancelAtPeriodEnd: stripeSubscription.cancelAtPeriodEnd || false,
        currentPeriodStart,
        currentPeriodEnd,
      });

      const subscription = await this._companySubscriptionRepository.create(subscriptionData);

      if (stripeSubscription.latestInvoice) {
        const invoiceId = typeof stripeSubscription.latestInvoice === 'string'
          ? stripeSubscription.latestInvoice
          : stripeSubscription.latestInvoice.id;
        const invoice = await this._stripeService.getInvoice(invoiceId);

        if (invoice && invoice.status === 'paid' && invoice.amountPaid) {
          const existingPaymentOrder = await this._paymentOrderRepository.findByStripeInvoiceId(invoice.id);
          if (!existingPaymentOrder) {
            const paymentOrder = PaymentMapper.toEntity({
              companyId,
              planId,
              amount: invoice.amountPaid / 100,
              currency: invoice.currency.toUpperCase(),
              status: PaymentStatus.COMPLETED,
              paymentMethod: PaymentMethod.STRIPE,
              invoiceId: invoice.number || undefined,
              transactionId: StripeEventMapper.getPaymentIntentId(invoice),
              stripeInvoiceId: invoice.id,
              stripeInvoiceUrl: invoice.hostedInvoiceUrl || undefined,
              stripeInvoicePdf: invoice.invoicePdf || undefined,
              stripePaymentIntentId: StripeEventMapper.getPaymentIntentId(invoice),
              subscriptionId: subscription.id,
              billingCycle: billingCycle as BillingCycle,
              metadata: {
                planName: plan.name,
                billingCycle: billingCycle,
              },
            });
            await this._paymentOrderRepository.create(paymentOrder);
          }
        }
      }

      const companyProfile = await this._companyProfileRepository.findById(companyId);
      if (companyProfile) {
        const notificationMessage = existingActiveSubscription
          ? (unlistedCount > 0
            ? `Your subscription has been changed to ${plan.name}. ${unlistedCount} job(s) have been unlisted to comply with the new plan limit.`
            : `Your subscription has been changed to ${plan.name} successfully.`)
          : `Your ${plan.name} subscription has been activated successfully.`;
        
        const notification = NotificationMapper.toEntity({
          userId: companyProfile.userId,
          title: existingActiveSubscription ? 'Subscription Plan Changed' : 'Subscription Activated',
          message: notificationMessage,
          type: NotificationType.SYSTEM,
          isRead: false,
        });
        await this._notificationRepository.create(notification);
      }
    } catch (error) {
      this._logger.error('Error handling checkout.session.completed webhook', { error, sessionId: session.id });
      throw error;
    }
  }

  private async handleInvoicePaid(invoice: PaymentInvoice): Promise<void> {
    const stripeSubscriptionId = StripeEventMapper.getSubscriptionId(invoice);
    if (!stripeSubscriptionId) return;

    const existingPaymentOrder = await this._paymentOrderRepository.findByStripeInvoiceId(invoice.id);
    if (existingPaymentOrder) {
      const subscription = await this._companySubscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId);
      if (subscription) {
        const stripeSubscription = await this._stripeService.getSubscription(stripeSubscriptionId);
        if (stripeSubscription) {
          const { currentPeriodEnd } = StripeEventMapper.parseSubscriptionDates(stripeSubscription);
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
          const paymentOrder = PaymentMapper.toEntity({
            companyId: stripeSubscription.metadata.companyId,
            planId: stripeSubscription.metadata.planId,
            amount: (invoice.amountPaid || 0) / 100,
            currency: invoice.currency.toUpperCase(),
            status: PaymentStatus.COMPLETED,
            paymentMethod: PaymentMethod.STRIPE,
            invoiceId: invoice.number || undefined,
            transactionId: StripeEventMapper.getPaymentIntentId(invoice),
            stripeInvoiceId: invoice.id,
            stripeInvoiceUrl: invoice.hostedInvoiceUrl || undefined,
            stripeInvoicePdf: invoice.invoicePdf || undefined,
            stripePaymentIntentId: StripeEventMapper.getPaymentIntentId(invoice),
            billingCycle: stripeSubscription.metadata.billingCycle as BillingCycle | undefined,
            metadata: {
              planName: plan.name,
              billingCycle: stripeSubscription.metadata.billingCycle,
            },
          });
          await this._paymentOrderRepository.create(paymentOrder);
        }
      }
      return;
    }

    const stripeSubscription = await this._stripeService.getSubscription(stripeSubscriptionId);
    if (stripeSubscription) {
      const { currentPeriodEnd } = StripeEventMapper.parseSubscriptionDates(stripeSubscription);
      if (!isNaN(currentPeriodEnd.getTime())) {
        await this._companySubscriptionRepository.update(subscription.id, {
          expiryDate: currentPeriodEnd,
          currentPeriodEnd,
          stripeStatus: stripeSubscription.status as SubscriptionStatus,
          isActive: true,
        });
      }
    }

    const plan = await this._subscriptionPlanRepository.findById(subscription.planId);
    const paymentOrder = PaymentMapper.toEntity({
      companyId: subscription.companyId,
      planId: subscription.planId,
      amount: (invoice.amountPaid || 0) / 100,
      currency: invoice.currency.toUpperCase(),
      status: PaymentStatus.COMPLETED,
      paymentMethod: PaymentMethod.STRIPE,
      invoiceId: invoice.number || undefined,
      transactionId: StripeEventMapper.getPaymentIntentId(invoice),
      stripeInvoiceId: invoice.id,
      stripeInvoiceUrl: invoice.hostedInvoiceUrl || undefined,
      stripeInvoicePdf: invoice.invoicePdf || undefined,
      stripePaymentIntentId: StripeEventMapper.getPaymentIntentId(invoice),
      subscriptionId: subscription.id,
      billingCycle: subscription.billingCycle,
      metadata: {
        planName: plan?.name || 'Unknown Plan',
        billingCycle: subscription.billingCycle,
      },
    });
    await this._paymentOrderRepository.create(paymentOrder);
  }

  private async handleInvoicePaymentFailed(invoice: PaymentInvoice): Promise<void> {
    const stripeSubscriptionId = StripeEventMapper.getSubscriptionId(invoice);
    if (!stripeSubscriptionId) return;

    const subscription = await this._companySubscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId);
    if (!subscription) return;

    await this._companySubscriptionRepository.update(subscription.id, {
      stripeStatus: SubscriptionStatus.PAST_DUE,
      isActive: false,
    });

    try {
      await this._revertToDefaultPlanUseCase.execute(subscription.companyId);
      this._logger.info(`Reverted company ${subscription.companyId} to default plan due to payment failure`);
    } catch (error) {
      this._logger.error(`Failed to revert company ${subscription.companyId} to default plan after payment failure`, error);
    }

    const companyProfile = await this._companyProfileRepository.findById(subscription.companyId);
    if (companyProfile) {
      const notification = NotificationMapper.toEntity({
        userId: companyProfile.userId,
        title: 'Payment Failed',
        message: 'Your subscription payment has failed. Your plan has been reverted to the default plan.',
        type: NotificationType.SYSTEM,
        isRead: false,
      });
      await this._notificationRepository.create(notification);
    }

    const paymentOrder = PaymentMapper.toEntity({
      companyId: subscription.companyId,
      planId: subscription.planId,
      amount: (invoice.amountDue || 0) / 100,
      currency: invoice.currency.toUpperCase(),
      status: PaymentStatus.FAILED,
      paymentMethod: PaymentMethod.STRIPE,
      invoiceId: invoice.number || undefined,
      stripeInvoiceId: invoice.id,
      subscriptionId: subscription.id,
      billingCycle: subscription.billingCycle,
      metadata: {
        failureReason: 'Payment declined',
      },
    });
    await this._paymentOrderRepository.create(paymentOrder);
  }

  private async handleSubscriptionUpdated(stripeSubscription: PaymentSubscription): Promise<void> {
    const subscription = await this._companySubscriptionRepository.findByStripeSubscriptionId(stripeSubscription.id);
    if (!subscription) return;

    const { currentPeriodStart, currentPeriodEnd } = StripeEventMapper.parseSubscriptionDates(stripeSubscription);

    const isCanceled = stripeSubscription.status === SubscriptionStatus.CANCELED;
    const periodHasEnded = currentPeriodEnd && new Date() >= currentPeriodEnd;

    if (isCanceled && periodHasEnded) {
      try {
        await this._revertToDefaultPlanUseCase.execute(subscription.companyId);
        this._logger.info(`Reverted company ${subscription.companyId} to default plan after canceled subscription period ended`);
      } catch (error) {
        this._logger.error(`Failed to revert company ${subscription.companyId} to default plan after subscription period ended`, error);
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
          const notification = NotificationMapper.toEntity({
            userId: companyProfile.userId,
            title: 'Subscription Plan Changed',
            message: `Your subscription has been changed to ${newPlan.name}.`,
            type: NotificationType.SYSTEM,
            isRead: false,
          });
          await this._notificationRepository.create(notification);
        }
      }
    }

    await this._companySubscriptionRepository.update(subscription.id, {
      planId: newPlanId,
      stripeStatus: stripeSubscription.status as SubscriptionStatus,
      cancelAtPeriodEnd: stripeSubscription.cancelAtPeriodEnd,
      currentPeriodStart,
      currentPeriodEnd,
      expiryDate: currentPeriodEnd || subscription.expiryDate,
      isActive: stripeSubscription.status === 'active' || stripeSubscription.status === 'trialing',
    });
  }

  private async handleSubscriptionDeleted(stripeSubscription: PaymentSubscription): Promise<void> {
    const subscription = await this._companySubscriptionRepository.findByStripeSubscriptionId(stripeSubscription.id);
    if (!subscription) return;

    await this._companySubscriptionRepository.update(subscription.id, {
      isActive: false,
      stripeStatus: SubscriptionStatus.CANCELED,
    });

    try {
      await this._revertToDefaultPlanUseCase.execute(subscription.companyId);
      this._logger.info(`Reverted company ${subscription.companyId} to default plan after subscription deletion`);
    } catch (error) {
      this._logger.error(`Failed to revert company ${subscription.companyId} to default plan after subscription deletion`, error);
    }

    const companyProfile = await this._companyProfileRepository.findById(subscription.companyId);
    if (companyProfile) {
      const notification = NotificationMapper.toEntity({
        userId: companyProfile.userId,
        title: 'Subscription Ended',
        message: 'Your subscription has ended. Your plan has been reverted to the default plan.',
        type: NotificationType.SYSTEM,
        isRead: false,
      });
      await this._notificationRepository.create(notification);
    }
  }
}



