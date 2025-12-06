export class SubscriptionPlan {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly duration: number, 
    public readonly yearlyDiscount: number, 
    public readonly features: string[],
    public readonly jobPostLimit: number,
    public readonly featuredJobLimit: number,
    public readonly applicantAccessLimit: number,
    public readonly isActive: boolean,
    public readonly isPopular: boolean,
    public readonly isDefault: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly stripeProductId?: string,
    public readonly stripePriceIdMonthly?: string,
    public readonly stripePriceIdYearly?: string,
  ) {}

  getYearlyPrice(): number {
    const yearlyBasePrice = this.price * 12;
    const discountAmount = yearlyBasePrice * (this.yearlyDiscount / 100);
    return yearlyBasePrice - discountAmount;
  }

  static create(data: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    yearlyDiscount?: number;
    features: string[];
    jobPostLimit: number;
    featuredJobLimit: number;
    applicantAccessLimit: number;
    isActive?: boolean;
    isPopular?: boolean;
    isDefault?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    stripeProductId?: string;
    stripePriceIdMonthly?: string;
    stripePriceIdYearly?: string;
  }): SubscriptionPlan {
    const now = new Date();
    return new SubscriptionPlan(
      data.id,
      data.name,
      data.description,
      data.price,
      data.duration,
      data.yearlyDiscount ?? 0,
      data.features,
      data.jobPostLimit,
      data.featuredJobLimit,
      data.applicantAccessLimit,
      data.isActive ?? true,
      data.isPopular ?? false,
      data.isDefault ?? false,
      data.createdAt ?? now,
      data.updatedAt ?? now,
      data.stripeProductId,
      data.stripePriceIdMonthly,
      data.stripePriceIdYearly,
    );
  }

  hasStripeIntegration(): boolean {
    return !!(this.stripeProductId && (this.stripePriceIdMonthly || this.stripePriceIdYearly));
  }
}
