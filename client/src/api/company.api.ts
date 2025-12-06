import { api } from './index';
import { uploadFile } from '@/shared/utils/file-upload.util';
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
    return (await api.post<ApiEnvelope<CompanyProfileResponse>>('/api/company/profile', data)).data;
  },

  async updateProfile(data: Partial<CompanyProfileData>): Promise<ApiEnvelope<CompanyProfileResponse>> {
    if (!data.logo && !data.business_license) {
      return (await api.put<ApiEnvelope<CompanyProfileResponse>>('/api/company/profile', data)).data;
    }

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'logo' && key !== 'business_license') {
        formData.append(key, String(value));
      }
    });

    return (await api.put<ApiEnvelope<CompanyProfileResponse>>('/api/company/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
  },

  async reapplyVerification(data: CompanyProfileData): Promise<ApiEnvelope<CompanyProfileResponse>> {
    return (await api.post<ApiEnvelope<CompanyProfileResponse>>('/api/company/reapply-verification', data)).data;
  },

  async uploadLogo(file: File): Promise<ApiEnvelope<{ url: string; filename: string }>> {
    return uploadFile<{ url: string; filename: string }>('/api/company/upload/logo', file, 'logo');
  },

  async uploadBusinessLicense(file: File): Promise<ApiEnvelope<{ url: string; filename: string }>> {
    return uploadFile<{ url: string; filename: string }>('/api/company/upload/business-license', file, 'business_license');
  },

  async deleteImage(imageUrl: string): Promise<ApiEnvelope<{ message: string }>> {
    return (await api.delete<ApiEnvelope<{ message: string }>>('/api/company/upload/delete', { data: { imageUrl } })).data;
  },

  async getProfile(): Promise<ApiEnvelope<CompanyProfileResponse>> {
    return (await api.get<ApiEnvelope<CompanyProfileResponse>>('/api/company/profile')).data;
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
    return (await api.get<ApiEnvelope<{
      profile: CompanyProfileResponse;
      contact: any | null;
      locations: any[];
      techStack: any[];
      benefits: any[];
      workplacePictures: any[];
      jobPostings: any[];
    }>>('/api/company/profile')).data;
  },

  async getProfileById(profileId: string): Promise<ApiEnvelope<CompanyProfileResponse>> {
    return (await api.get<ApiEnvelope<CompanyProfileResponse>>(`/api/company/profile/${profileId}`)).data;
  },

  async getDashboard(): Promise<ApiEnvelope<CompanyDashboard>> {
    return (await api.get<ApiEnvelope<CompanyDashboard>>('/api/company/dashboard')).data;
  },

  async createJobPosting(data: JobPostingRequest): Promise<ApiEnvelope<JobPostingResponse>> {
    return (await api.post<ApiEnvelope<JobPostingResponse>>('/api/company/jobs', data)).data;
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
    return (await api.get<ApiEnvelope<{ jobs: JobPostingResponse[], pagination: { page: number, limit: number, total: number, totalPages: number } }>>(endpoint)).data;
  },

  async getJobPosting(id: string): Promise<ApiEnvelope<JobPostingResponse>> {
    return (await api.get<ApiEnvelope<JobPostingResponse>>(`/api/company/jobs/${id}`)).data;
  },

  async updateJobPosting(id: string, data: Partial<JobPostingRequest>): Promise<ApiEnvelope<JobPostingResponse>> {
    return (await api.put<ApiEnvelope<JobPostingResponse>>(`/api/company/jobs/${id}`, data)).data;
  },

  async deleteJobPosting(id: string): Promise<ApiEnvelope<{ message: string }>> {
    return (await api.delete<ApiEnvelope<{ message: string }>>(`/api/company/jobs/${id}`)).data;
  },

  async updateJobStatus(id: string, status: 'active' | 'unlisted' | 'expired' | 'blocked'): Promise<ApiEnvelope<JobPostingResponse>> {
    return (await api.patch<ApiEnvelope<JobPostingResponse>>(`/api/company/jobs/${id}/status`, { status })).data;
  },

  async getContact(): Promise<ApiEnvelope<any>> {
    return (await api.get<ApiEnvelope<any>>('/api/company/contact')).data;
  },

  async updateContact(data: any): Promise<ApiEnvelope<any>> {
    return (await api.put<ApiEnvelope<any>>('/api/company/contact', data)).data;
  },

  async getTechStacks(): Promise<ApiEnvelope<any[]>> {
    return (await api.get<ApiEnvelope<any[]>>('/api/company/tech-stacks')).data;
  },

  async createTechStack(data: any): Promise<ApiEnvelope<any>> {
    return (await api.post<ApiEnvelope<any>>('/api/company/tech-stacks', data)).data;
  },

  async updateTechStack(id: string, data: any): Promise<ApiEnvelope<any>> {
    return (await api.put<ApiEnvelope<any>>(`/api/company/tech-stacks/${id}`, data)).data;
  },

  async deleteTechStack(id: string): Promise<ApiEnvelope<any>> {
    return (await api.delete<ApiEnvelope<any>>(`/api/company/tech-stacks/${id}`)).data;
  },

  async getOfficeLocations(): Promise<ApiEnvelope<any[]>> {
    return (await api.get<ApiEnvelope<any[]>>('/api/company/office-locations')).data;
  },

  async createOfficeLocation(data: any): Promise<ApiEnvelope<any>> {
    return (await api.post<ApiEnvelope<any>>('/api/company/office-locations', data)).data;
  },

  async updateOfficeLocation(id: string, data: any): Promise<ApiEnvelope<any>> {
    return (await api.put<ApiEnvelope<any>>(`/api/company/office-locations/${id}`, data)).data;
  },

  async deleteOfficeLocation(id: string): Promise<ApiEnvelope<any>> {
    return (await api.delete<ApiEnvelope<any>>(`/api/company/office-locations/${id}`)).data;
  },

  async getBenefits(): Promise<ApiEnvelope<any[]>> {
    return (await api.get<ApiEnvelope<any[]>>('/api/company/benefits')).data;
  },

  async createBenefit(data: any): Promise<ApiEnvelope<any>> {
    return (await api.post<ApiEnvelope<any>>('/api/company/benefits', data)).data;
  },

  async updateBenefit(id: string, data: any): Promise<ApiEnvelope<any>> {
    return (await api.put<ApiEnvelope<any>>(`/api/company/benefits/${id}`, data)).data;
  },

  async deleteBenefit(id: string): Promise<ApiEnvelope<any>> {
    return (await api.delete<ApiEnvelope<any>>(`/api/company/benefits/${id}`)).data;
  },

  async getWorkplacePictures(): Promise<ApiEnvelope<any[]>> {
    return (await api.get<ApiEnvelope<any[]>>('/api/company/workplace-pictures')).data;
  },

  async createWorkplacePicture(data: any): Promise<ApiEnvelope<any>> {
    return (await api.post<ApiEnvelope<any>>('/api/company/workplace-pictures', data)).data;
  },

  async updateWorkplacePicture(id: string, data: any): Promise<ApiEnvelope<any>> {
    return (await api.put<ApiEnvelope<any>>(`/api/company/workplace-pictures/${id}`, data)).data;
  },

  async deleteWorkplacePicture(id: string): Promise<ApiEnvelope<any>> {
    return (await api.delete<ApiEnvelope<any>>(`/api/company/workplace-pictures/${id}`)).data;
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
    return (await api.get<ApiEnvelope<{ applications: any[], total: number, page: number, limit: number }>>(endpoint)).data;
  },

  async getApplicationDetails(id: string): Promise<ApiEnvelope<any>> {
    return (await api.get<ApiEnvelope<any>>(`/api/company/applications/${id}`)).data;
  },

  async getSubscriptionPlans(): Promise<ApiEnvelope<{ plans: SubscriptionPlan[] }>> {
    return (await api.get<ApiEnvelope<{ plans: SubscriptionPlan[] }>>('/api/company/subscription-plans')).data;
  },

  async purchaseSubscription(planId: string, billingCycle?: 'monthly' | 'annual'): Promise<ApiEnvelope<PurchaseSubscriptionResponse>> {
    return (await api.post<ApiEnvelope<PurchaseSubscriptionResponse>>('/api/company/subscriptions/purchase', { planId, billingCycle })).data;
  },

  async getActiveSubscription(): Promise<ApiEnvelope<ActiveSubscriptionResponse>> {
    return (await api.get<ApiEnvelope<ActiveSubscriptionResponse>>('/api/company/subscriptions/active')).data;
  },

  async getPaymentHistory(): Promise<ApiEnvelope<PaymentHistoryItem[]>> {
    return (await api.get<ApiEnvelope<PaymentHistoryItem[]>>('/api/company/subscriptions/payment-history')).data;
  },

  // Stripe Subscription Methods
  async createCheckoutSession(planId: string, billingCycle: 'monthly' | 'yearly', successUrl: string, cancelUrl: string): Promise<ApiEnvelope<CheckoutSessionResponse>> {
    return (await api.post<ApiEnvelope<CheckoutSessionResponse>>('/api/company/subscriptions/create-checkout-session', {
      planId,
      billingCycle,
      successUrl,
      cancelUrl,
    })).data;
  },

  async cancelSubscription(): Promise<ApiEnvelope<ActiveSubscriptionResponse>> {
    return (await api.post<ApiEnvelope<ActiveSubscriptionResponse>>('/api/company/subscriptions/cancel', {})).data;
  },

  async resumeSubscription(): Promise<ApiEnvelope<ActiveSubscriptionResponse>> {
    return (await api.post<ApiEnvelope<ActiveSubscriptionResponse>>('/api/company/subscriptions/resume', {})).data;
  },

  async changeSubscriptionPlan(planId: string, billingCycle?: 'monthly' | 'yearly'): Promise<ApiEnvelope<{ subscription: ActiveSubscriptionResponse }>> {
    return (await api.post<ApiEnvelope<{ subscription: ActiveSubscriptionResponse }>>('/api/company/subscriptions/change-plan', {
      planId,
      billingCycle,
    })).data;
  },

  async getBillingPortalUrl(returnUrl: string): Promise<ApiEnvelope<BillingPortalResponse>> {
    return (await api.post<ApiEnvelope<BillingPortalResponse>>('/api/company/subscriptions/billing-portal', { returnUrl })).data;
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
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PurchaseSubscriptionResponse {
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

interface ActiveSubscriptionResponse {
  id: string;
  companyId: string;
  planId: string;
  startDate: string | null;
  expiryDate: string | null;
  isActive: boolean;
  jobPostsUsed: number;
  featuredJobsUsed: number;
  applicantAccessUsed: number;
  activeJobCount: number;
  planName?: string;
  jobPostLimit?: number;
  featuredJobLimit?: number;
  plan?: {
    id: string;
    name: string;
    jobPostLimit: number;
    featuredJobLimit: number;
    isDefault?: boolean;
  };
  stripeStatus?: string;
  billingCycle?: 'monthly' | 'yearly';
  cancelAtPeriodEnd?: boolean;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
}

interface PaymentHistoryItem {
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

interface CheckoutSessionResponse {
  sessionId: string;
  sessionUrl: string;
}

interface BillingPortalResponse {
  url: string;
}
