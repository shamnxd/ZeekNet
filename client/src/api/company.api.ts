import { api } from './index';
import { uploadFile } from '@/shared/utils/file-upload.util';
import type { ApiEnvelope } from '@/interfaces/auth';
import type { JobPostingResponse } from '@/interfaces/job/job-posting-response.interface';
import type { JobPostingQuery } from '@/interfaces/job/job-posting-query.interface';
import { CompanyRoutes } from '@/constants/api-routes';
import type { CompanyContact, TechStackItem, OfficeLocation, Benefit, WorkplacePicture, CompanySideApplication } from '@/interfaces/company/company-data.interface';
import type {
  CompanyProfileData,
  CompanyProfileResponse,
  JobPostingRequest,
  CompanyDashboard
} from '@/interfaces/company/company-api.interface';
import type { Experience, Education, SeekerProfile } from '@/interfaces/seeker/seeker.interface';
import type { SubscriptionPlan } from '@/interfaces/company/subscription/subscription-plan.interface';
import type { PurchaseSubscriptionResponse } from '@/interfaces/company/subscription/purchase-subscription-response.interface';
import type { ActiveSubscriptionResponse } from '@/interfaces/company/subscription/active-subscription-response.interface';
import type { PaymentHistoryItem } from '@/interfaces/company/subscription/payment-history-item.interface';
import type { CheckoutSessionResponse } from '@/interfaces/company/subscription/checkout-session-response.interface';
import type { BillingPortalResponse } from '@/interfaces/company/subscription/billing-portal-response.interface';
import type { ApplicationsKanbanResponse, MoveApplicationStageRequest, UpdateSubStageRequest } from '@/interfaces/ats/ats-pipeline.interface';

export type {
  CompanyProfileData,
  CompanyProfileResponse,
  JobPostingRequest,
  CompanyDashboard
};

export interface CandidateDetailsResponse {
  profile: Partial<SeekerProfile> & { avatarFileName?: string; bannerFileName?: string };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  experiences: Experience[];
  educations: Education[];
}

export interface Candidate {
  id: string;
  userId: string;
  name: string;
  email: string;
  headline: string | null;
  summary: string | null;
  location: string | null;
  skills: string[];
  avatar: string | null;
}

export const companyApi = {
  async createProfile(data: CompanyProfileData): Promise<ApiEnvelope<CompanyProfileResponse>> {
    return (await api.post<ApiEnvelope<CompanyProfileResponse>>(CompanyRoutes.PROFILE, data)).data;
  },

  async updateProfile(data: Partial<CompanyProfileData>): Promise<ApiEnvelope<CompanyProfileResponse>> {
    const hasFileUpload = ((data.logo as unknown) instanceof File) ||
      ((data.business_license as unknown) instanceof File);

    if (!hasFileUpload) {
      return (await api.put<ApiEnvelope<CompanyProfileResponse>>(CompanyRoutes.PROFILE, data)).data;
    }

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if ((value as unknown) instanceof File) {
          formData.append(key, value as unknown as File);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    return (await api.put<ApiEnvelope<CompanyProfileResponse>>(CompanyRoutes.PROFILE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
  },

  async reapplyVerification(data: CompanyProfileData): Promise<ApiEnvelope<CompanyProfileResponse>> {
    return (await api.post<ApiEnvelope<CompanyProfileResponse>>(CompanyRoutes.REAPPLY_VERIFICATION, data)).data;
  },

  async uploadLogo(file: File): Promise<ApiEnvelope<{ url: string; filename: string }>> {
    return uploadFile<{ url: string; filename: string }>(CompanyRoutes.UPLOAD_LOGO, file, 'logo');
  },

  async uploadBusinessLicense(file: File): Promise<ApiEnvelope<{ url: string; filename: string }>> {
    return uploadFile<{ url: string; filename: string }>(CompanyRoutes.UPLOAD_BUSINESS_LICENSE, file, 'business_license');
  },

  async deleteImage(imageUrl: string): Promise<ApiEnvelope<{ message: string }>> {
    return (await api.delete<ApiEnvelope<{ message: string }>>(CompanyRoutes.DELETE_UPLOAD, { data: { imageUrl } })).data;
  },

  async getProfile(): Promise<ApiEnvelope<CompanyProfileResponse>> {
    return (await api.get<ApiEnvelope<CompanyProfileResponse>>(CompanyRoutes.PROFILE)).data;
  },

  async getCompleteProfile(): Promise<ApiEnvelope<{
    profile: CompanyProfileResponse;
    contact: CompanyContact | null;
    locations: OfficeLocation[];
    techStack: TechStackItem[];
    benefits: Benefit[];
    workplacePictures: WorkplacePicture[];
    jobPostings: JobPostingResponse[];
  }>> {
    return (await api.get<ApiEnvelope<{
      profile: CompanyProfileResponse;
      contact: CompanyContact | null;
      locations: OfficeLocation[];
      techStack: TechStackItem[];
      benefits: Benefit[];
      workplacePictures: WorkplacePicture[];
      jobPostings: JobPostingResponse[];
    }>>(CompanyRoutes.PROFILE)).data;
  },

  async getProfileById(profileId: string): Promise<ApiEnvelope<CompanyProfileResponse>> {
    return (await api.get<ApiEnvelope<CompanyProfileResponse>>(CompanyRoutes.PROFILE_BY_ID.replace(':profileId', profileId))).data;
  },

  async getDashboard(): Promise<ApiEnvelope<CompanyDashboard>> {
    return (await api.get<ApiEnvelope<CompanyDashboard>>(CompanyRoutes.DASHBOARD)).data;
  },

  async getDashboardStats(): Promise<ApiEnvelope<{ activeJobs: number; totalJobs: number; totalApplications: number; upcomingInterviews: number; unreadMessages: number }>> {
    return (await api.get(CompanyRoutes.DASHBOARD)).data;
  },

  async createJobPosting(data: JobPostingRequest): Promise<ApiEnvelope<JobPostingResponse>> {
    return (await api.post<ApiEnvelope<JobPostingResponse>>(CompanyRoutes.JOBS, data)).data;
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

    const endpoint = params.toString() ? `${CompanyRoutes.JOBS}?${params.toString()}` : CompanyRoutes.JOBS;
    return (await api.get<ApiEnvelope<{ jobs: JobPostingResponse[], pagination: { page: number, limit: number, total: number, totalPages: number } }>>(endpoint)).data;
  },

  async getJobPosting(id: string): Promise<ApiEnvelope<JobPostingResponse>> {
    return (await api.get<ApiEnvelope<JobPostingResponse>>(CompanyRoutes.JOBS_ID.replace(':id', id))).data;
  },

  async updateJobPosting(id: string, data: Partial<JobPostingRequest>): Promise<ApiEnvelope<JobPostingResponse>> {
    return (await api.put<ApiEnvelope<JobPostingResponse>>(CompanyRoutes.JOBS_ID.replace(':id', id), data)).data;
  },

  async deleteJobPosting(id: string): Promise<ApiEnvelope<{ message: string }>> {
    return (await api.delete<ApiEnvelope<{ message: string }>>(CompanyRoutes.JOBS_ID.replace(':id', id))).data;
  },

  async updateJobStatus(id: string, status: 'active' | 'unlisted' | 'expired' | 'blocked'): Promise<ApiEnvelope<JobPostingResponse>> {
    return (await api.patch<ApiEnvelope<JobPostingResponse>>(CompanyRoutes.JOBS_ID_STATUS.replace(':id', id), { status })).data;
  },

  async closeJob(id: string): Promise<ApiEnvelope<{ message: string }>> {
    return (await api.post<ApiEnvelope<{ message: string }>>(CompanyRoutes.JOBS_ID_CLOSE.replace(':id', id))).data;
  },

  async reopenJob(id: string, additionalVacancies: number): Promise<ApiEnvelope<{ message: string }>> {
    return (await api.post<ApiEnvelope<{ message: string }>>(CompanyRoutes.JOBS_ID_REOPEN.replace(':id', id), { additionalVacancies })).data;
  },

  async toggleFeaturedJob(id: string): Promise<ApiEnvelope<{ message: string }>> {
    return (await api.patch<ApiEnvelope<{ message: string }>>(CompanyRoutes.JOBS_ID.replace(':id', id) + '/featured')).data;
  },

  async getContact(): Promise<ApiEnvelope<CompanyContact | null>> {
    return (await api.get<ApiEnvelope<CompanyContact | null>>(CompanyRoutes.CONTACT)).data;
  },

  async updateContact(data: Partial<CompanyContact>): Promise<ApiEnvelope<CompanyContact>> {
    return (await api.put<ApiEnvelope<CompanyContact>>(CompanyRoutes.CONTACT, data)).data;
  },

  async getTechStacks(): Promise<ApiEnvelope<TechStackItem[]>> {
    return (await api.get<ApiEnvelope<TechStackItem[]>>(CompanyRoutes.TECH_STACKS)).data;
  },

  async createTechStack(data: Partial<TechStackItem>): Promise<ApiEnvelope<TechStackItem>> {
    return (await api.post<ApiEnvelope<TechStackItem>>(CompanyRoutes.TECH_STACKS, data)).data;
  },

  async updateTechStack(id: string, data: Partial<TechStackItem>): Promise<ApiEnvelope<TechStackItem>> {
    return (await api.put<ApiEnvelope<TechStackItem>>(CompanyRoutes.TECH_STACKS_ID.replace(':id', id), data)).data;
  },

  async deleteTechStack(id: string): Promise<ApiEnvelope<{ message: string }>> {
    return (await api.delete<ApiEnvelope<{ message: string }>>(CompanyRoutes.TECH_STACKS_ID.replace(':id', id))).data;
  },

  async getOfficeLocations(): Promise<ApiEnvelope<OfficeLocation[]>> {
    return (await api.get<ApiEnvelope<OfficeLocation[]>>(CompanyRoutes.OFFICE_LOCATIONS)).data;
  },

  async createOfficeLocation(data: Partial<OfficeLocation>): Promise<ApiEnvelope<OfficeLocation>> {
    return (await api.post<ApiEnvelope<OfficeLocation>>(CompanyRoutes.OFFICE_LOCATIONS, data)).data;
  },

  async updateOfficeLocation(id: string, data: Partial<OfficeLocation>): Promise<ApiEnvelope<OfficeLocation>> {
    return (await api.put<ApiEnvelope<OfficeLocation>>(CompanyRoutes.OFFICE_LOCATIONS_ID.replace(':id', id), data)).data;
  },

  async deleteOfficeLocation(id: string): Promise<ApiEnvelope<{ message: string }>> {
    return (await api.delete<ApiEnvelope<{ message: string }>>(CompanyRoutes.OFFICE_LOCATIONS_ID.replace(':id', id))).data;
  },

  async getBenefits(): Promise<ApiEnvelope<Benefit[]>> {
    return (await api.get<ApiEnvelope<Benefit[]>>(CompanyRoutes.BENEFITS)).data;
  },

  async createBenefit(data: Partial<Benefit>): Promise<ApiEnvelope<Benefit>> {
    return (await api.post<ApiEnvelope<Benefit>>(CompanyRoutes.BENEFITS, data)).data;
  },

  async updateBenefit(id: string, data: Partial<Benefit>): Promise<ApiEnvelope<Benefit>> {
    return (await api.put<ApiEnvelope<Benefit>>(CompanyRoutes.BENEFITS_ID.replace(':id', id), data)).data;
  },

  async deleteBenefit(id: string): Promise<ApiEnvelope<{ message: string }>> {
    return (await api.delete<ApiEnvelope<{ message: string }>>(CompanyRoutes.BENEFITS_ID.replace(':id', id))).data;
  },

  async getWorkplacePictures(): Promise<ApiEnvelope<WorkplacePicture[]>> {
    return (await api.get<ApiEnvelope<WorkplacePicture[]>>(CompanyRoutes.WORKPLACE_PICTURES)).data;
  },

  async createWorkplacePicture(data: Partial<WorkplacePicture>): Promise<ApiEnvelope<WorkplacePicture>> {
    return (await api.post<ApiEnvelope<WorkplacePicture>>(CompanyRoutes.WORKPLACE_PICTURES, data)).data;
  },

  async updateWorkplacePicture(id: string, data: Partial<WorkplacePicture>): Promise<ApiEnvelope<WorkplacePicture>> {
    return (await api.put<ApiEnvelope<WorkplacePicture>>(CompanyRoutes.WORKPLACE_PICTURES_ID.replace(':id', id), data)).data;
  },

  async deleteWorkplacePicture(id: string): Promise<ApiEnvelope<{ message: string }>> {
    return (await api.delete<ApiEnvelope<{ message: string }>>(CompanyRoutes.WORKPLACE_PICTURES_ID.replace(':id', id))).data;
  },

  async uploadWorkplacePicture(file: File): Promise<ApiEnvelope<{ url: string; filename: string }>> {
    return uploadFile<{ url: string; filename: string }>(CompanyRoutes.WORKPLACE_PICTURES_UPLOAD, file, 'image');
  },

  async getApplications(query?: { page?: number; limit?: number; search?: string; job_id?: string; stage?: string }): Promise<ApiEnvelope<{ applications: CompanySideApplication[], total: number, page: number, limit: number }>> {
    const params = new URLSearchParams();

    if (query) {
      if (query.page !== undefined) params.append('page', query.page.toString());
      if (query.limit !== undefined) params.append('limit', query.limit.toString());
      if (query.search) params.append('search', query.search);
      if (query.job_id) params.append('job_id', query.job_id);
      if (query.stage) params.append('stage', query.stage);
    }

    const endpoint = params.toString() ? `${CompanyRoutes.APPLICATIONS}?${params.toString()}` : CompanyRoutes.APPLICATIONS;
    return (await api.get<ApiEnvelope<{ applications: CompanySideApplication[], total: number, page: number, limit: number }>>(endpoint)).data;
  },

  async getApplicationDetails(id: string): Promise<ApiEnvelope<CompanySideApplication>> {
    return (await api.get<ApiEnvelope<CompanySideApplication>>(CompanyRoutes.APPLICATIONS_ID.replace(':id', id))).data;
  },

  async getSubscriptionPlans(): Promise<ApiEnvelope<{ plans: SubscriptionPlan[] }>> {
    return (await api.get<ApiEnvelope<{ plans: SubscriptionPlan[] }>>(CompanyRoutes.SUBSCRIPTION_PLANS)).data;
  },

  async purchaseSubscription(planId: string, billingCycle?: 'monthly' | 'annual'): Promise<ApiEnvelope<PurchaseSubscriptionResponse>> {
    return (await api.post<ApiEnvelope<PurchaseSubscriptionResponse>>(CompanyRoutes.SUBSCRIPTIONS_PURCHASE, { planId, billingCycle })).data;
  },

  async getActiveSubscription(): Promise<ApiEnvelope<ActiveSubscriptionResponse>> {
    return (await api.get<ApiEnvelope<ActiveSubscriptionResponse>>(CompanyRoutes.SUBSCRIPTIONS_ACTIVE)).data;
  },

  async getPaymentHistory(): Promise<ApiEnvelope<PaymentHistoryItem[]>> {
    return (await api.get<ApiEnvelope<PaymentHistoryItem[]>>(CompanyRoutes.SUBSCRIPTIONS_PAYMENT_HISTORY)).data;
  },


  async createCheckoutSession(planId: string, billingCycle: 'monthly' | 'yearly', successUrl: string, cancelUrl: string): Promise<ApiEnvelope<CheckoutSessionResponse>> {
    return (await api.post<ApiEnvelope<CheckoutSessionResponse>>(CompanyRoutes.SUBSCRIPTIONS_CREATE_CHECKOUT, {
      planId,
      billingCycle,
      successUrl,
      cancelUrl,
    })).data;
  },

  async cancelSubscription(): Promise<ApiEnvelope<ActiveSubscriptionResponse>> {
    return (await api.post<ApiEnvelope<ActiveSubscriptionResponse>>(CompanyRoutes.SUBSCRIPTIONS_CANCEL, {})).data;
  },

  async resumeSubscription(): Promise<ApiEnvelope<ActiveSubscriptionResponse>> {
    return (await api.post<ApiEnvelope<ActiveSubscriptionResponse>>(CompanyRoutes.SUBSCRIPTIONS_RESUME, {})).data;
  },

  async changeSubscriptionPlan(planId: string, billingCycle?: 'monthly' | 'yearly'): Promise<ApiEnvelope<{ subscription: ActiveSubscriptionResponse }>> {
    return (await api.post<ApiEnvelope<{ subscription: ActiveSubscriptionResponse }>>(CompanyRoutes.SUBSCRIPTIONS_CHANGE_PLAN, {
      planId,
      billingCycle,
    })).data;
  },

  async getBillingPortalUrl(returnUrl: string): Promise<ApiEnvelope<BillingPortalResponse>> {
    return (await api.post<ApiEnvelope<BillingPortalResponse>>(CompanyRoutes.SUBSCRIPTIONS_BILLING_PORTAL, { returnUrl })).data;
  },

  async getCandidates(query?: { page?: number; limit?: number; search?: string; skills?: string[]; location?: string }): Promise<ApiEnvelope<{ candidates: Candidate[]; total: number; page: number; limit: number; totalPages: number }>> {
    const params = new URLSearchParams();
    if (query) {
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.search) params.append('search', query.search);
      if (query.location) params.append('location', query.location);
      if (query.skills?.length) params.append('skills', query.skills.join(','));
    }
    const endpoint = params.toString() ? `${CompanyRoutes.CANDIDATES}?${params.toString()}` : CompanyRoutes.CANDIDATES;
    return (await api.get(endpoint)).data;
  },

  async getCandidateDetails(id: string): Promise<ApiEnvelope<CandidateDetailsResponse>> {
    return (await api.get(`${CompanyRoutes.CANDIDATES}/${id}`)).data;
  },



  async getJobApplicationsForKanban(jobId: string): Promise<ApiEnvelope<ApplicationsKanbanResponse>> {
    const endpoint = CompanyRoutes.JOBS_ID_APPLICATIONS.replace(':job_id', jobId);
    return (await api.get(endpoint)).data;
  },

  async moveApplicationStage(applicationId: string, payload: MoveApplicationStageRequest): Promise<ApiEnvelope<CompanySideApplication>> {
    const endpoint = CompanyRoutes.APPLICATIONS_ID_MOVE_STAGE.replace(':id', applicationId);
    return (await api.post(endpoint, payload)).data;
  },

  async updateApplicationSubStage(applicationId: string, payload: UpdateSubStageRequest): Promise<ApiEnvelope<CompanySideApplication>> {
    const endpoint = CompanyRoutes.APPLICATIONS_ID_UPDATE_SUB_STAGE.replace(':id', applicationId);
    return (await api.post(endpoint, payload)).data;
  },

  async markApplicationAsHired(applicationId: string): Promise<ApiEnvelope<{ message: string }>> {
    const endpoint = CompanyRoutes.APPLICATIONS_ID_MARK_HIRED.replace(':id', applicationId);
    return (await api.post(endpoint)).data;
  },
}
