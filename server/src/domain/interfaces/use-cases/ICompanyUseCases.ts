import { CompanyProfile } from '../../entities/company-profile.entity';
import { CompanyVerification } from '../../entities/company-verification.entity';
import { CompanyContact } from '../../entities/company-contact.entity';
import { CompanyTechStack } from '../../entities/company-tech-stack.entity';
import { CompanyOfficeLocation } from '../../entities/company-office-location.entity';
import { CompanyBenefits } from '../../entities/company-benefits.entity';
import { CompanyWorkplacePictures } from '../../entities/company-workplace-pictures.entity';
import { JobPosting } from '../../entities/job-posting.entity';
import { CompanyProfileResponseDto } from '../../../application/dto/company/company-response.dto';
import { CompanySubscription } from 'src/domain/entities/company-subscription.entity';
import { PaymentOrder } from 'src/domain/entities/payment-order.entity';
import { JobPostingQueryRequestDto } from 'src/application/dto/job-posting/job-posting.dto';
import { CompanyJobPostingListItemDto } from 'src/application/dto/job-posting/job-posting-response.dto';
import { SimpleUpdateCompanyProfileRequestDto } from 'src/application/dto/company/company-profile.dto';
import { CreateCompanyProfileData } from './company/CreateCompanyProfileData';
import { CompanyVerificationData } from './company/CompanyVerificationData';
import { CompanyContactData } from './company/CompanyContactData';
import { CompanyTechStackData } from './company/CompanyTechStackData';
import { CompanyOfficeLocationData } from './company/CompanyOfficeLocationData';
import { CompanyBenefitsData } from './company/CompanyBenefitsData';
import { CompanyWorkplacePicturesData } from './company/CompanyWorkplacePicturesData';
import { CreateJobPostingData } from './jobs/CreateJobPostingData';
import { UpdateJobPostingData } from './jobs/UpdateJobPostingData';
import { ChangeSubscriptionResult } from './subscriptions/ChangeSubscriptionResult';
import { UploadWorkplacePictureResult } from './company/UploadWorkplacePictureResult';
import { UploadBusinessLicenseResult } from './company/UploadBusinessLicenseResult';
import { UploadLogoResult } from './public/UploadLogoResult';

export interface ICreateCompanyProfileUseCase {
  execute(userId: string, profileData: CreateCompanyProfileData): Promise<CompanyProfile>;
}

export interface IGetCompanyProfileUseCase {
  execute(userId: string): Promise<{
    profile: CompanyProfile;
    contact: CompanyContact | null;
    locations: CompanyOfficeLocation[];
    techStack: CompanyTechStack[];
    benefits: CompanyBenefits[];
    workplacePictures: CompanyWorkplacePictures[];
    verification: CompanyVerification | null;
  } | null>;
}

export interface IReapplyCompanyVerificationUseCase {
  execute(userId: string, verificationData: CompanyVerificationData): Promise<CompanyProfile>;
}

export interface ICompanyContactUseCase {
  createContact(companyId: string, data: CompanyContactData): Promise<CompanyContact>;
  getContactsByCompanyId(companyId: string): Promise<CompanyContact[]>;
  updateContact(contactId: string, data: CompanyContactData): Promise<CompanyContact>;
  deleteContact(contactId: string): Promise<void>;
  upsertContact(companyId: string, data: CompanyContactData): Promise<CompanyContact>;
}

export interface ICreateCompanyTechStackUseCase {
  execute(companyId: string, data: CompanyTechStackData): Promise<CompanyTechStack>;
}

export interface IUpdateCompanyTechStackUseCase {
  execute(techStackId: string, data: CompanyTechStackData): Promise<CompanyTechStack>;
}

export interface IDeleteCompanyTechStackUseCase {
  execute(techStackId: string): Promise<void>;
}

export interface IGetCompanyTechStackUseCase {
  executeByCompanyId(companyId: string): Promise<CompanyTechStack[]>;
  executeById(techStackId: string): Promise<CompanyTechStack | null>;
}

export interface ICreateCompanyOfficeLocationUseCase {
  execute(companyId: string, data: CompanyOfficeLocationData): Promise<CompanyOfficeLocation>;
}

export interface IUpdateCompanyOfficeLocationUseCase {
  execute(companyId: string, locationId: string, data: CompanyOfficeLocationData): Promise<CompanyOfficeLocation>;
}

export interface IDeleteCompanyOfficeLocationUseCase {
  execute(companyId: string, locationId: string): Promise<void>;
}

export interface IGetCompanyOfficeLocationUseCase {
  executeByCompanyId(companyId: string): Promise<CompanyOfficeLocation[]>;
  executeById(locationId: string): Promise<CompanyOfficeLocation | null>;
}

export interface ICreateCompanyBenefitUseCase {
  execute(companyId: string, data: CompanyBenefitsData): Promise<CompanyBenefits>;
}

export interface IUpdateCompanyBenefitUseCase {
  execute(companyId: string, benefitId: string, data: CompanyBenefitsData): Promise<CompanyBenefits>;
}

export interface IDeleteCompanyBenefitUseCase {
  execute(companyId: string, benefitId: string): Promise<void>;
}

export interface IGetCompanyBenefitUseCase {
  executeByCompanyId(companyId: string): Promise<CompanyBenefits[]>;
  executeById(benefitId: string): Promise<CompanyBenefits | null>;
}

export interface ICreateCompanyWorkplacePictureUseCase {
  execute(companyId: string, data: CompanyWorkplacePicturesData): Promise<CompanyWorkplacePictures>;
}

export interface IUpdateCompanyWorkplacePictureUseCase {
  execute(pictureId: string, data: CompanyWorkplacePicturesData): Promise<CompanyWorkplacePictures>;
}

export interface IDeleteCompanyWorkplacePictureUseCase {
  execute(pictureId: string): Promise<void>;
}

export interface IGetCompanyWorkplacePictureUseCase {
  executeByCompanyId(companyId: string): Promise<CompanyWorkplacePictures[]>;
  executeById(pictureId: string): Promise<CompanyWorkplacePictures | null>;
}

export interface ICreateJobPostingUseCase {
  execute(userId: string, jobData: CreateJobPostingData): Promise<JobPosting>;
}

export interface IGetJobPostingUseCase {
  execute(jobId: string): Promise<JobPosting>;
}

export interface IUpdateJobPostingUseCase {
  execute(jobId: string, updates: UpdateJobPostingData): Promise<JobPosting>;
}

export interface IUpdateJobStatusUseCase {
  execute(jobId: string, status: string, userId?: string): Promise<JobPosting>;
}

export interface IUploadLogoUseCase {
  execute(buffer: Buffer, originalname: string, mimetype: string): Promise<UploadLogoResult>;
}

export interface IGetCompanyJobPostingUseCase {
  execute(jobId: string, companyId: string): Promise<JobPosting>;
}

export interface IGetCompanyIdByUserIdUseCase {
  execute(userId: string): Promise<string>;
}

export interface IGetCompanyProfileByUserIdUseCase {
  execute(userId: string): Promise<CompanyProfile | null>;
}

export interface IUploadBusinessLicenseUseCase {
  execute(buffer: Buffer, originalname: string, mimetype: string): Promise<UploadBusinessLicenseResult>;
}

export interface IUploadWorkplacePictureUseCase {
  execute(buffer: Buffer, originalname: string, mimetype: string): Promise<UploadWorkplacePictureResult>;
}

export interface IDeleteImageUseCase {
  execute(imageUrl: string): Promise<void>;
}

export interface IGetCompanyProfileWithJobPostingsUseCase {
  execute(userId: string): Promise<import('../../../application/dto/company/company-response.dto').CompanyProfileWithDetailsResponseDto>;
}

export interface IGetCompanyDashboardUseCase {
  execute(userId: string): Promise<{
    hasProfile: boolean;
    profile: Awaited<ReturnType<IGetCompanyProfileUseCase['execute']>>;
    profileStatus: 'not_created' | 'pending' | 'verified' | 'rejected';
  }>;
}

export interface ICreateCompanyProfileFromDtoUseCase {
  execute(userId: string, dto: {
    company_name: string;
    logo?: string;
    website?: string;
    employees: string;
    industry: string;
    organisation: string;
    description: string;
    tax_id?: string;
    business_license?: string;
    email?: string;
    location?: string;
  }): Promise<CompanyProfile>;
}

export interface IGetActiveSubscriptionUseCase {
  execute(userId: string): Promise<(CompanySubscription & { activeJobCount?: number }) | null>;
}

export interface IResumeSubscriptionUseCase {
  execute(userId: string): Promise<CompanySubscription>;
}

export interface ICancelSubscriptionUseCase {
  execute(userId: string): Promise<CompanySubscription>;
}

export interface IRevertToDefaultPlanUseCase {
  execute(companyId: string): Promise<CompanySubscription>;
}

export interface IHandleStripeWebhookUseCase {
  execute(payload: string | Buffer, signature: string): Promise<{ received: boolean }>;
}

export interface IGetPaymentHistoryUseCase {
  execute(userId: string): Promise<PaymentOrder[]>;
}

export interface IGetBillingPortalUseCase {
  execute(userId: string, returnUrl: string): Promise<{ url: string }>;
}

export interface ICreateCheckoutSessionUseCase {
  execute(
    userId: string,
    planId: string,
    billingCycle: 'monthly' | 'yearly',
    successUrl: string,
    cancelUrl: string,
  ): Promise<{ sessionId: string; sessionUrl: string }>;
}

export interface IChangeSubscriptionPlanUseCase {
  execute(
    userId: string,
    newPlanId: string,
    billingCycle?: 'monthly' | 'yearly',
  ): Promise<ChangeSubscriptionResult>;
}

export interface IGetCompanyJobPostingsUseCase {
  execute(userId: string, query: JobPostingQueryRequestDto): Promise<{
    jobs: CompanyJobPostingListItemDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
}

export interface IUpdateCompanyProfileUseCase {
  execute(userId: string, data: { profile: SimpleUpdateCompanyProfileRequestDto }): Promise<CompanyProfileResponseDto>;
}

export interface IDeleteJobPostingUseCase {
  execute(id: string, userId: string): Promise<void>;
}

export interface IIncrementJobViewCountUseCase {
  execute(id: string, userRole?: string): Promise<void>;
}