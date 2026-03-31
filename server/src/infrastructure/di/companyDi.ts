import { CompanyProfileRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-profile.repository';
import { CompanyContactRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-contact.repository';
import { CompanyVerificationRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-verification.repository';
import { CompanyTechStackRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-tech-stack.repository';
import { CompanyOfficeLocationRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-office-location.repository';
import { CompanyBenefitsRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-benefits.repository';
import { CompanyWorkplacePicturesRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-workplace-pictures.repository';
import { JobPostingRepository } from 'src/infrastructure/persistence/mongodb/repositories/job-posting.repository';
import { JobApplicationRepository } from 'src/infrastructure/persistence/mongodb/repositories/job-application.repository';
import { ATSInterviewRepository } from 'src/infrastructure/persistence/mongodb/repositories/ats-interview.repository';
import { ChatMessageRepository } from 'src/infrastructure/persistence/mongodb/repositories/chat-message.repository';
import { UserRepository } from 'src/infrastructure/persistence/mongodb/repositories/user.repository';
import { SeekerProfileRepository } from 'src/infrastructure/persistence/mongodb/repositories/seeker-profile.repository';
import { SeekerExperienceRepository } from 'src/infrastructure/persistence/mongodb/repositories/seeker-experience.repository';
import { SeekerEducationRepository } from 'src/infrastructure/persistence/mongodb/repositories/seeker-education.repository';
import { notificationRepository } from 'src/infrastructure/di/notificationDi';
import { S3Service } from 'src/infrastructure/external-services/s3/s3.service';
import { StripeService } from 'src/infrastructure/external-services/stripe/stripe.service';
import { logger } from 'src/infrastructure/config/logger';
import { LoggerService } from 'src/infrastructure/services/logger.service';
import { CreateCompanyProfileUseCase } from 'src/application/use-cases/company/profile/info/create-company-profile.use-case';
import { CreateCompanyProfileFromDtoUseCase } from 'src/application/use-cases/company/profile/info/create-company-profile-from-dto.use-case';
import { UpdateCompanyProfileUseCase } from 'src/application/use-cases/company/profile/info/update-company-profile.use-case';
import { GetCompanyProfileUseCase } from 'src/application/use-cases/company/profile/info/get-company-profile.use-case';
import { GetCompanyProfileWithJobPostingsUseCase } from 'src/application/use-cases/admin/companies/get-company-profile-with-job-postings.use-case';
import { ReapplyCompanyVerificationUseCase } from 'src/application/use-cases/company/profile/verification/reapply-company-verification.use-case';
import { GetCompanyContactUseCase } from 'src/application/use-cases/company/profile/contacts/get-company-contact.use-case';
import { UpsertCompanyContactUseCase } from 'src/application/use-cases/company/profile/contacts/upsert-company-contact.use-case';
import { CreateCompanyTechStackUseCase } from 'src/application/use-cases/company/profile/stack/create-company-tech-stack.use-case';
import { UpdateCompanyTechStackUseCase } from 'src/application/use-cases/company/profile/stack/update-company-tech-stack.use-case';
import { DeleteCompanyTechStackUseCase } from 'src/application/use-cases/company/profile/stack/delete-company-tech-stack.use-case';
import { GetCompanyTechStackUseCase } from 'src/application/use-cases/company/profile/stack/get-company-tech-stack.use-case';
import { CreateCompanyOfficeLocationUseCase } from 'src/application/use-cases/company/profile/location/create-company-office-location.use-case';
import { UpdateCompanyOfficeLocationUseCase } from 'src/application/use-cases/company/profile/location/update-company-office-location.use-case';
import { DeleteCompanyOfficeLocationUseCase } from 'src/application/use-cases/company/profile/location/delete-company-office-location.use-case';
import { GetCompanyOfficeLocationUseCase } from 'src/application/use-cases/company/profile/location/get-company-office-location.use-case';
import { CreateCompanyBenefitUseCase } from 'src/application/use-cases/company/profile/benefits/create-company-benefit.use-case';
import { UpdateCompanyBenefitUseCase } from 'src/application/use-cases/company/profile/benefits/update-company-benefit.use-case';
import { DeleteCompanyBenefitUseCase } from 'src/application/use-cases/company/profile/benefits/delete-company-benefit.use-case';
import { GetCompanyBenefitUseCase } from 'src/application/use-cases/company/profile/benefits/get-company-benefit.use-case';
import { CreateCompanyWorkplacePictureUseCase } from 'src/application/use-cases/company/media/create-company-workplace-picture.use-case';
import { UpdateCompanyWorkplacePictureUseCase } from 'src/application/use-cases/company/media/update-company-workplace-picture.use-case';
import { DeleteCompanyWorkplacePictureUseCase } from 'src/application/use-cases/company/media/delete-company-workplace-picture.use-case';
import { GetCompanyWorkplacePictureUseCase } from 'src/application/use-cases/company/media/get-company-workplace-picture.use-case';
import { CreateJobPostingUseCase } from 'src/application/use-cases/job/create-job-posting.use-case';
import { GetCompanyJobPostingUseCase } from 'src/application/use-cases/job/get-company-job-posting.use-case';
import { GetCompanyProfileByUserIdUseCase } from 'src/application/use-cases/company/profile/info/get-company-profile-by-user-id.use-case';
import { GetCompanyJobPostingsUseCase } from 'src/application/use-cases/job/get-company-job-postings.use-case';
import { UpdateJobPostingUseCase } from 'src/application/use-cases/job/update-job-posting.use-case';
import { DeleteJobPostingUseCase } from 'src/application/use-cases/job/delete-job-posting.use-case';
import { AdminUpdateJobStatusUseCase } from 'src/application/use-cases/admin/job/update-job-status.use-case';
import { UpdateJobStatusUseCase } from 'src/application/use-cases/job/update-job-status.use-case';
import { CompanyProfileController } from 'src/presentation/controllers/company/profile/company-profile.controller';
import { CompanyContactController } from 'src/presentation/controllers/company/profile/company-contact.controller';
import { CompanyTechStackController } from 'src/presentation/controllers/company/profile/company-tech-stack.controller';
import { CompanyOfficeLocationController } from 'src/presentation/controllers/company/profile/company-office-location.controller';
import { CompanyBenefitController } from 'src/presentation/controllers/company/profile/company-benefit.controller';
import { CompanyWorkplacePictureController } from 'src/presentation/controllers/company/media/company-workplace-picture.controller';
import { CompanyUploadController } from 'src/presentation/controllers/company/media/company-upload.controller';
import { CompanyJobPostingController } from 'src/presentation/controllers/company/jobs/company-job-posting.controller';
import { CompanyJobApplicationController } from 'src/presentation/controllers/company/hiring/job-application.controller';
import { GetApplicationsByJobUseCase } from 'src/application/use-cases/company/hiring/get-applications-by-job.use-case';
import { GetApplicationsByCompanyUseCase } from 'src/application/use-cases/company/hiring/get-applications-by-company.use-case';
import { GetApplicationDetailsUseCase } from 'src/application/use-cases/company/hiring/get-application-details.use-case';
import { UpdateApplicationStageUseCase } from 'src/application/use-cases/company/hiring/update-application-stage.use-case';
import { UpdateApplicationScoreUseCase } from 'src/application/use-cases/company/hiring/update-application-score.use-case';
import { BulkUpdateApplicationsUseCase } from 'src/application/use-cases/company/hiring/bulk-update-applications.use-case';
import { GetCompanyIdByUserIdUseCase } from 'src/application/use-cases/admin/companies/get-company-id-by-user-id.use-case';
import { UploadLogoUseCase } from 'src/application/use-cases/company/media/upload-logo.use-case';
import { UploadBusinessLicenseUseCase } from 'src/application/use-cases/company/media/upload-business-license.use-case';
import { UploadWorkplacePictureUseCase } from 'src/application/use-cases/company/media/upload-workplace-picture.use-case';
import { DeleteImageUseCase } from 'src/application/use-cases/company/media/delete-image.use-case';
import { CompanySubscriptionPlanController } from 'src/presentation/controllers/company/subscription/company-subscription-plan.controller';
import { CompanySubscriptionController } from 'src/presentation/controllers/company/subscription/company-subscription.controller';
import { StripeWebhookController } from 'src/presentation/controllers/payment/stripe-webhook.controller';
import { SubscriptionPlanRepository } from 'src/infrastructure/persistence/mongodb/repositories/subscription-plan.repository';
import { GetAllSubscriptionPlansUseCase } from 'src/application/use-cases/admin/subscription/get-all-subscription-plans.use-case';
import { CompanySubscriptionRepository } from 'src/infrastructure/persistence/mongodb/repositories/company-subscription.repository';
import { PaymentOrderRepository } from 'src/infrastructure/persistence/mongodb/repositories/payment-order.repository';
import { GetActiveSubscriptionUseCase } from 'src/application/use-cases/subscription/get-active-subscription.use-case';
import { GetPaymentHistoryUseCase } from 'src/application/use-cases/payment/history/get-payment-history.use-case';
import { CreateCheckoutSessionUseCase } from 'src/application/use-cases/subscription/create-checkout-session.use-case';
import { HandleStripeWebhookUseCase } from 'src/application/use-cases/payment/stripe/handle-stripe-webhook.use-case';
import { CancelSubscriptionUseCase } from 'src/application/use-cases/subscription/cancel-subscription.use-case';
import { ResumeSubscriptionUseCase } from 'src/application/use-cases/subscription/resume-subscription.use-case';
import { ChangeSubscriptionPlanUseCase } from 'src/application/use-cases/subscription/change-subscription-plan.use-case';
import { PreviewPlanChangeUseCase } from 'src/application/use-cases/subscription/preview-plan-change.use-case';
import { RevertToDefaultPlanUseCase } from 'src/application/use-cases/subscription/revert-to-default-plan.use-case';
import { GetBillingPortalUseCase } from 'src/application/use-cases/subscription/get-billing-portal.use-case';
import { SubscriptionMiddleware } from 'src/presentation/middleware/subscription.middleware';
import { GetCandidatesUseCase } from 'src/application/use-cases/company/hiring/get-candidates.use-case';
import { GetCandidateDetailsUseCase } from 'src/application/use-cases/company/hiring/get-candidate-details.use-case';
import { CompanyCandidatesController } from 'src/presentation/controllers/company/hiring/company-candidates.controller';
import { MarkCandidateHiredUseCase } from 'src/application/use-cases/company/hiring/mark-candidate-hired.use-case';
import { CloseJobManuallyUseCase } from 'src/application/use-cases/job/close-job-manually.use-case';
import { ReopenJobUseCase } from 'src/application/use-cases/job/reopen-job.use-case';
import { NodemailerService } from 'src/infrastructure/messaging/mailer';
import { GetCompanyDashboardStatsUseCase } from 'src/application/use-cases/company/dashboard/get-company-dashboard-stats.use-case';
import { CompanyDashboardController } from 'src/presentation/controllers/company/dashboard/company-dashboard.controller';
import { ToggleFeaturedJobUseCase } from 'src/application/use-cases/job/toggle-featured-job.use-case';

const companyProfileRepository = new CompanyProfileRepository();
const companyContactRepository = new CompanyContactRepository();
const companyVerificationRepository = new CompanyVerificationRepository();
const companyTechStackRepository = new CompanyTechStackRepository();
const companyOfficeLocationRepository = new CompanyOfficeLocationRepository();
const companyBenefitsRepository = new CompanyBenefitsRepository();
const companyWorkplacePicturesRepository = new CompanyWorkplacePicturesRepository();
const jobPostingRepository = new JobPostingRepository();
const jobApplicationRepository = new JobApplicationRepository();
const atsInterviewRepository = new ATSInterviewRepository();
const chatMessageRepository = new ChatMessageRepository();
const userRepository = new UserRepository();
const seekerProfileRepository = new SeekerProfileRepository();
const seekerExperienceRepository = new SeekerExperienceRepository();
const seekerEducationRepository = new SeekerEducationRepository();
const subscriptionPlanRepository = new SubscriptionPlanRepository();
const companySubscriptionRepository = new CompanySubscriptionRepository();
const paymentOrderRepository = new PaymentOrderRepository();

const s3Service = new S3Service();

const stripeService = new StripeService();
const loggerService = new LoggerService();



const createCompanyProfileUseCase = new CreateCompanyProfileUseCase(companyProfileRepository, companyContactRepository, companyOfficeLocationRepository, companyVerificationRepository, subscriptionPlanRepository, companySubscriptionRepository);

const updateCompanyProfileUseCase = new UpdateCompanyProfileUseCase(companyProfileRepository, companyVerificationRepository, s3Service);

const getCompanyProfileUseCase = new GetCompanyProfileUseCase(companyProfileRepository, companyContactRepository, companyTechStackRepository, companyOfficeLocationRepository, companyBenefitsRepository, companyWorkplacePicturesRepository, companyVerificationRepository);
const getCompanyIdByUserIdUseCase = new GetCompanyIdByUserIdUseCase(getCompanyProfileUseCase);

const reapplyCompanyVerificationUseCase = new ReapplyCompanyVerificationUseCase(companyProfileRepository, companyVerificationRepository, companyOfficeLocationRepository);
const getCompanyContactUseCase = new GetCompanyContactUseCase(companyContactRepository, getCompanyIdByUserIdUseCase);
const upsertCompanyContactUseCase = new UpsertCompanyContactUseCase(companyContactRepository, getCompanyIdByUserIdUseCase);

const getCompanyProfileByUserIdUseCase = new GetCompanyProfileByUserIdUseCase(companyProfileRepository);

const createJobPostingUseCase = new CreateJobPostingUseCase(jobPostingRepository, getCompanyProfileByUserIdUseCase, companySubscriptionRepository, subscriptionPlanRepository);

const getCompanyJobPostingUseCase = new GetCompanyJobPostingUseCase(jobPostingRepository, getCompanyProfileByUserIdUseCase);


const createCompanyTechStackUseCase = new CreateCompanyTechStackUseCase(companyTechStackRepository, getCompanyIdByUserIdUseCase);
const updateCompanyTechStackUseCase = new UpdateCompanyTechStackUseCase(companyTechStackRepository, getCompanyIdByUserIdUseCase);
const deleteCompanyTechStackUseCase = new DeleteCompanyTechStackUseCase(companyTechStackRepository, getCompanyIdByUserIdUseCase);
const getCompanyTechStackUseCase = new GetCompanyTechStackUseCase(companyTechStackRepository, getCompanyIdByUserIdUseCase);

const createCompanyOfficeLocationUseCase = new CreateCompanyOfficeLocationUseCase(companyOfficeLocationRepository, getCompanyIdByUserIdUseCase);
const updateCompanyOfficeLocationUseCase = new UpdateCompanyOfficeLocationUseCase(companyOfficeLocationRepository, getCompanyIdByUserIdUseCase);
const deleteCompanyOfficeLocationUseCase = new DeleteCompanyOfficeLocationUseCase(companyOfficeLocationRepository, getCompanyIdByUserIdUseCase);
const getCompanyOfficeLocationUseCase = new GetCompanyOfficeLocationUseCase(companyOfficeLocationRepository, getCompanyIdByUserIdUseCase);

const createCompanyBenefitUseCase = new CreateCompanyBenefitUseCase(companyBenefitsRepository, getCompanyIdByUserIdUseCase);
const updateCompanyBenefitUseCase = new UpdateCompanyBenefitUseCase(companyBenefitsRepository, getCompanyIdByUserIdUseCase);
const deleteCompanyBenefitUseCase = new DeleteCompanyBenefitUseCase(companyBenefitsRepository, getCompanyIdByUserIdUseCase);
const getCompanyBenefitUseCase = new GetCompanyBenefitUseCase(companyBenefitsRepository, getCompanyIdByUserIdUseCase);

const createCompanyWorkplacePictureUseCase = new CreateCompanyWorkplacePictureUseCase(companyWorkplacePicturesRepository, getCompanyIdByUserIdUseCase);
const updateCompanyWorkplacePictureUseCase = new UpdateCompanyWorkplacePictureUseCase(companyWorkplacePicturesRepository, getCompanyIdByUserIdUseCase);
const deleteCompanyWorkplacePictureUseCase = new DeleteCompanyWorkplacePictureUseCase(companyWorkplacePicturesRepository, getCompanyIdByUserIdUseCase);
const getCompanyWorkplacePictureUseCase = new GetCompanyWorkplacePictureUseCase(companyWorkplacePicturesRepository, getCompanyIdByUserIdUseCase);

const uploadLogoUseCase = new UploadLogoUseCase(s3Service, companyProfileRepository);
const uploadBusinessLicenseUseCase = new UploadBusinessLicenseUseCase(s3Service);
const uploadWorkplacePictureUseCase = new UploadWorkplacePictureUseCase(s3Service);
const deleteImageUseCase = new DeleteImageUseCase(s3Service);

const getCompanyJobPostingsUseCase = new GetCompanyJobPostingsUseCase(jobPostingRepository, companyProfileRepository);

const createCompanyProfileFromDtoUseCase = new CreateCompanyProfileFromDtoUseCase(createCompanyProfileUseCase);

const getCompanyProfileWithJobPostingsUseCase = new GetCompanyProfileWithJobPostingsUseCase(getCompanyProfileUseCase, getCompanyJobPostingsUseCase, s3Service);


const updateJobPostingUseCase = new UpdateJobPostingUseCase(jobPostingRepository, getCompanyProfileByUserIdUseCase);

const deleteJobPostingUseCase = new DeleteJobPostingUseCase(jobPostingRepository, companyProfileRepository);

const updateJobStatusUseCase = new UpdateJobStatusUseCase(jobPostingRepository, companySubscriptionRepository, companyProfileRepository, subscriptionPlanRepository);

const getApplicationsByJobUseCase = new GetApplicationsByJobUseCase(jobApplicationRepository, jobPostingRepository, companyProfileRepository, userRepository, seekerProfileRepository, s3Service);
const getApplicationsByCompanyUseCase = new GetApplicationsByCompanyUseCase(jobApplicationRepository, companyProfileRepository, userRepository, seekerProfileRepository, jobPostingRepository, s3Service);
const getApplicationDetailsUseCase = new GetApplicationDetailsUseCase(jobApplicationRepository, jobPostingRepository, companyProfileRepository, userRepository, seekerProfileRepository, seekerExperienceRepository, seekerEducationRepository, s3Service);
import { notificationService } from 'src/infrastructure/di/notificationDi';




const updateApplicationStageUseCase = new UpdateApplicationStageUseCase(jobApplicationRepository, jobPostingRepository, companyProfileRepository, notificationService);
const updateApplicationScoreUseCase = new UpdateApplicationScoreUseCase(jobApplicationRepository, jobPostingRepository, companyProfileRepository);
const bulkUpdateApplicationsUseCase = new BulkUpdateApplicationsUseCase(jobApplicationRepository, companyProfileRepository);

const getActiveSubscriptionUseCase = new GetActiveSubscriptionUseCase(companySubscriptionRepository, companyProfileRepository, jobPostingRepository, subscriptionPlanRepository);
const getPaymentHistoryUseCase = new GetPaymentHistoryUseCase(paymentOrderRepository, companyProfileRepository);


const createCheckoutSessionUseCase = new CreateCheckoutSessionUseCase(stripeService, subscriptionPlanRepository, companyProfileRepository, companySubscriptionRepository, userRepository);

const revertToDefaultPlanUseCase = new RevertToDefaultPlanUseCase(companySubscriptionRepository, subscriptionPlanRepository, jobPostingRepository, companyProfileRepository, notificationRepository, logger);

const handleStripeWebhookUseCase = new HandleStripeWebhookUseCase(stripeService, subscriptionPlanRepository, companySubscriptionRepository, paymentOrderRepository, notificationRepository, companyProfileRepository, jobPostingRepository, logger, revertToDefaultPlanUseCase);

const cancelSubscriptionUseCase = new CancelSubscriptionUseCase(stripeService, companyProfileRepository, companySubscriptionRepository);

const resumeSubscriptionUseCase = new ResumeSubscriptionUseCase(stripeService, companyProfileRepository, companySubscriptionRepository);

const changeSubscriptionPlanUseCase = new ChangeSubscriptionPlanUseCase(stripeService, subscriptionPlanRepository, companyProfileRepository, companySubscriptionRepository, jobPostingRepository, logger);

const previewPlanChangeUseCase = new PreviewPlanChangeUseCase(subscriptionPlanRepository, companyProfileRepository, companySubscriptionRepository, jobPostingRepository);

const getBillingPortalUseCase = new GetBillingPortalUseCase(stripeService, companyProfileRepository, companySubscriptionRepository);

const subscriptionMiddleware = new SubscriptionMiddleware(companySubscriptionRepository, companyProfileRepository, subscriptionPlanRepository);

const getCandidatesUseCase = new GetCandidatesUseCase(seekerProfileRepository, s3Service);
const getCandidateDetailsUseCase = new GetCandidateDetailsUseCase(seekerProfileRepository, seekerExperienceRepository, seekerEducationRepository, userRepository, s3Service, loggerService);

const mailerService = new NodemailerService();
import { EmailTemplateService } from 'src/infrastructure/messaging/email-template.service';
const emailTemplateService = new EmailTemplateService();

const markCandidateHiredUseCase = new MarkCandidateHiredUseCase(
  jobApplicationRepository,
  jobPostingRepository,
  companyProfileRepository,
  userRepository,
  mailerService,
  loggerService,
);

const closeJobManuallyUseCase = new CloseJobManuallyUseCase(
  jobPostingRepository,
  jobApplicationRepository,
  companyProfileRepository,
  userRepository,
  mailerService,
  emailTemplateService,
  loggerService,
);

const reopenJobUseCase = new ReopenJobUseCase(
  jobPostingRepository,
  companyProfileRepository,
);

const toggleFeaturedJobUseCase = new ToggleFeaturedJobUseCase(
  jobPostingRepository,
  companyProfileRepository,
  companySubscriptionRepository,
);

const getCompanyDashboardStatsUseCase = new GetCompanyDashboardStatsUseCase(
  jobPostingRepository,
  jobApplicationRepository,
  atsInterviewRepository,
  chatMessageRepository,
  getCompanyIdByUserIdUseCase,
  s3Service,
);

const companyProfileController = new CompanyProfileController(
  createCompanyProfileFromDtoUseCase,
  updateCompanyProfileUseCase,
  getCompanyProfileWithJobPostingsUseCase,
  reapplyCompanyVerificationUseCase,
  uploadLogoUseCase,
);

const companyContactController = new CompanyContactController(
  getCompanyContactUseCase,
  upsertCompanyContactUseCase,
);

const companyTechStackController = new CompanyTechStackController(
  createCompanyTechStackUseCase,
  updateCompanyTechStackUseCase,
  deleteCompanyTechStackUseCase,
  getCompanyTechStackUseCase,
);

const companyOfficeLocationController = new CompanyOfficeLocationController(
  createCompanyOfficeLocationUseCase,
  updateCompanyOfficeLocationUseCase,
  deleteCompanyOfficeLocationUseCase,
  getCompanyOfficeLocationUseCase,
);

const companyBenefitController = new CompanyBenefitController(
  createCompanyBenefitUseCase,
  updateCompanyBenefitUseCase,
  deleteCompanyBenefitUseCase,
  getCompanyBenefitUseCase,
);

const companyWorkplacePictureController = new CompanyWorkplacePictureController(
  createCompanyWorkplacePictureUseCase,
  updateCompanyWorkplacePictureUseCase,
  deleteCompanyWorkplacePictureUseCase,
  getCompanyWorkplacePictureUseCase,
);

const companyUploadController = new CompanyUploadController(
  uploadBusinessLicenseUseCase,
  uploadWorkplacePictureUseCase,
  deleteImageUseCase,
);

const companyJobPostingController = new CompanyJobPostingController(createJobPostingUseCase, getCompanyJobPostingsUseCase, updateJobPostingUseCase, deleteJobPostingUseCase, updateJobStatusUseCase, getCompanyJobPostingUseCase, closeJobManuallyUseCase, reopenJobUseCase, toggleFeaturedJobUseCase);

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
  previewPlanChangeUseCase,
);

const companyCandidatesController = new CompanyCandidatesController(getCandidatesUseCase, getCandidateDetailsUseCase);

const companyDashboardController = new CompanyDashboardController(getCompanyDashboardStatsUseCase);


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
  companyDashboardController,
  companyProfileRepository,
  subscriptionMiddleware,
  stripeService,
  getCompanyIdByUserIdUseCase,
};

