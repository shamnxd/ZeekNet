import { ICompanySubscriptionRepository } from '../../../domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { ISubscriptionPlanRepository } from '../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IPaymentOrderRepository } from '../../../domain/interfaces/repositories/payment/IPaymentOrderRepository';
import { CompanySubscription } from '../../../domain/entities/company-subscription.entity';
import { PaymentOrder } from '../../../domain/entities/payment-order.entity';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { InvoiceGenerator } from '../../../shared/utils/invoice-generator';

export class PurchaseSubscriptionUseCase {
  constructor(
    private _companySubscriptionRepository: ICompanySubscriptionRepository,
    private _subscriptionPlanRepository: ISubscriptionPlanRepository,
    private _companyProfileRepository: ICompanyProfileRepository,
    private _paymentOrderRepository: IPaymentOrderRepository,
  ) {}

  async execute(userId: string, planId: string, billingCycle: 'monthly' | 'annual' = 'monthly'): Promise<{ subscription: CompanySubscription; paymentOrder: PaymentOrder }> {
    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    const companyId = companyProfile.id;

    const plan = await this._subscriptionPlanRepository.findById(planId);
    if (!plan) {
      throw new NotFoundError('Subscription plan not found');
    }

    if (!plan.isActive) {
      throw new ValidationError('This subscription plan is not available');
    }

    const existingSubscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyId);
    if (existingSubscription) {
      throw new ValidationError('You already have an active subscription. Please wait for it to expire or cancel it first.');
    }

    const isAnnual = billingCycle === 'annual';
    const amount = isAnnual ? plan.getYearlyPrice() : plan.price;
    const duration = isAnnual ? 365 : plan.duration;

    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + duration);

    const invoiceId = InvoiceGenerator.generateUnique();
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const paymentOrder = await this._paymentOrderRepository.create(
      PaymentOrder.create({
        id: '', 
        companyId,
        planId,
        amount,
        currency: 'USD',
        status: 'completed', 
        paymentMethod: 'dummy',
        invoiceId,
        transactionId,
        metadata: {
          planName: plan.name,
          duration,
          billingCycle,
          monthlyPrice: plan.price,
          yearlyDiscount: isAnnual ? plan.yearlyDiscount : 0,
          userId,
        },
      }),
    );

    const subscription = await this._companySubscriptionRepository.create({
      companyId,
      planId,
      startDate,
      expiryDate,
      isActive: true,
      jobPostsUsed: 0,
      featuredJobsUsed: 0,
      applicantAccessUsed: 0,
    });

    return { subscription, paymentOrder };
  }
}
