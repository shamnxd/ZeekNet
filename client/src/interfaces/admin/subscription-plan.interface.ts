export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  jobPostLimit: number;
  featuredJobLimit: number;
  applicantAccessLimit: number;
  yearlyDiscount: number;
  isActive: boolean;
  isPopular: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllSubscriptionPlansParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateSubscriptionPlanData {
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  jobPostLimit: number;
  featuredJobLimit: number;
  applicantAccessLimit: number;
  yearlyDiscount: number;
  isPopular?: boolean;
  isDefault?: boolean;
}

export interface UpdateSubscriptionPlanData {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  features?: string[];
  jobPostLimit?: number;
  featuredJobLimit?: number;
  applicantAccessLimit?: number;
  yearlyDiscount?: number;
  isActive?: boolean;
  isPopular?: boolean;
  isDefault?: boolean;
}
