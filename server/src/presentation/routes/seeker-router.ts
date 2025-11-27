import { Router } from 'express';
import { seekerJobApplicationController, seekerProfileController } from '../../infrastructure/di/seekerDi';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateQuery, validateBody } from '../middleware/validation.middleware';
import { uploadSingle } from '../middleware/upload.middleware';
import { uploadResume } from '../middleware/upload-resume.middleware';
import { JobPostingQueryDto } from '../../application/dto/job-posting/job-posting.dto';
import { ApplicationFiltersDto } from '../../application/dto/job-application/application-filters.dto';
import { 
  CreateSeekerProfileDto, 
  UpdateSeekerProfileDto, 
  AddExperienceDto, 
  UpdateExperienceDto, 
  AddEducationDto, 
  UpdateEducationDto, 
  UpdateSkillsDto,
  UpdateLanguagesDto, 
  UploadResumeDto, 
} from '../../application/dto/seeker/seeker-profile.dto';

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
    this.router.get('/applications', validateQuery(ApplicationFiltersDto), seekerJobApplicationController.getApplications);
    this.router.get('/applications/:id', seekerJobApplicationController.getApplicationDetails);
  }
}