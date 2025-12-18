export interface SubscriptionPlan {
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
  createdAt: string;
  updatedAt: string;
}
