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
import { CreateCompanyProfileFromDtoRequestDto } from 'src/application/dto/company/create-company-profile-from-dto.dto';
import { CreateCheckoutSessionRequestDto } from 'src/application/dto/company/create-checkout-session.dto';
import { GetCompanyProfileResponseDto } from 'src/application/dto/company/company-profile-response.dto';
import { GetCompanyDashboardResponseDto } from 'src/application/dto/company/company-dashboard-response.dto';
import { CreateCheckoutSessionResponseDto } from 'src/application/dto/company/checkout-session-response.dto';
import { GetCompanyJobPostingsResponseDto } from 'src/application/dto/company/company-job-postings-response.dto';
import { UploadLogoRequestDto } from 'src/application/dto/company/upload-logo.dto';
import { UploadBusinessLicenseRequestDto } from 'src/application/dto/company/upload-business-license.dto';
import { UploadWorkplacePictureRequestDto } from 'src/application/dto/company/upload-workplace-picture.dto';
import { GetBillingPortalRequestDto } from 'src/application/dto/company/get-billing-portal.dto';
import { ChangeSubscriptionPlanRequestDto } from 'src/application/dto/company/change-subscription-plan.dto';
import { HandleStripeWebhookRequestDto } from 'src/application/dto/company/handle-stripe-webhook.dto';
import { CompanyProfileWithDetailsResponseDto } from 'src/application/dto/company/company-response.dto';
import { CreateCompanyProfileData } from './company/CreateCompanyProfileData';
import { CompanyVerificationData } from './company/CompanyVerificationData';
import { CompanyContactData } from './company/CompanyContactData';
import { CompanyTechStackData } from './company/CompanyTechStackData';
import { CompanyOfficeLocationData } from './company/CompanyOfficeLocationData';
import { CreateCompanyOfficeLocationRequestDto, UpdateCompanyOfficeLocationRequestDto } from 'src/application/dto/company/company-office-location.dto';
import { CompanyBenefitsData } from './company/CompanyBenefitsData';
import { CompanyWorkplacePicturesData } from './company/CompanyWorkplacePicturesData';
import { CreateJobPostingData } from './jobs/CreateJobPostingData';
import { UpdateJobPostingData } from './jobs/UpdateJobPostingData';
import { ChangeSubscriptionResult } from './subscriptions/ChangeSubscriptionResult';
import { UploadWorkplacePictureResult } from './company/UploadWorkplacePictureResult';
import { UploadBusinessLicenseResult } from './company/UploadBusinessLicenseResult';
import { UploadLogoResult } from './public/UploadLogoResult';

export interface ICreateCompanyProfileUseCase {
  execute(data: CreateCompanyProfileData): Promise<CompanyProfile>;
}

export interface IGetCompanyProfileUseCase {
  execute(userId: string): Promise<GetCompanyProfileResponseDto | null>;
}

export interface IReapplyCompanyVerificationUseCase {
  execute(data: CompanyVerificationData): Promise<CompanyProfile>;
}

export interface ICompanyContactUseCase {
  createContact(data: CompanyContactData): Promise<CompanyContact>;
  getContactsByCompanyId(companyId: string): Promise<CompanyContact[]>;
  updateContact(data: CompanyContactData): Promise<CompanyContact>;
  deleteContact(contactId: string): Promise<void>;
  upsertContact(data: CompanyContactData): Promise<CompanyContact>;
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
  execute(data: CreateCompanyOfficeLocationRequestDto): Promise<CompanyOfficeLocation>;
}

export interface IUpdateCompanyOfficeLocationUseCase {
  execute(data: UpdateCompanyOfficeLocationRequestDto): Promise<CompanyOfficeLocation>;
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
  execute(data: CreateJobPostingData): Promise<JobPosting>;
}

export interface IGetJobPostingUseCase {
  execute(jobId: string): Promise<JobPosting>;
}

export interface IUpdateJobPostingUseCase {
  execute(data: UpdateJobPostingData): Promise<JobPosting>;
}

export interface IUpdateJobStatusUseCase {
  execute(data: { jobId: string; status: 'active' | 'unlisted' | 'expired' | 'blocked'; userId?: string }): Promise<JobPosting>;
}

export interface IUploadLogoUseCase {
  execute(data: UploadLogoRequestDto): Promise<UploadLogoResult>;
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
  execute(userId: string): Promise<CompanyProfileWithDetailsResponseDto>;
}

export interface IGetCompanyDashboardUseCase {
  execute(userId: string): Promise<GetCompanyDashboardResponseDto>;
}

export interface ICreateCompanyProfileFromDtoUseCase {
  execute(data: CreateCompanyProfileFromDtoRequestDto): Promise<CompanyProfile>;
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
  execute(data: HandleStripeWebhookRequestDto): Promise<{ received: boolean }>;
}

export interface IGetPaymentHistoryUseCase {
  execute(userId: string): Promise<PaymentOrder[]>;
}

export interface IGetBillingPortalUseCase {
  execute(data: GetBillingPortalRequestDto): Promise<{ url: string }>;
}

export interface ICreateCheckoutSessionUseCase {
  execute(data: CreateCheckoutSessionRequestDto): Promise<CreateCheckoutSessionResponseDto>;
}

export interface IChangeSubscriptionPlanUseCase {
  execute(data: ChangeSubscriptionPlanRequestDto): Promise<ChangeSubscriptionResult>;
}

export interface IGetCompanyJobPostingsUseCase {
  execute(data: JobPostingQueryRequestDto): Promise<GetCompanyJobPostingsResponseDto>;
}

export interface IUpdateCompanyProfileUseCase {
  execute(data: SimpleUpdateCompanyProfileRequestDto): Promise<CompanyProfileResponseDto>;
}

export interface IDeleteJobPostingUseCase {
  execute(id: string, userId: string): Promise<void>;
}

export interface IIncrementJobViewCountUseCase {
  execute(id: string, userRole?: string): Promise<void>;
}