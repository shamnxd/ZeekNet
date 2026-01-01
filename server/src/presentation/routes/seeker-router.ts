import { Router } from 'express';
import { seekerJobApplicationController, seekerProfileController } from 'src/infrastructure/di/seekerDi';

import { authenticateToken } from 'src/presentation/middleware/auth.middleware';
import { validateQuery, validateBody } from 'src/presentation/middleware/validation.middleware';
import { uploadSingle } from 'src/presentation/middleware/upload.middleware';
import { uploadResume } from 'src/presentation/middleware/upload-resume.middleware';
import { uploadDocument } from 'src/presentation/middleware/upload-document.middleware';
import { JobPostingQueryDto } from 'src/application/dtos/admin/job/requests/get-job-postings-query.dto';
import { ApplicationFiltersDto } from 'src/application/dtos/company/hiring/requests/application-filters.dto';
import { CreateSeekerProfileDto } from 'src/application/dtos/seeker/profile/info/requests/create-seeker-profile-request.dto';
import { UpdateSeekerProfileDto } from 'src/application/dtos/seeker/profile/info/requests/update-seeker-profile-request.dto';
import { AddExperienceDto } from 'src/application/dtos/seeker/profile/experience/requests/add-experience-request.dto';
import { UpdateExperienceDto } from 'src/application/dtos/seeker/profile/experience/requests/update-experience-request.dto';
import { AddEducationDto } from 'src/application/dtos/seeker/profile/education/requests/add-education-request.dto';
import { UpdateEducationDto } from 'src/application/dtos/seeker/profile/education/requests/update-education-request.dto';
import { UpdateSkillsDto } from 'src/application/dtos/seeker/profile/skills/requests/update-skills-request.dto';
import { UpdateLanguagesDto } from 'src/application/dtos/seeker/profile/languages/requests/update-languages-request.dto';
import { UploadResumeDto } from 'src/application/dtos/seeker/media/requests/seeker-profile.dto';

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
