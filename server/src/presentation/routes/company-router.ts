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
} from '../../infrastructure/di/companyDi';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { uploadSingle } from '../middleware/upload.middleware';
import { validateBody, validateQuery } from '../middleware/validation.middleware';
import { UserBlockedMiddleware } from '../middleware/user-blocked.middleware';
import { CompanyVerificationMiddleware } from '../middleware/company-verification.middleware';
import { CreateJobPostingRequestDto, UpdateJobPostingDto, JobPostingQueryDto } from '../../application/dto/job-posting/job-posting.dto';
import { SimpleCompanyProfileDto } from '../../application/dto/company/create-company.dto';
import { ApplicationFiltersDto } from '../../application/dto/job-application/application-filters.dto';
import { UpdateApplicationStageDto } from '../../application/dto/job-application/update-application-stage.dto';
import { UpdateScoreDto } from '../../application/dto/job-application/update-score.dto';
import { AddInterviewDto } from '../../application/dto/job-application/add-interview.dto';
import { UpdateInterviewDto } from '../../application/dto/job-application/update-interview.dto';
import { AddInterviewFeedbackDto } from '../../application/dto/job-application/add-interview-feedback.dto';

export class CompanyRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoute();
  }

  private _initializeRoute(): void {
    const { companyRepository } = require('../../infrastructure/di/companyDi');
    const { userRepository } = require('../../infrastructure/di/authDi');

    const userBlockedMiddleware = new UserBlockedMiddleware(userRepository);
    const companyVerificationMiddleware = new CompanyVerificationMiddleware(companyRepository);

    this.router.use(authenticateToken);
    this.router.use(authorizeRoles('company'));
    this.router.use(userBlockedMiddleware.checkUserBlocked);

    // Company Profile Routes
    this.router.post('/profile', companyProfileController.createCompanyProfile);
    this.router.put('/profile', companyProfileController.updateCompanyProfile);
    this.router.get('/profile', companyProfileController.getCompanyProfile);
    this.router.get('/profile/:profileId', companyProfileController.getCompanyProfileById);
    this.router.post('/reapply-verification', validateBody(SimpleCompanyProfileDto), companyProfileController.reapplyVerification);

    this.router.post('/upload/logo', uploadSingle('logo'), companyProfileController.uploadLogo);
    this.router.post('/upload/business-license', uploadSingle('business_license'), companyUploadController.uploadBusinessLicense);
    this.router.delete('/upload/delete', companyUploadController.deleteImage);

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

    this.router.post('/jobs', validateBody(CreateJobPostingRequestDto), companyJobPostingController.createJobPosting);
    this.router.get('/jobs', validateQuery(JobPostingQueryDto), companyJobPostingController.getCompanyJobPostings);
    this.router.get('/jobs/:id', companyJobPostingController.getJobPosting);
    this.router.put('/jobs/:id', validateBody(UpdateJobPostingDto), companyJobPostingController.updateJobPosting);
    this.router.delete('/jobs/:id', companyJobPostingController.deleteJobPosting);
    this.router.patch('/jobs/:id/status', companyJobPostingController.updateJobStatus);

    // Job Application Routes
    this.router.get('/applications', validateQuery(ApplicationFiltersDto), companyJobApplicationController.getApplications);
    this.router.get('/applications/:id', companyJobApplicationController.getApplicationDetails);
    this.router.patch('/applications/:id/stage', validateBody(UpdateApplicationStageDto), companyJobApplicationController.updateStage);
    this.router.patch('/applications/:id/score', validateBody(UpdateScoreDto), companyJobApplicationController.updateScore);
    this.router.post('/applications/:id/interviews', validateBody(AddInterviewDto), companyJobApplicationController.addInterview);
    this.router.patch('/applications/:id/interviews/:interviewId', validateBody(UpdateInterviewDto), companyJobApplicationController.updateInterview);
    this.router.delete('/applications/:id/interviews/:interviewId', companyJobApplicationController.deleteInterview);
    this.router.post('/applications/:id/interviews/:interviewId/feedback', validateBody(AddInterviewFeedbackDto), companyJobApplicationController.addInterviewFeedback);
  }
}