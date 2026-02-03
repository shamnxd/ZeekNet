export interface SubscriptionPlanResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  yearlyDiscount: number;
  features: string[];
  jobPostLimit: number;
  featuredJobLimit: number;
  applicantAccessLimit: number;
  isActive: boolean;
  isPopular: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  stripeProductId?: string;
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
}
