export class SubscriptionPlan {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly duration: number, // in days
    public readonly yearlyDiscount: number, // percentage discount for yearly billing
    public readonly features: string[],
    public readonly jobPostLimit: number,
    public readonly featuredJobLimit: number,
    public readonly applicantAccessLimit: number,
    public readonly isActive: boolean,
    public readonly isPopular: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Calculate yearly price with discount
   * Formula: (monthlyPrice * 12) * (1 - discount/100)
   */
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
    createdAt?: Date;
    updatedAt?: Date;
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
      data.createdAt ?? now,
      data.updatedAt ?? now,
    );
  }
}
