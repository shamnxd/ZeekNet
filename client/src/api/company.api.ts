import { baseApi, uploadFile } from './base.api';
import type { ApiEnvelope } from '@/interfaces/auth';
import type { JobPostingResponse, JobPostingQuery } from '@/types/job';

export interface CompanyProfileData {
  company_name?: string
  website_link?: string
  website?: string
  industry?: string
  organisation?: string
  employee_count?: number
  employees?: string
  about_us?: string
  description?: string
  location?: string
  phone?: string
  foundedDate?: string
  logo?: string
  banner?: string
  business_license?: string
  tax_id?: string
  email?: string
}

export interface CompanyProfileResponse {
  id: string
  company_name: string
  logo: string
  banner: string
  website_link: string
  website?: string
  employee_count: number
  employees?: string
  industry: string
  organisation: string
  about_us: string
  description?: string
  location?: string
  phone?: string
  foundedDate?: string
  business_license?: string
  tax_id?: string
  email?: string
  is_verified: 'pending' | 'rejected' | 'verified'
  is_blocked: boolean
  rejection_reason?: string
  created_at: string
  updated_at: string
}

export interface JobPostingRequest {
  title: string
  description: string
  responsibilities: string[]
  qualifications: string[]
  nice_to_haves?: string[]
  benefits?: string[]
  salary: {
    min: number
    max: number
  }
  employment_types: ("full-time" | "part-time" | "contract" | "internship" | "remote")[]
  location: string
  skills_required?: string[]
  category_ids: string[]
}

interface CompanyDashboard {
  totalJobs: number;
  activeJobs: number;
  pendingJobs: number;
  totalApplications: number;
  recentApplications: unknown[];
  profileCompletion: number;
  profileStatus: string;
  verificationStatus?: string;
}

export const companyApi = {
  async createProfile(data: CompanyProfileData): Promise<ApiEnvelope<CompanyProfileResponse>> {
    return baseApi.post<CompanyProfileResponse>('/api/company/profile')(data);
  },

  async updateProfile(data: Partial<CompanyProfileData>): Promise<ApiEnvelope<CompanyProfileResponse>> {
    if (!data.logo && !data.business_license) {
      return baseApi.put<CompanyProfileResponse>('/api/company/profile')(data);
    }

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'logo' && key !== 'business_license') {
        formData.append(key, String(value));
      }
    });

    return baseApi.put<CompanyProfileResponse>('/api/company/profile')(formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async reapplyVerification(data: CompanyProfileData): Promise<ApiEnvelope<CompanyProfileResponse>> {
    return baseApi.post<CompanyProfileResponse>('/api/company/reapply-verification')(data);
  },

  async uploadLogo(file: File): Promise<ApiEnvelope<{ url: string; filename: string }>> {
    return uploadFile<{ url: string; filename: string }>('/api/company/upload/logo', file, 'logo');
  },

  async uploadBusinessLicense(file: File): Promise<ApiEnvelope<{ url: string; filename: string }>> {
    return uploadFile<{ url: string; filename: string }>('/api/company/upload/business-license', file, 'business_license');
  },

  async deleteImage(imageUrl: string): Promise<ApiEnvelope<{ message: string }>> {
    return baseApi.delete<{ message: string }>('/api/company/upload/delete')({ imageUrl });
  },

  async getProfile(): Promise<ApiEnvelope<CompanyProfileResponse>> {
    return baseApi.get<CompanyProfileResponse>('/api/company/profile')();
  },

  async getCompleteProfile(): Promise<ApiEnvelope<{
    profile: CompanyProfileResponse;
    contact: any | null;
    locations: any[];
    techStack: any[];
    benefits: any[];
    workplacePictures: any[];
    jobPostings: any[];
  }>> {
    return baseApi.get<{
      profile: CompanyProfileResponse;
      contact: any | null;
      locations: any[];
      techStack: any[];
      benefits: any[];
      workplacePictures: any[];
      jobPostings: any[];
    }>('/api/company/profile')();
  },

  async getProfileById(profileId: string): Promise<ApiEnvelope<CompanyProfileResponse>> {
    return baseApi.get<CompanyProfileResponse>(`/api/company/profile/${profileId}`)();
  },

  async getDashboard(): Promise<ApiEnvelope<CompanyDashboard>> {
    return baseApi.get<CompanyDashboard>('/api/company/dashboard')();
  },

  async createJobPosting(data: JobPostingRequest): Promise<ApiEnvelope<JobPostingResponse>> {
    return baseApi.post<JobPostingResponse>('/api/company/jobs')(data);
  },

  async getJobPostings(query?: JobPostingQuery): Promise<ApiEnvelope<{ jobs: JobPostingResponse[], pagination: { page: number, limit: number, total: number, totalPages: number } }>> {
    const params = new URLSearchParams();
    
    if (query) {
      if (query.page !== undefined) params.append('page', query.page.toString());
      if (query.limit !== undefined) params.append('limit', query.limit.toString());
      if (query.category_ids?.length) params.append('category_ids', query.category_ids.join(','));
      if (query.employment_types?.length) params.append('employment_types', query.employment_types.join(','));
      if (query.salary_min !== undefined) params.append('salary_min', query.salary_min.toString());
      if (query.salary_max !== undefined) params.append('salary_max', query.salary_max.toString());
      if (query.location) params.append('location', query.location);
      if (query.search) params.append('search', query.search);
    }
    
    const endpoint = params.toString() ? `/api/company/jobs?${params.toString()}` : '/api/company/jobs';
    return baseApi.get<{ jobs: JobPostingResponse[], pagination: { page: number, limit: number, total: number, totalPages: number } }>(endpoint)();
  },

  async getJobPosting(id: string): Promise<ApiEnvelope<JobPostingResponse>> {
    return baseApi.get<JobPostingResponse>(`/api/company/jobs/${id}`)();
  },

  async updateJobPosting(id: string, data: Partial<JobPostingRequest>): Promise<ApiEnvelope<JobPostingResponse>> {
    return baseApi.put<JobPostingResponse>(`/api/company/jobs/${id}`)(data);
  },

  async deleteJobPosting(id: string): Promise<ApiEnvelope<{ message: string }>> {
    return baseApi.delete<{ message: string }>(`/api/company/jobs/${id}`)();
  },

  async updateJobStatus(id: string, status: 'active' | 'unlisted' | 'expired' | 'blocked'): Promise<ApiEnvelope<JobPostingResponse>> {
    return baseApi.patch<JobPostingResponse>(`/api/company/jobs/${id}/status`)({ status });
  },

  async getContact(): Promise<ApiEnvelope<any>> {
    return baseApi.get<any>('/api/company/contact')();
  },

  async updateContact(data: any): Promise<ApiEnvelope<any>> {
    return baseApi.put<any>('/api/company/contact')(data);
  },

  async getTechStacks(): Promise<ApiEnvelope<any[]>> {
    return baseApi.get<any[]>('/api/company/tech-stacks')();
  },

  async createTechStack(data: any): Promise<ApiEnvelope<any>> {
    return baseApi.post<any>('/api/company/tech-stacks')(data);
  },

  async updateTechStack(id: string, data: any): Promise<ApiEnvelope<any>> {
    return baseApi.put<any>(`/api/company/tech-stacks/${id}`)(data);
  },

  async deleteTechStack(id: string): Promise<ApiEnvelope<any>> {
    return baseApi.delete<any>(`/api/company/tech-stacks/${id}`)();
  },

  async getOfficeLocations(): Promise<ApiEnvelope<any[]>> {
    return baseApi.get<any[]>('/api/company/office-locations')();
  },

  async createOfficeLocation(data: any): Promise<ApiEnvelope<any>> {
    return baseApi.post<any>('/api/company/office-locations')(data);
  },

  async updateOfficeLocation(id: string, data: any): Promise<ApiEnvelope<any>> {
    return baseApi.put<any>(`/api/company/office-locations/${id}`)(data);
  },

  async deleteOfficeLocation(id: string): Promise<ApiEnvelope<any>> {
    return baseApi.delete<any>(`/api/company/office-locations/${id}`)();
  },

  async getBenefits(): Promise<ApiEnvelope<any[]>> {
    return baseApi.get<any[]>('/api/company/benefits')();
  },

  async createBenefit(data: any): Promise<ApiEnvelope<any>> {
    return baseApi.post<any>('/api/company/benefits')(data);
  },

  async updateBenefit(id: string, data: any): Promise<ApiEnvelope<any>> {
    return baseApi.put<any>(`/api/company/benefits/${id}`)(data);
  },

  async deleteBenefit(id: string): Promise<ApiEnvelope<any>> {
    return baseApi.delete<any>(`/api/company/benefits/${id}`)();
  },

  async getWorkplacePictures(): Promise<ApiEnvelope<any[]>> {
    return baseApi.get<any[]>('/api/company/workplace-pictures')();
  },

  async createWorkplacePicture(data: any): Promise<ApiEnvelope<any>> {
    return baseApi.post<any>('/api/company/workplace-pictures')(data);
  },

  async updateWorkplacePicture(id: string, data: any): Promise<ApiEnvelope<any>> {
    return baseApi.put<any>(`/api/company/workplace-pictures/${id}`)(data);
  },

  async deleteWorkplacePicture(id: string): Promise<ApiEnvelope<any>> {
    return baseApi.delete<any>(`/api/company/workplace-pictures/${id}`)();
  },

  async uploadWorkplacePicture(file: File): Promise<ApiEnvelope<{ url: string; filename: string }>> {
    return uploadFile<{ url: string; filename: string }>('/api/company/workplace-pictures/upload', file, 'image');
  },

  async getApplications(query?: { page?: number; limit?: number; search?: string; job_id?: string; stage?: string }): Promise<ApiEnvelope<{ applications: any[], total: number, page: number, limit: number }>> {
    const params = new URLSearchParams();
    
    if (query) {
      if (query.page !== undefined) params.append('page', query.page.toString());
      if (query.limit !== undefined) params.append('limit', query.limit.toString());
      if (query.search) params.append('search', query.search);
      if (query.job_id) params.append('job_id', query.job_id);
      if (query.stage) params.append('stage', query.stage);
    }
    
    const endpoint = params.toString() ? `/api/company/applications?${params.toString()}` : '/api/company/applications';
    return baseApi.get<{ applications: any[], total: number, page: number, limit: number }>(endpoint)();
  },

  async getApplicationDetails(id: string): Promise<ApiEnvelope<any>> {
    return baseApi.get<any>(`/api/company/applications/${id}`)();
  },

  async getSubscriptionPlans(): Promise<ApiEnvelope<{ plans: SubscriptionPlan[] }>> {
    return baseApi.get<{ plans: SubscriptionPlan[] }>('/api/company/subscription-plans')();
  },

  async purchaseSubscription(planId: string, billingCycle?: 'monthly' | 'annual'): Promise<ApiEnvelope<PurchaseSubscriptionResponse>> {
    return baseApi.post<PurchaseSubscriptionResponse>('/api/company/subscriptions/purchase')({ planId, billingCycle });
  },

  async getActiveSubscription(): Promise<ApiEnvelope<ActiveSubscriptionResponse>> {
    return baseApi.get<ActiveSubscriptionResponse>('/api/company/subscriptions/active')();
  },

  async getPaymentHistory(): Promise<ApiEnvelope<PaymentHistoryItem[]>> {
    return baseApi.get<PaymentHistoryItem[]>('/api/company/subscriptions/payment-history')();
  },

  // Stripe Subscription Methods
  async createCheckoutSession(planId: string, billingCycle: 'monthly' | 'yearly', successUrl: string, cancelUrl: string): Promise<ApiEnvelope<CheckoutSessionResponse>> {
    return baseApi.post<CheckoutSessionResponse>('/api/company/subscriptions/create-checkout-session')({
      planId,
      billingCycle,
      successUrl,
      cancelUrl,
    });
  },

  async cancelSubscription(): Promise<ApiEnvelope<ActiveSubscriptionResponse>> {
    return baseApi.post<ActiveSubscriptionResponse>('/api/company/subscriptions/cancel')({});
  },

  async resumeSubscription(): Promise<ApiEnvelope<ActiveSubscriptionResponse>> {
    return baseApi.post<ActiveSubscriptionResponse>('/api/company/subscriptions/resume')({});
  },

  async changeSubscriptionPlan(planId: string, billingCycle?: 'monthly' | 'yearly'): Promise<ApiEnvelope<{ subscription: ActiveSubscriptionResponse }>> {
    return baseApi.post<{ subscription: ActiveSubscriptionResponse }>('/api/company/subscriptions/change-plan')({
      planId,
      billingCycle,
    });
  },

  async getBillingPortalUrl(returnUrl: string): Promise<ApiEnvelope<BillingPortalResponse>> {
    return baseApi.post<BillingPortalResponse>('/api/company/subscriptions/billing-portal')({ returnUrl });
  }
}

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
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseSubscriptionResponse {
  subscription: {
    id: string;
    companyId: string;
    planId: string;
    startDate: string;
    expiryDate: string;
    isActive: boolean;
    jobPostsUsed: number;
    featuredJobsUsed: number;
    applicantAccessUsed: number;
    planName?: string;
    jobPostLimit?: number;
    featuredJobLimit?: number;
  };
  paymentOrder: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    invoiceId?: string;
    transactionId?: string;
    paymentMethod: string;
    createdAt: string;
  };
}

export interface ActiveSubscriptionResponse {
  id: string;
  companyId: string;
  planId: string;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
  jobPostsUsed: number;
  featuredJobsUsed: number;
  applicantAccessUsed: number;
  planName?: string;
  jobPostLimit?: number;
  featuredJobLimit?: number;
  plan?: {
    id: string;
    name: string;
    jobPostLimit: number;
    featuredJobLimit: number;
  };
  // Stripe-specific fields
  stripeStatus?: string;
  billingCycle?: 'monthly' | 'yearly';
  cancelAtPeriodEnd?: boolean;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
}

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  invoiceId?: string;
  transactionId?: string;
  stripeInvoiceUrl?: string;
  stripeInvoicePdf?: string;
  billingCycle?: 'monthly' | 'yearly';
  createdAt: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  sessionUrl: string;
}

export interface BillingPortalResponse {
  url: string;
}
