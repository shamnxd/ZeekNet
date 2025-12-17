import { Router } from 'express';
import {
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
  subscriptionMiddleware,

} from '../../infrastructure/di/companyDi';
import { CompanyRoutes } from '../../domain/enums/routes.enum';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { uploadSingle } from '../middleware/upload.middleware';
import { validateBody, validateQuery } from '../middleware/validation.middleware';
import { UserBlockedMiddleware } from '../middleware/user-blocked.middleware';
import { CompanyVerificationMiddleware } from '../middleware/company-verification.middleware';
import { CreateJobPostingRequestDtoSchema } from '../../application/dto/job-posting/create-job-posting-request.dto';
import { UpdateJobPostingDto } from '../../application/dto/job-posting/update-job-posting-request.dto';
import { JobPostingQueryDto } from '../../application/dto/job-posting/get-job-postings-query.dto';
import { SimpleCompanyProfileDto } from '../../application/dto/company/create-company.dto';
import { ApplicationFiltersDto } from '../../application/dto/application/application-filters.dto';
import { UpdateApplicationStageRequestDtoSchema } from '../../application/dto/application/update-application-stage.dto';
import { UpdateScoreDto } from '../../application/dto/application/update-score.dto';
import { AddInterviewDto } from '../../application/dto/application/add-interview.dto';
import { UpdateInterviewDto } from '../../application/dto/application/update-interview.dto';
import { AddInterviewFeedbackDto } from '../../application/dto/application/add-interview-feedback.dto';


export class CompanyRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoute();
  }

  private _initializeRoute(): void {
    const { companyProfileRepository } = require('../../infrastructure/di/companyDi');
    const { userRepository } = require('../../infrastructure/di/authDi');

    const userBlockedMiddleware = new UserBlockedMiddleware(userRepository);
    const companyVerificationMiddleware = new CompanyVerificationMiddleware(companyProfileRepository);

    this.router.use(authenticateToken);
    this.router.use(authorizeRoles('company'));
    this.router.use(userBlockedMiddleware.checkUserBlocked);


    this.router.post(CompanyRoutes.PROFILE, companyProfileController.createCompanyProfile);
    this.router.put(CompanyRoutes.PROFILE, companyProfileController.updateCompanyProfile);
    this.router.get(CompanyRoutes.PROFILE, companyProfileController.getCompanyProfile);
    this.router.get(CompanyRoutes.PROFILE_BY_ID, companyProfileController.getCompanyProfileById);
    this.router.post(CompanyRoutes.REAPPLY_VERIFICATION, validateBody(SimpleCompanyProfileDto), companyProfileController.reapplyVerification);

    this.router.post(CompanyRoutes.UPLOAD_LOGO, uploadSingle('logo'), companyProfileController.uploadLogo);
    this.router.post(CompanyRoutes.UPLOAD_BUSINESS_LICENSE, uploadSingle('business_license'), companyUploadController.uploadBusinessLicense);
    this.router.delete(CompanyRoutes.DELETE_UPLOAD, companyUploadController.deleteImage);

    this.router.get(CompanyRoutes.SUBSCRIPTION_PLANS, companySubscriptionPlanController.getActiveSubscriptionPlans);

    this.router.use(companyVerificationMiddleware.checkCompanyVerified);
    this.router.get(CompanyRoutes.DASHBOARD, companyProfileController.getCompanyDashboard);

    this.router.get(CompanyRoutes.CONTACT, companyContactController.getCompanyContact);
    this.router.put(CompanyRoutes.CONTACT, companyContactController.updateCompanyContact);

    this.router.get(CompanyRoutes.TECH_STACKS, companyTechStackController.getCompanyTechStacks);
    this.router.post(CompanyRoutes.TECH_STACKS, companyTechStackController.createCompanyTechStack);
    this.router.put(CompanyRoutes.TECH_STACKS_ID, companyTechStackController.updateCompanyTechStack);
    this.router.delete(CompanyRoutes.TECH_STACKS_ID, companyTechStackController.deleteCompanyTechStack);

    this.router.get(CompanyRoutes.OFFICE_LOCATIONS, companyOfficeLocationController.getCompanyOfficeLocations);
    this.router.post(CompanyRoutes.OFFICE_LOCATIONS, companyOfficeLocationController.createCompanyOfficeLocation);
    this.router.put(CompanyRoutes.OFFICE_LOCATIONS_ID, companyOfficeLocationController.updateCompanyOfficeLocation);
    this.router.delete(CompanyRoutes.OFFICE_LOCATIONS_ID, companyOfficeLocationController.deleteCompanyOfficeLocation);

    this.router.get(CompanyRoutes.BENEFITS, companyBenefitController.getCompanyBenefits);
    this.router.post(CompanyRoutes.BENEFITS, companyBenefitController.createCompanyBenefit);
    this.router.put(CompanyRoutes.BENEFITS_ID, companyBenefitController.updateCompanyBenefit);
    this.router.delete(CompanyRoutes.BENEFITS_ID, companyBenefitController.deleteCompanyBenefit);

    this.router.get(CompanyRoutes.WORKPLACE_PICTURES, companyWorkplacePictureController.getCompanyWorkplacePictures);
    this.router.post(CompanyRoutes.WORKPLACE_PICTURES, companyWorkplacePictureController.createCompanyWorkplacePicture);
    this.router.put(CompanyRoutes.WORKPLACE_PICTURES_ID, companyWorkplacePictureController.updateCompanyWorkplacePicture);
    this.router.delete(CompanyRoutes.WORKPLACE_PICTURES_ID, companyWorkplacePictureController.deleteCompanyWorkplacePicture);
    this.router.post(CompanyRoutes.WORKPLACE_PICTURES_UPLOAD, uploadSingle('image'), companyUploadController.uploadWorkplacePicture);

    this.router.get(CompanyRoutes.SUBSCRIPTIONS_ACTIVE, companySubscriptionController.getActiveSubscription);
    this.router.get(CompanyRoutes.SUBSCRIPTIONS_PAYMENT_HISTORY, companySubscriptionController.getPaymentHistory);
    this.router.post(CompanyRoutes.SUBSCRIPTIONS_CREATE_CHECKOUT, companySubscriptionController.createCheckoutSession);
    this.router.post(CompanyRoutes.SUBSCRIPTIONS_CANCEL, companySubscriptionController.cancelSubscription);
    this.router.post(CompanyRoutes.SUBSCRIPTIONS_RESUME, companySubscriptionController.resumeSubscription);
    this.router.post(CompanyRoutes.SUBSCRIPTIONS_CHANGE_PLAN, companySubscriptionController.changeSubscriptionPlan);
    this.router.post(CompanyRoutes.SUBSCRIPTIONS_BILLING_PORTAL, companySubscriptionController.getBillingPortal);

    this.router.post(CompanyRoutes.JOBS, validateBody(CreateJobPostingRequestDtoSchema), companyJobPostingController.createJobPosting);
    this.router.get(CompanyRoutes.JOBS, validateQuery(JobPostingQueryDto), companyJobPostingController.getCompanyJobPostings);
    this.router.get(CompanyRoutes.JOBS_ID, companyJobPostingController.getJobPosting);
    this.router.put(CompanyRoutes.JOBS_ID, validateBody(UpdateJobPostingDto), companyJobPostingController.updateJobPosting);
    this.router.delete(CompanyRoutes.JOBS_ID, companyJobPostingController.deleteJobPosting);
    this.router.patch(CompanyRoutes.JOBS_ID_STATUS, companyJobPostingController.updateJobStatus);


    this.router.get(CompanyRoutes.APPLICATIONS, companyJobApplicationController.getApplications);
    this.router.post(CompanyRoutes.APPLICATIONS_BULK_UPDATE, companyJobApplicationController.bulkUpdate);
    this.router.get(CompanyRoutes.APPLICATIONS_ID, companyJobApplicationController.getApplicationDetails);
    this.router.patch(CompanyRoutes.APPLICATIONS_ID_STAGE, validateBody(UpdateApplicationStageRequestDtoSchema), companyJobApplicationController.updateStage);
    this.router.patch(CompanyRoutes.APPLICATIONS_ID_SCORE, validateBody(UpdateScoreDto), companyJobApplicationController.updateScore);
    this.router.post(CompanyRoutes.APPLICATIONS_ID_INTERVIEWS, validateBody(AddInterviewDto), companyJobApplicationController.addInterview);
    this.router.patch(CompanyRoutes.APPLICATIONS_ID_INTERVIEWS_INTERVIEW_ID, validateBody(UpdateInterviewDto), companyJobApplicationController.updateInterview);
    this.router.delete(CompanyRoutes.APPLICATIONS_ID_INTERVIEWS_INTERVIEW_DELETE, companyJobApplicationController.deleteInterview);
    this.router.post(CompanyRoutes.APPLICATIONS_ID_INTERVIEWS_FEEDBACK, validateBody(AddInterviewFeedbackDto), companyJobApplicationController.addInterviewFeedback);
  }
}