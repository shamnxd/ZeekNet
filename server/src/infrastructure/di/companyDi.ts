import { CompanyProfileRepository } from '../database/mongodb/repositories/company-profile.repository';
import { CompanyContactRepository } from '../database/mongodb/repositories/company-contact.repository';
import { CompanyVerificationRepository } from '../database/mongodb/repositories/company-verification.repository';
import { CompanyTechStackRepository } from '../database/mongodb/repositories/company-tech-stack.repository';
import { CompanyOfficeLocationRepository } from '../database/mongodb/repositories/company-office-location.repository';
import { CompanyBenefitsRepository } from '../database/mongodb/repositories/company-benefits.repository';
import { CompanyWorkplacePicturesRepository } from '../database/mongodb/repositories/company-workplace-pictures.repository';
import { JobPostingRepository } from '../database/mongodb/repositories/job-posting.repository';
import { JobApplicationRepository } from '../database/mongodb/repositories/job-application.repository';
import { UserRepository } from '../database/mongodb/repositories/user.repository';
import { SeekerProfileRepository } from '../database/mongodb/repositories/seeker-profile.repository';
import { SeekerExperienceRepository } from '../database/mongodb/repositories/seeker-experience.repository';
import { SeekerEducationRepository } from '../database/mongodb/repositories/seeker-education.repository';
import { notificationRepository } from './notificationDi';
import { S3Service } from '../external-services/s3/s3.service';
import { StripeService } from '../external-services/stripe/stripe.service';
import { logger } from '../config/logger';
import { CreateCompanyProfileUseCase } from '../../application/use-cases/company/create-company-profile.use-case';
import { CreateCompanyProfileFromDtoUseCase } from '../../application/use-cases/company/create-company-profile-from-dto.use-case';
import { UpdateCompanyProfileUseCase } from '../../application/use-cases/company/update-company-profile.use-case';
import { GetCompanyProfileUseCase } from '../../application/use-cases/company/get-company-profile.use-case';
import { GetCompanyProfileWithJobPostingsUseCase } from '../../application/use-cases/company/get-company-profile-with-job-postings.use-case';
import { GetCompanyDashboardUseCase } from '../../application/use-cases/company/get-company-dashboard.use-case';
import { ReapplyCompanyVerificationUseCase } from '../../application/use-cases/company/reapply-company-verification.use-case';
import { GetCompanyContactUseCase } from '../../application/use-cases/company/get-company-contact.use-case';
import { UpsertCompanyContactUseCase } from '../../application/use-cases/company/upsert-company-contact.use-case';
import { CreateCompanyTechStackUseCase } from '../../application/use-cases/company/create-company-tech-stack.use-case';
import { UpdateCompanyTechStackUseCase } from '../../application/use-cases/company/update-company-tech-stack.use-case';
import { DeleteCompanyTechStackUseCase } from '../../application/use-cases/company/delete-company-tech-stack.use-case';
import { GetCompanyTechStackUseCase } from '../../application/use-cases/company/get-company-tech-stack.use-case';
import { CreateCompanyOfficeLocationUseCase } from '../../application/use-cases/company/create-company-office-location.use-case';
import { UpdateCompanyOfficeLocationUseCase } from '../../application/use-cases/company/update-company-office-location.use-case';
import { DeleteCompanyOfficeLocationUseCase } from '../../application/use-cases/company/delete-company-office-location.use-case';
import { GetCompanyOfficeLocationUseCase } from '../../application/use-cases/company/get-company-office-location.use-case';
import { CreateCompanyBenefitUseCase } from '../../application/use-cases/company/create-company-benefit.use-case';
import { UpdateCompanyBenefitUseCase } from '../../application/use-cases/company/update-company-benefit.use-case';
import { DeleteCompanyBenefitUseCase } from '../../application/use-cases/company/delete-company-benefit.use-case';
import { GetCompanyBenefitUseCase } from '../../application/use-cases/company/get-company-benefit.use-case';
import { CreateCompanyWorkplacePictureUseCase } from '../../application/use-cases/company/create-company-workplace-picture.use-case';
import { UpdateCompanyWorkplacePictureUseCase } from '../../application/use-cases/company/update-company-workplace-picture.use-case';
import { DeleteCompanyWorkplacePictureUseCase } from '../../application/use-cases/company/delete-company-workplace-picture.use-case';
import { GetCompanyWorkplacePictureUseCase } from '../../application/use-cases/company/get-company-workplace-picture.use-case';
import { CreateJobPostingUseCase } from '../../application/use-cases/company/create-job-posting.use-case';
import { GetJobPostingUseCase } from '../../application/use-cases/company/get-job-posting.use-case';
import { GetCompanyJobPostingUseCase } from '../../application/use-cases/company/get-company-job-posting.use-case';
import { GetCompanyProfileByUserIdUseCase } from '../../application/use-cases/auth/get-company-profile-by-user-id.use-case';
import { GetCompanyJobPostingsUseCase } from '../../application/use-cases/company/get-company-job-postings.use-case';
import { UpdateJobPostingUseCase } from '../../application/use-cases/company/update-job-posting.use-case';
import { DeleteJobPostingUseCase } from '../../application/use-cases/company/delete-job-posting.use-case';
import { IncrementJobViewCountUseCase } from '../../application/use-cases/company/increment-job-view-count.use-case';
import { UpdateJobStatusUseCase } from '../../application/use-cases/company/update-job-status.use-case';
import { CompanyProfileController } from '../../presentation/controllers/company/company-profile.controller';
import { CompanyContactController } from '../../presentation/controllers/company/company-contact.controller';
import { CompanyTechStackController } from '../../presentation/controllers/company/company-tech-stack.controller';
import { CompanyOfficeLocationController } from '../../presentation/controllers/company/company-office-location.controller';
import { CompanyBenefitController } from '../../presentation/controllers/company/company-benefit.controller';
import { CompanyWorkplacePictureController } from '../../presentation/controllers/company/company-workplace-picture.controller';
import { CompanyUploadController } from '../../presentation/controllers/company/company-upload.controller';
import { CompanyJobPostingController } from '../../presentation/controllers/company/company-job-posting.controller';
import { CompanyJobApplicationController } from '../../presentation/controllers/company/job-application.controller';
import { GetApplicationsByJobUseCase } from '../../application/use-cases/company/get-applications-by-job.use-case';
import { GetApplicationsByCompanyUseCase } from '../../application/use-cases/company/get-applications-by-company.use-case';
import { GetApplicationDetailsUseCase } from '../../application/use-cases/company/get-application-details.use-case';
import { UpdateApplicationStageUseCase } from '../../application/use-cases/company/update-application-stage.use-case';
import { UpdateApplicationScoreUseCase } from '../../application/use-cases/company/update-application-score.use-case';
import { BulkUpdateApplicationsUseCase } from '../../application/use-cases/company/bulk-update-applications.use-case';
import { GetCompanyIdByUserIdUseCase } from '../../application/use-cases/company/get-company-id-by-user-id.use-case';
import { UploadLogoUseCase } from '../../application/use-cases/company/upload-logo.use-case';
import { UploadBusinessLicenseUseCase } from '../../application/use-cases/company/upload-business-license.use-case';
import { UploadWorkplacePictureUseCase } from '../../application/use-cases/company/upload-workplace-picture.use-case';
import { DeleteImageUseCase } from '../../application/use-cases/company/delete-image.use-case';
import { CompanySubscriptionPlanController } from '../../presentation/controllers/company/company-subscription-plan.controller';
import { CompanySubscriptionController } from '../../presentation/controllers/company/company-subscription.controller';
import { StripeWebhookController } from '../../presentation/controllers/payment/stripe-webhook.controller';
import { SubscriptionPlanRepository } from '../database/mongodb/repositories/subscription-plan.repository';
import { GetAllSubscriptionPlansUseCase } from '../../application/use-cases/admin/get-all-subscription-plans.use-case';
import { CompanySubscriptionRepository } from '../database/mongodb/repositories/company-subscription.repository';
import { PaymentOrderRepository } from '../database/mongodb/repositories/payment-order.repository';
import { GetActiveSubscriptionUseCase } from '../../application/use-cases/company/get-active-subscription.use-case';
import { GetPaymentHistoryUseCase } from '../../application/use-cases/company/get-payment-history.use-case';
import { CreateCheckoutSessionUseCase } from '../../application/use-cases/company/create-checkout-session.use-case';
import { HandleStripeWebhookUseCase } from '../../application/use-cases/company/handle-stripe-webhook.use-case';
import { CancelSubscriptionUseCase } from '../../application/use-cases/company/cancel-subscription.use-case';
import { ResumeSubscriptionUseCase } from '../../application/use-cases/company/resume-subscription.use-case';
import { ChangeSubscriptionPlanUseCase } from '../../application/use-cases/company/change-subscription-plan.use-case';
import { GetBillingPortalUseCase } from '../../application/use-cases/company/get-billing-portal.use-case';
import { SubscriptionMiddleware } from '../../presentation/middleware/subscription.middleware';
import { GetCandidatesUseCase } from '../../application/use-cases/company/get-candidates.use-case';
import { GetCandidateDetailsUseCase } from '../../application/use-cases/company/get-candidate-details.use-case';
import { CompanyCandidatesController } from '../../presentation/controllers/company/company-candidates.controller';
import { MarkCandidateHiredUseCase } from '../../application/use-cases/company/mark-candidate-hired.use-case';
import { CloseJobManuallyUseCase } from '../../application/use-cases/company/close-job-manually.use-case';
import { NodemailerService } from '../messaging/mailer';

const companyProfileRepository = new CompanyProfileRepository();
const companyContactRepository = new CompanyContactRepository();
const companyVerificationRepository = new CompanyVerificationRepository();
const companyTechStackRepository = new CompanyTechStackRepository();
const companyOfficeLocationRepository = new CompanyOfficeLocationRepository();
const companyBenefitsRepository = new CompanyBenefitsRepository();
const companyWorkplacePicturesRepository = new CompanyWorkplacePicturesRepository();
const jobPostingRepository = new JobPostingRepository();
const jobApplicationRepository = new JobApplicationRepository();
const userRepository = new UserRepository();
const seekerProfileRepository = new SeekerProfileRepository();
const seekerExperienceRepository = new SeekerExperienceRepository();
const seekerEducationRepository = new SeekerEducationRepository();
const subscriptionPlanRepository = new SubscriptionPlanRepository();
const companySubscriptionRepository = new CompanySubscriptionRepository();
const paymentOrderRepository = new PaymentOrderRepository();

const s3Service = new S3Service();

const stripeService = new StripeService();
logger.info('Stripe service initialized');

const createCompanyProfileUseCase = new CreateCompanyProfileUseCase(companyProfileRepository, companyContactRepository, companyOfficeLocationRepository, companyVerificationRepository, subscriptionPlanRepository, companySubscriptionRepository);

const updateCompanyProfileUseCase = new UpdateCompanyProfileUseCase(companyProfileRepository, companyVerificationRepository, s3Service);

const getCompanyProfileUseCase = new GetCompanyProfileUseCase(companyProfileRepository, companyContactRepository, companyTechStackRepository, companyOfficeLocationRepository, companyBenefitsRepository, companyWorkplacePicturesRepository, companyVerificationRepository);
const reapplyCompanyVerificationUseCase = new ReapplyCompanyVerificationUseCase(companyProfileRepository, companyVerificationRepository);
const getCompanyContactUseCase = new GetCompanyContactUseCase(companyContactRepository);
const upsertCompanyContactUseCase = new UpsertCompanyContactUseCase(companyContactRepository);

const createCompanyTechStackUseCase = new CreateCompanyTechStackUseCase(companyTechStackRepository);
const updateCompanyTechStackUseCase = new UpdateCompanyTechStackUseCase(companyTechStackRepository);
const deleteCompanyTechStackUseCase = new DeleteCompanyTechStackUseCase(companyTechStackRepository);
const getCompanyTechStackUseCase = new GetCompanyTechStackUseCase(companyTechStackRepository);

const createCompanyOfficeLocationUseCase = new CreateCompanyOfficeLocationUseCase(companyOfficeLocationRepository);
const updateCompanyOfficeLocationUseCase = new UpdateCompanyOfficeLocationUseCase(companyOfficeLocationRepository);
const deleteCompanyOfficeLocationUseCase = new DeleteCompanyOfficeLocationUseCase(companyOfficeLocationRepository);
const getCompanyOfficeLocationUseCase = new GetCompanyOfficeLocationUseCase(companyOfficeLocationRepository);

const createCompanyBenefitUseCase = new CreateCompanyBenefitUseCase(companyBenefitsRepository);
const updateCompanyBenefitUseCase = new UpdateCompanyBenefitUseCase(companyBenefitsRepository);
const deleteCompanyBenefitUseCase = new DeleteCompanyBenefitUseCase(companyBenefitsRepository);
const getCompanyBenefitUseCase = new GetCompanyBenefitUseCase(companyBenefitsRepository);

const createCompanyWorkplacePictureUseCase = new CreateCompanyWorkplacePictureUseCase(companyWorkplacePicturesRepository);
const updateCompanyWorkplacePictureUseCase = new UpdateCompanyWorkplacePictureUseCase(companyWorkplacePicturesRepository);
const deleteCompanyWorkplacePictureUseCase = new DeleteCompanyWorkplacePictureUseCase(companyWorkplacePicturesRepository);
const getCompanyWorkplacePictureUseCase = new GetCompanyWorkplacePictureUseCase(companyWorkplacePicturesRepository);

const getCompanyProfileByUserIdUseCase = new GetCompanyProfileByUserIdUseCase(companyProfileRepository);

const createJobPostingUseCase = new CreateJobPostingUseCase(jobPostingRepository, getCompanyProfileByUserIdUseCase, companySubscriptionRepository);

const getJobPostingUseCase = new GetJobPostingUseCase(jobPostingRepository);

const getCompanyJobPostingUseCase = new GetCompanyJobPostingUseCase(jobPostingRepository);

const getCompanyIdByUserIdUseCase = new GetCompanyIdByUserIdUseCase(getCompanyProfileUseCase);

const uploadLogoUseCase = new UploadLogoUseCase(s3Service, companyProfileRepository);
const uploadBusinessLicenseUseCase = new UploadBusinessLicenseUseCase(s3Service);
const uploadWorkplacePictureUseCase = new UploadWorkplacePictureUseCase(s3Service);
const deleteImageUseCase = new DeleteImageUseCase(s3Service);

const getCompanyJobPostingsUseCase = new GetCompanyJobPostingsUseCase(jobPostingRepository, companyProfileRepository);

const createCompanyProfileFromDtoUseCase = new CreateCompanyProfileFromDtoUseCase(createCompanyProfileUseCase);

const getCompanyProfileWithJobPostingsUseCase = new GetCompanyProfileWithJobPostingsUseCase(getCompanyProfileUseCase, getCompanyJobPostingsUseCase, s3Service);

const getCompanyDashboardUseCase = new GetCompanyDashboardUseCase(getCompanyProfileUseCase);

const updateJobPostingUseCase = new UpdateJobPostingUseCase(jobPostingRepository);

const deleteJobPostingUseCase = new DeleteJobPostingUseCase(jobPostingRepository, companyProfileRepository);

const incrementJobViewCountUseCase = new IncrementJobViewCountUseCase(jobPostingRepository);

const updateJobStatusUseCase = new UpdateJobStatusUseCase(jobPostingRepository, companySubscriptionRepository, companyProfileRepository);

const getApplicationsByJobUseCase = new GetApplicationsByJobUseCase(jobApplicationRepository, jobPostingRepository, companyProfileRepository, userRepository, seekerProfileRepository, s3Service);
const getApplicationsByCompanyUseCase = new GetApplicationsByCompanyUseCase(jobApplicationRepository, companyProfileRepository, userRepository, seekerProfileRepository, jobPostingRepository, s3Service);
const getApplicationDetailsUseCase = new GetApplicationDetailsUseCase(jobApplicationRepository, jobPostingRepository, companyProfileRepository, userRepository, seekerProfileRepository, seekerExperienceRepository, seekerEducationRepository, s3Service);
const updateApplicationStageUseCase = new UpdateApplicationStageUseCase(jobApplicationRepository, jobPostingRepository, companyProfileRepository);
const updateApplicationScoreUseCase = new UpdateApplicationScoreUseCase(jobApplicationRepository, jobPostingRepository, companyProfileRepository);
const bulkUpdateApplicationsUseCase = new BulkUpdateApplicationsUseCase(jobApplicationRepository, companyProfileRepository);

const getActiveSubscriptionUseCase = new GetActiveSubscriptionUseCase(companySubscriptionRepository, companyProfileRepository, jobPostingRepository);
const getPaymentHistoryUseCase = new GetPaymentHistoryUseCase(paymentOrderRepository, companyProfileRepository);

const createCheckoutSessionUseCase = new CreateCheckoutSessionUseCase(stripeService, subscriptionPlanRepository, companyProfileRepository, companySubscriptionRepository, userRepository);

const handleStripeWebhookUseCase = new HandleStripeWebhookUseCase(stripeService, subscriptionPlanRepository, companySubscriptionRepository, paymentOrderRepository, notificationRepository, companyProfileRepository, jobPostingRepository);

const cancelSubscriptionUseCase = new CancelSubscriptionUseCase(stripeService, companyProfileRepository, companySubscriptionRepository);

const resumeSubscriptionUseCase = new ResumeSubscriptionUseCase(stripeService, companyProfileRepository, companySubscriptionRepository);

const changeSubscriptionPlanUseCase = new ChangeSubscriptionPlanUseCase(stripeService, subscriptionPlanRepository, companyProfileRepository, companySubscriptionRepository, jobPostingRepository);

const getBillingPortalUseCase = new GetBillingPortalUseCase(stripeService, companyProfileRepository, companySubscriptionRepository);

const subscriptionMiddleware = new SubscriptionMiddleware(companySubscriptionRepository, companyProfileRepository);

const getCandidatesUseCase = new GetCandidatesUseCase(seekerProfileRepository, s3Service);
const getCandidateDetailsUseCase = new GetCandidateDetailsUseCase(seekerProfileRepository, seekerExperienceRepository, seekerEducationRepository, userRepository, s3Service);

const mailerService = new NodemailerService();
const markCandidateHiredUseCase = new MarkCandidateHiredUseCase(
  jobApplicationRepository,
  jobPostingRepository,
  companyProfileRepository,
  userRepository,
  mailerService,
);

const closeJobManuallyUseCase = new CloseJobManuallyUseCase(
  jobPostingRepository,
  jobApplicationRepository,
  companyProfileRepository,
  userRepository,
  mailerService,
);

const companyProfileController = new CompanyProfileController(
  createCompanyProfileFromDtoUseCase,
  updateCompanyProfileUseCase,
  getCompanyProfileWithJobPostingsUseCase,
  reapplyCompanyVerificationUseCase,
  getCompanyDashboardUseCase,
  uploadLogoUseCase,
);

const companyContactController = new CompanyContactController(
  getCompanyContactUseCase,
  upsertCompanyContactUseCase,
  getCompanyIdByUserIdUseCase,
);

const companyTechStackController = new CompanyTechStackController(
  createCompanyTechStackUseCase,
  updateCompanyTechStackUseCase,
  deleteCompanyTechStackUseCase,
  getCompanyTechStackUseCase,
  getCompanyIdByUserIdUseCase,
);

const companyOfficeLocationController = new CompanyOfficeLocationController(
  createCompanyOfficeLocationUseCase,
  updateCompanyOfficeLocationUseCase,
  deleteCompanyOfficeLocationUseCase,
  getCompanyOfficeLocationUseCase,
  getCompanyIdByUserIdUseCase,
);

const companyBenefitController = new CompanyBenefitController(
  createCompanyBenefitUseCase,
  updateCompanyBenefitUseCase,
  deleteCompanyBenefitUseCase,
  getCompanyBenefitUseCase,
  getCompanyIdByUserIdUseCase,
);

const companyWorkplacePictureController = new CompanyWorkplacePictureController(
  createCompanyWorkplacePictureUseCase,
  updateCompanyWorkplacePictureUseCase,
  deleteCompanyWorkplacePictureUseCase,
  getCompanyWorkplacePictureUseCase,
  getCompanyIdByUserIdUseCase,
);

const companyUploadController = new CompanyUploadController(
  uploadBusinessLicenseUseCase,
  uploadWorkplacePictureUseCase,
  deleteImageUseCase,
);

const companyJobPostingController = new CompanyJobPostingController(createJobPostingUseCase, getJobPostingUseCase, getCompanyJobPostingsUseCase, updateJobPostingUseCase, deleteJobPostingUseCase, incrementJobViewCountUseCase, updateJobStatusUseCase, getCompanyJobPostingUseCase, getCompanyProfileByUserIdUseCase, closeJobManuallyUseCase);

const companyJobApplicationController = new CompanyJobApplicationController(
  getApplicationsByJobUseCase,
  getApplicationsByCompanyUseCase,
  getApplicationDetailsUseCase,
  updateApplicationStageUseCase,
  updateApplicationScoreUseCase,
  bulkUpdateApplicationsUseCase,
  markCandidateHiredUseCase,
);

const getAllSubscriptionPlansUseCase = new GetAllSubscriptionPlansUseCase(subscriptionPlanRepository);
const companySubscriptionPlanController = new CompanySubscriptionPlanController(getAllSubscriptionPlansUseCase);

const companySubscriptionController = new CompanySubscriptionController(
  getActiveSubscriptionUseCase,
  getPaymentHistoryUseCase,
  createCheckoutSessionUseCase,
  cancelSubscriptionUseCase,
  resumeSubscriptionUseCase,
  changeSubscriptionPlanUseCase,
  getBillingPortalUseCase,
);

const companyCandidatesController = new CompanyCandidatesController(getCandidatesUseCase, getCandidateDetailsUseCase);

const stripeWebhookController = new StripeWebhookController(handleStripeWebhookUseCase);

export {
  companyProfileController,
  companyContactController,
  companyTechStackController,
  companyOfficeLocationController,
  companyBenefitController,
  companyWorkplacePictureController,
  companyUploadController,
  companyJobPostingController,
  companyJobApplicationController,
  companySubscriptionPlanController,
  companySubscriptionController,
  stripeWebhookController,
  companyCandidatesController,
  companyProfileRepository,
  subscriptionMiddleware,
  stripeService,
  getCompanyIdByUserIdUseCase,
};