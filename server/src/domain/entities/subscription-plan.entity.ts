export class SubscriptionPlan {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly duration: number, // in days
    public readonly features: string[],
    public readonly jobPostLimit: number,
    public readonly featuredJobLimit: number,
    public readonly applicantAccessLimit: number,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    features: string[];
    jobPostLimit: number;
    featuredJobLimit: number;
    applicantAccessLimit: number;
    isActive?: boolean;
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
      data.features,
      data.jobPostLimit,
      data.featuredJobLimit,
      data.applicantAccessLimit,
      data.isActive ?? true,
      data.createdAt ?? now,
      data.updatedAt ?? now,
    );
  }
}
