import { Router } from 'express';
import { APP_ROUTES } from 'src/shared/constants/routes';
import { container } from 'src/infrastructure/di/container';
import { TYPES } from 'src/shared/constants/types';
import { ATSPipelineController } from 'src/presentation/controllers/ats/pipeline/ats-pipeline.controller';
import { GetUserByIdUseCase } from 'src/application/use-cases/admin/user/get-user-by-id.use-case';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { CompanyProfileController } from 'src/presentation/controllers/company/profile/company-profile.controller';
import { CompanyContactController } from 'src/presentation/controllers/company/profile/company-contact.controller';
import { CompanyTechStackController } from 'src/presentation/controllers/company/profile/company-tech-stack.controller';
import { CompanyOfficeLocationController } from 'src/presentation/controllers/company/profile/company-office-location.controller';
import { CompanyBenefitController } from 'src/presentation/controllers/company/profile/company-benefit.controller';
import { CompanyWorkplacePictureController } from 'src/presentation/controllers/company/media/company-workplace-picture.controller';
import { CompanyUploadController } from 'src/presentation/controllers/company/media/company-upload.controller';
import { CompanyJobPostingController } from 'src/presentation/controllers/company/jobs/company-job-posting.controller';
import { CompanyJobApplicationController } from 'src/presentation/controllers/company/hiring/job-application.controller';
import { CompanySubscriptionPlanController } from 'src/presentation/controllers/company/subscription/company-subscription-plan.controller';
import { CompanySubscriptionController } from 'src/presentation/controllers/company/subscription/company-subscription.controller';
import { CompanyCandidatesController } from 'src/presentation/controllers/company/hiring/company-candidates.controller';
import { CompanyDashboardController } from 'src/presentation/controllers/company/dashboard/company-dashboard.controller';
import { SubscriptionMiddleware } from 'src/presentation/middleware/subscription.middleware';

import { ATSRouter } from './ats.routes';

import { authenticateToken, authorizeRoles } from 'src/presentation/middleware/auth.middleware';
import { uploadSingle } from 'src/presentation/middleware/upload.middleware';
import { UserBlockedMiddleware } from 'src/presentation/middleware/user-blocked.middleware';
import { CompanyVerificationMiddleware } from 'src/presentation/middleware/company-verification.middleware';

const getUserByIdUseCase = container.get<GetUserByIdUseCase>(TYPES.GetUserByIdUseCase);
const atsPipelineController = container.get<ATSPipelineController>(TYPES.ATSPipelineController);
const companyProfileRepository = container.get<ICompanyProfileRepository>(TYPES.CompanyProfileRepository);
const companyProfileController = container.get<CompanyProfileController>(TYPES.CompanyProfileController);
const companyContactController = container.get<CompanyContactController>(TYPES.CompanyContactController);
const companyTechStackController = container.get<CompanyTechStackController>(TYPES.CompanyTechStackController);
const companyOfficeLocationController = container.get<CompanyOfficeLocationController>(TYPES.CompanyOfficeLocationController);
const companyBenefitController = container.get<CompanyBenefitController>(TYPES.CompanyBenefitController);
const companyWorkplacePictureController = container.get<CompanyWorkplacePictureController>(TYPES.CompanyWorkplacePictureController);
const companyUploadController = container.get<CompanyUploadController>(TYPES.CompanyUploadController);
const companyJobPostingController = container.get<CompanyJobPostingController>(TYPES.CompanyJobPostingController);
const companyJobApplicationController = container.get<CompanyJobApplicationController>(TYPES.CompanyJobApplicationController);
const companySubscriptionPlanController = container.get<CompanySubscriptionPlanController>(TYPES.CompanySubscriptionPlanController);
const companySubscriptionController = container.get<CompanySubscriptionController>(TYPES.CompanySubscriptionController);
const companyCandidatesController = container.get<CompanyCandidatesController>(TYPES.CompanyCandidatesController);
const companyDashboardController = container.get<CompanyDashboardController>(TYPES.CompanyDashboardController);
const subscriptionMiddleware = container.get<SubscriptionMiddleware>(TYPES.SubscriptionMiddleware);

export class CompanyRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoute();
  }

  private _initializeRoute(): void {
    const userBlockedMiddleware = new UserBlockedMiddleware(getUserByIdUseCase);
    const companyVerificationMiddleware = new CompanyVerificationMiddleware(companyProfileRepository);

    this.router.use(authenticateToken);
    this.router.use(authorizeRoles('company'));
    this.router.use(userBlockedMiddleware.checkUserBlocked);


    this.router.post(APP_ROUTES.COMPANY.PROFILE, companyProfileController.createCompanyProfile);
    this.router.put(APP_ROUTES.COMPANY.PROFILE, companyProfileController.updateCompanyProfile);
    this.router.get(APP_ROUTES.COMPANY.PROFILE, companyProfileController.getCompanyProfile);
    this.router.get(APP_ROUTES.COMPANY.PROFILE_BY_ID, companyProfileController.getCompanyProfileById);
    this.router.post(APP_ROUTES.COMPANY.REAPPLY_VERIFICATION, companyProfileController.reapplyVerification);

    this.router.post(APP_ROUTES.COMPANY.UPLOAD_LOGO, uploadSingle('logo'), companyProfileController.uploadLogo);
    this.router.post(APP_ROUTES.COMPANY.UPLOAD_LICENSE, uploadSingle('business_license'), companyUploadController.uploadBusinessLicense);
    this.router.delete(APP_ROUTES.COMPANY.DELETE_UPLOAD, companyUploadController.deleteImage);

    this.router.get(APP_ROUTES.COMPANY.SUBSCRIPTION_PLANS, companySubscriptionPlanController.getActiveSubscriptionPlans);

    this.router.use(companyVerificationMiddleware.checkCompanyVerified);
    this.router.get(APP_ROUTES.COMPANY.DASHBOARD, companyDashboardController.getCompanyDashboardStats);

    this.router.get(APP_ROUTES.COMPANY.CONTACT, companyContactController.getCompanyContact);
    this.router.put(APP_ROUTES.COMPANY.CONTACT, companyContactController.updateCompanyContact);

    this.router.get(APP_ROUTES.COMPANY.TECH_STACKS, companyTechStackController.getCompanyTechStacks);
    this.router.post(APP_ROUTES.COMPANY.TECH_STACKS, companyTechStackController.createCompanyTechStack);
    this.router.put(APP_ROUTES.COMPANY.TECH_STACK_BY_ID, companyTechStackController.updateCompanyTechStack);
    this.router.delete(APP_ROUTES.COMPANY.TECH_STACK_BY_ID, companyTechStackController.deleteCompanyTechStack);

    this.router.get(APP_ROUTES.COMPANY.OFFICE_LOCATIONS, companyOfficeLocationController.getCompanyOfficeLocations);
    this.router.post(APP_ROUTES.COMPANY.OFFICE_LOCATIONS, companyOfficeLocationController.createCompanyOfficeLocation);
    this.router.put(APP_ROUTES.COMPANY.OFFICE_LOCATION_BY_ID, companyOfficeLocationController.updateCompanyOfficeLocation);
    this.router.delete(APP_ROUTES.COMPANY.OFFICE_LOCATION_BY_ID, companyOfficeLocationController.deleteCompanyOfficeLocation);

    this.router.get(APP_ROUTES.COMPANY.BENEFITS, companyBenefitController.getCompanyBenefits);
    this.router.post(APP_ROUTES.COMPANY.BENEFITS, companyBenefitController.createCompanyBenefit);
    this.router.put(APP_ROUTES.COMPANY.BENEFIT_BY_ID, companyBenefitController.updateCompanyBenefit);
    this.router.delete(APP_ROUTES.COMPANY.BENEFIT_BY_ID, companyBenefitController.deleteCompanyBenefit);

    this.router.get(APP_ROUTES.COMPANY.WORKPLACE_PICTURES, companyWorkplacePictureController.getCompanyWorkplacePictures);
    this.router.post(APP_ROUTES.COMPANY.WORKPLACE_PICTURES, companyWorkplacePictureController.createCompanyWorkplacePicture);
    this.router.put(APP_ROUTES.COMPANY.WORKPLACE_PICTURE_BY_ID, companyWorkplacePictureController.updateCompanyWorkplacePicture);
    this.router.delete(APP_ROUTES.COMPANY.WORKPLACE_PICTURE_BY_ID, companyWorkplacePictureController.deleteCompanyWorkplacePicture);
    this.router.post(APP_ROUTES.COMPANY.WORKPLACE_PICTURES_UPLOAD, uploadSingle('image'), companyUploadController.uploadWorkplacePicture);

    this.router.get(APP_ROUTES.COMPANY.SUBSCRIPTIONS_ACTIVE, companySubscriptionController.getActiveSubscription);
    this.router.get(APP_ROUTES.COMPANY.SUBSCRIPTIONS_PAYMENT_HISTORY, companySubscriptionController.getPaymentHistory);
    this.router.post(APP_ROUTES.COMPANY.SUBSCRIPTIONS_CREATE_CHECKOUT, companySubscriptionController.createCheckoutSession);
    this.router.post(APP_ROUTES.COMPANY.SUBSCRIPTIONS_CANCEL, companySubscriptionController.cancelSubscription);
    this.router.post(APP_ROUTES.COMPANY.SUBSCRIPTIONS_RESUME, companySubscriptionController.resumeSubscription);
    this.router.post(APP_ROUTES.COMPANY.SUBSCRIPTIONS_CHANGE_PLAN, companySubscriptionController.changeSubscriptionPlan);
    this.router.post(APP_ROUTES.COMPANY.SUBSCRIPTIONS_PREVIEW_CHANGE, companySubscriptionController.previewPlanChange);
    this.router.post(APP_ROUTES.COMPANY.SUBSCRIPTIONS_BILLING_PORTAL, companySubscriptionController.getBillingPortal);

    this.router.post(APP_ROUTES.COMPANY.JOBS, companyJobPostingController.createJobPosting);
    this.router.get(APP_ROUTES.COMPANY.JOBS, companyJobPostingController.getCompanyJobPostings);
    this.router.get(APP_ROUTES.COMPANY.JOB_BY_ID, companyJobPostingController.getJobPosting);
    this.router.put(APP_ROUTES.COMPANY.JOB_BY_ID, companyJobPostingController.updateJobPosting);
    this.router.delete(APP_ROUTES.COMPANY.JOB_BY_ID, companyJobPostingController.deleteJobPosting);
    this.router.patch(APP_ROUTES.COMPANY.JOB_STATUS, companyJobPostingController.updateJobStatus);
    this.router.post(APP_ROUTES.COMPANY.JOB_CLOSE, companyJobPostingController.closeJob);
    this.router.post(APP_ROUTES.COMPANY.JOB_REOPEN, companyJobPostingController.reopenJob);
    this.router.patch(APP_ROUTES.COMPANY.JOB_FEATURED, companyJobPostingController.toggleFeatured);

    this.router.get(APP_ROUTES.COMPANY.APPLICATIONS, companyJobApplicationController.getCompanyApplications);
    this.router.get(APP_ROUTES.COMPANY.JOB_APPLICATIONS, companyJobApplicationController.getJobApplications);
    this.router.post(APP_ROUTES.COMPANY.APPLICATIONS_BULK_UPDATE, companyJobApplicationController.bulkUpdate);
    this.router.post(APP_ROUTES.COMPANY.APPLICATIONS_MARK_HIRED, companyJobApplicationController.markAsHired);

    this.router.use(APP_ROUTES.COMPANY.APPLICATIONS, new ATSRouter().router);

    this.router.post(APP_ROUTES.COMPANY.APPLICATIONS_MOVE_STAGE, atsPipelineController.moveApplicationStage);
    this.router.post(APP_ROUTES.COMPANY.APPLICATIONS_UPDATE_SUB_STAGE, atsPipelineController.updateApplicationSubStage);

    this.router.get(APP_ROUTES.COMPANY.APPLICATIONS_DETAIL, companyJobApplicationController.getApplicationDetails);
    this.router.patch(APP_ROUTES.COMPANY.APPLICATIONS_STAGE, companyJobApplicationController.updateStage);
    this.router.patch(APP_ROUTES.COMPANY.APPLICATIONS_SCORE, companyJobApplicationController.updateScore);

    this.router.get(APP_ROUTES.COMPANY.JOB_PIPELINE, atsPipelineController.getJobPipeline);
    this.router.get(APP_ROUTES.COMPANY.JOB_APPLICATIONS_KANBAN, atsPipelineController.getJobApplicationsForKanban);

    this.router.get(APP_ROUTES.COMPANY.CANDIDATES, companyCandidatesController.getCandidates);
    this.router.get(APP_ROUTES.COMPANY.CANDIDATE_DETAIL, subscriptionMiddleware.checkCanViewCandidate, companyCandidatesController.getCandidateDetails);
  }
}
