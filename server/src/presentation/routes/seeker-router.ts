import { Router } from 'express';
import { seekerJobApplicationController, seekerProfileController } from '../../infrastructure/di/seekerDi';

import { authenticateToken } from '../middleware/auth.middleware';
import { validateQuery, validateBody } from '../middleware/validation.middleware';
import { uploadSingle } from '../middleware/upload.middleware';
import { uploadResume } from '../middleware/upload-resume.middleware';
import { uploadDocument } from '../middleware/upload-document.middleware';
import { JobPostingQueryDto } from '../../application/dtos/job-posting/common/get-job-postings-query.dto';
import { ApplicationFiltersDto } from '../../application/dtos/job-application/requests/application-filters.dto';
import { CreateSeekerProfileDto } from '../../application/dtos/seeker/requests/create-seeker-profile-request.dto';
import { UpdateSeekerProfileDto } from '../../application/dtos/seeker/requests/update-seeker-profile-request.dto';
import { AddExperienceDto } from '../../application/dtos/seeker/common/add-experience-request.dto';
import { UpdateExperienceDto } from '../../application/dtos/seeker/requests/update-experience-request.dto';
import { AddEducationDto } from '../../application/dtos/seeker/common/add-education-request.dto';
import { UpdateEducationDto } from '../../application/dtos/seeker/requests/update-education-request.dto';
import { UpdateSkillsDto } from '../../application/dtos/seeker/requests/update-skills-request.dto';
import { UpdateLanguagesDto } from '../../application/dtos/seeker/requests/update-languages-request.dto';
import { UploadResumeDto } from '../../application/dtos/seeker/common/seeker-profile.dto';

export class SeekerRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);

    this.router.post('/profile', validateBody(CreateSeekerProfileDto), seekerProfileController.createSeekerProfile);
    this.router.get('/profile', seekerProfileController.getSeekerProfile);
    this.router.put('/profile', validateBody(UpdateSeekerProfileDto), seekerProfileController.updateSeekerProfile);

    this.router.post('/profile/experiences', validateBody(AddExperienceDto), seekerProfileController.addExperience);
    this.router.get('/profile/experiences', seekerProfileController.getExperiences);
    this.router.put('/profile/experiences/:experienceId', validateBody(UpdateExperienceDto), seekerProfileController.updateExperience);
    this.router.delete('/profile/experiences/:experienceId', seekerProfileController.removeExperience);

    this.router.post('/profile/education', validateBody(AddEducationDto), seekerProfileController.addEducation);
    this.router.get('/profile/education', seekerProfileController.getEducation);
    this.router.put('/profile/education/:educationId', validateBody(UpdateEducationDto), seekerProfileController.updateEducation);
    this.router.delete('/profile/education/:educationId', seekerProfileController.removeEducation);

    this.router.put('/profile/skills', validateBody(UpdateSkillsDto), seekerProfileController.updateSkills);

    this.router.put('/profile/languages', validateBody(UpdateLanguagesDto), seekerProfileController.updateLanguages);

    this.router.post('/profile/resume', validateBody(UploadResumeDto), seekerProfileController.uploadResume);
    this.router.delete('/profile/resume', seekerProfileController.removeResume);

    this.router.post('/profile/avatar', uploadSingle('avatar'), seekerProfileController.uploadAvatar);
    this.router.post('/profile/banner', uploadSingle('banner'), seekerProfileController.uploadBanner);


    this.router.post('/applications', uploadResume('resume'), seekerJobApplicationController.createApplication);
    this.router.post('/applications/analyze-resume', uploadResume('resume'), seekerJobApplicationController.analyzeResume);
    this.router.get('/applications', validateQuery(ApplicationFiltersDto), seekerJobApplicationController.getApplications);
    this.router.get('/applications/:id', seekerJobApplicationController.getApplicationDetails);
    this.router.get('/applications/:id/interviews', seekerJobApplicationController.getInterviewsByApplication);
    this.router.get('/applications/:id/tasks', seekerJobApplicationController.getTechnicalTasksByApplication);
    this.router.put('/applications/:applicationId/tasks/:taskId/submit', uploadDocument('document'), seekerJobApplicationController.submitTechnicalTask);
    this.router.get('/applications/:id/offers', seekerJobApplicationController.getOffersByApplication);
    this.router.put('/applications/:applicationId/offers/:offerId/status', seekerJobApplicationController.updateOfferStatus);
    this.router.post('/applications/:applicationId/offers/:offerId/signed-document', uploadDocument('document'), seekerJobApplicationController.uploadSignedOfferDocument);
    this.router.get('/applications/:id/compensation', seekerJobApplicationController.getCompensation);
    this.router.get('/applications/:id/compensation/meetings', seekerJobApplicationController.getCompensationMeetings);
  }
}
