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
  companyCandidatesController,
  subscriptionMiddleware,
} from '../../infrastructure/di/companyDi';

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


    this.router.post('/profile', companyProfileController.createCompanyProfile);
    this.router.put('/profile', companyProfileController.updateCompanyProfile);
    this.router.get('/profile', companyProfileController.getCompanyProfile);
    this.router.get('/profile/:profileId', companyProfileController.getCompanyProfileById);
    this.router.post('/reapply-verification', validateBody(SimpleCompanyProfileDto), companyProfileController.reapplyVerification);

    this.router.post('/upload/logo', uploadSingle('logo'), companyProfileController.uploadLogo);
    this.router.post('/upload/business-license', uploadSingle('business_license'), companyUploadController.uploadBusinessLicense);
    this.router.delete('/upload/delete', companyUploadController.deleteImage);

    this.router.get('/subscription-plans', companySubscriptionPlanController.getActiveSubscriptionPlans);

    this.router.use(companyVerificationMiddleware.checkCompanyVerified);
    this.router.get('/dashboard', companyProfileController.getCompanyDashboard);

    this.router.get('/contact', companyContactController.getCompanyContact);
    this.router.put('/contact', companyContactController.updateCompanyContact);

    this.router.get('/tech-stacks', companyTechStackController.getCompanyTechStacks);
    this.router.post('/tech-stacks', companyTechStackController.createCompanyTechStack);
    this.router.put('/tech-stacks/:id', companyTechStackController.updateCompanyTechStack);
    this.router.delete('/tech-stacks/:id', companyTechStackController.deleteCompanyTechStack);

    this.router.get('/office-locations', companyOfficeLocationController.getCompanyOfficeLocations);
    this.router.post('/office-locations', companyOfficeLocationController.createCompanyOfficeLocation);
    this.router.put('/office-locations/:id', companyOfficeLocationController.updateCompanyOfficeLocation);
    this.router.delete('/office-locations/:id', companyOfficeLocationController.deleteCompanyOfficeLocation);

    this.router.get('/benefits', companyBenefitController.getCompanyBenefits);
    this.router.post('/benefits', companyBenefitController.createCompanyBenefit);
    this.router.put('/benefits/:id', companyBenefitController.updateCompanyBenefit);
    this.router.delete('/benefits/:id', companyBenefitController.deleteCompanyBenefit);

    this.router.get('/workplace-pictures', companyWorkplacePictureController.getCompanyWorkplacePictures);
    this.router.post('/workplace-pictures', companyWorkplacePictureController.createCompanyWorkplacePicture);
    this.router.put('/workplace-pictures/:id', companyWorkplacePictureController.updateCompanyWorkplacePicture);
    this.router.delete('/workplace-pictures/:id', companyWorkplacePictureController.deleteCompanyWorkplacePicture);
    this.router.post('/workplace-pictures/upload', uploadSingle('image'), companyUploadController.uploadWorkplacePicture);

    this.router.get('/subscriptions/active', companySubscriptionController.getActiveSubscription);
    this.router.get('/subscriptions/payment-history', companySubscriptionController.getPaymentHistory);
    this.router.post('/subscriptions/create-checkout-session', companySubscriptionController.createCheckoutSession);
    this.router.post('/subscriptions/cancel', companySubscriptionController.cancelSubscription);
    this.router.post('/subscriptions/resume', companySubscriptionController.resumeSubscription);
    this.router.post('/subscriptions/change-plan', companySubscriptionController.changeSubscriptionPlan);
    this.router.post('/subscriptions/billing-portal', companySubscriptionController.getBillingPortal);

    this.router.post('/jobs', validateBody(CreateJobPostingRequestDtoSchema), companyJobPostingController.createJobPosting);
    this.router.get('/jobs', validateQuery(JobPostingQueryDto), companyJobPostingController.getCompanyJobPostings);
    this.router.get('/jobs/:id', companyJobPostingController.getJobPosting);
    this.router.put('/jobs/:id', validateBody(UpdateJobPostingDto), companyJobPostingController.updateJobPosting);
    this.router.delete('/jobs/:id', companyJobPostingController.deleteJobPosting);
    this.router.patch('/jobs/:id/status', companyJobPostingController.updateJobStatus);

    this.router.get('/applications', companyJobApplicationController.getApplications);
    this.router.post('/applications/bulk-update', companyJobApplicationController.bulkUpdate);
    this.router.post('/applications/:id/mark-hired', companyJobApplicationController.markAsHired);
    
    const { 
      atsInterviewController, 
      atsTechnicalTaskController, 
      atsOfferController, 
      atsCommentController, 
      atsCompensationController, 
      atsActivityController, 
      atsPipelineController,
    } = require('../../infrastructure/di/atsDi');
    const { createATSRoutes } = require('./ats.routes');
    this.router.use('/applications', createATSRoutes(
      atsInterviewController,
      atsTechnicalTaskController,
      atsOfferController,
      atsCommentController,
      atsCompensationController,
      atsActivityController,
    ));
    
    this.router.post('/applications/:id/move-stage', atsPipelineController.moveApplicationStage);
    this.router.post('/applications/:id/update-sub-stage', atsPipelineController.updateApplicationSubStage);
    
    this.router.get('/applications/:id', companyJobApplicationController.getApplicationDetails);
    this.router.patch('/applications/:id/stage', validateBody(UpdateApplicationStageRequestDtoSchema), companyJobApplicationController.updateStage);
    this.router.patch('/applications/:id/score', validateBody(UpdateScoreDto), companyJobApplicationController.updateScore);

    this.router.get('/jobs/:jobId/ats-pipeline', atsPipelineController.getJobPipeline);
    this.router.get('/jobs/:jobId/applications', atsPipelineController.getJobApplicationsForKanban);

    this.router.get('/candidates', companyCandidatesController.getCandidates);
    this.router.get('/candidates/:id', companyCandidatesController.getCandidateDetails);
  }
}