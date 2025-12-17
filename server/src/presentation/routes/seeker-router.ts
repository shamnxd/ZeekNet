import { Router } from 'express';
import { seekerJobApplicationController, seekerProfileController } from '../../infrastructure/di/seekerDi';
import { SeekerRoutes } from '../../domain/enums/routes.enum';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateQuery, validateBody } from '../middleware/validation.middleware';
import { uploadSingle } from '../middleware/upload.middleware';
import { uploadResume } from '../middleware/upload-resume.middleware';
import { JobPostingQueryDto } from '../../application/dto/job-posting/get-job-postings-query.dto';
import { ApplicationFiltersDto } from '../../application/dto/application/application-filters.dto';
import { CreateSeekerProfileDto } from '../../application/dto/seeker/create-seeker-profile-request.dto';
import { UpdateSeekerProfileDto } from '../../application/dto/seeker/update-seeker-profile-request.dto';
import { AddExperienceDto } from '../../application/dto/seeker/add-experience-request.dto';
import { UpdateExperienceDto } from '../../application/dto/seeker/update-experience-request.dto';
import { AddEducationDto } from '../../application/dto/seeker/add-education-request.dto';
import { UpdateEducationDto } from '../../application/dto/seeker/update-education-request.dto';
import { UpdateSkillsDto } from '../../application/dto/seeker/update-skills-request.dto';
import { UpdateLanguagesDto } from '../../application/dto/seeker/update-languages-request.dto';
import { UploadResumeDto } from '../../application/dto/seeker/seeker-profile.dto';

export class SeekerRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);

    this.router.post(SeekerRoutes.PROFILE, validateBody(CreateSeekerProfileDto), seekerProfileController.createSeekerProfile);
    this.router.get(SeekerRoutes.PROFILE, seekerProfileController.getSeekerProfile);
    this.router.put(SeekerRoutes.PROFILE, validateBody(UpdateSeekerProfileDto), seekerProfileController.updateSeekerProfile);

    this.router.post(SeekerRoutes.PROFILE_EXPERIENCES, validateBody(AddExperienceDto), seekerProfileController.addExperience);
    this.router.get(SeekerRoutes.PROFILE_EXPERIENCES, seekerProfileController.getExperiences);
    this.router.put(SeekerRoutes.PROFILE_EXPERIENCES_ID, validateBody(UpdateExperienceDto), seekerProfileController.updateExperience);
    this.router.delete(SeekerRoutes.PROFILE_EXPERIENCES_ID, seekerProfileController.removeExperience);

    this.router.post(SeekerRoutes.PROFILE_EDUCATION, validateBody(AddEducationDto), seekerProfileController.addEducation);
    this.router.get(SeekerRoutes.PROFILE_EDUCATION, seekerProfileController.getEducation);
    this.router.put(SeekerRoutes.PROFILE_EDUCATION_ID, validateBody(UpdateEducationDto), seekerProfileController.updateEducation);
    this.router.delete(SeekerRoutes.PROFILE_EDUCATION_ID, seekerProfileController.removeEducation);

    this.router.put(SeekerRoutes.PROFILE_SKILLS, validateBody(UpdateSkillsDto), seekerProfileController.updateSkills);

    this.router.put(SeekerRoutes.PROFILE_LANGUAGES, validateBody(UpdateLanguagesDto), seekerProfileController.updateLanguages);

    this.router.post(SeekerRoutes.PROFILE_RESUME, validateBody(UploadResumeDto), seekerProfileController.uploadResume);
    this.router.delete(SeekerRoutes.PROFILE_RESUME, seekerProfileController.removeResume);

    this.router.post(SeekerRoutes.PROFILE_AVATAR, uploadSingle('avatar'), seekerProfileController.uploadAvatar);
    this.router.post(SeekerRoutes.PROFILE_BANNER, uploadSingle('banner'), seekerProfileController.uploadBanner);


    this.router.post(SeekerRoutes.APPLICATIONS, uploadResume('resume'), seekerJobApplicationController.createApplication);
    this.router.post(SeekerRoutes.APPLICATIONS_ANALYZE_RESUME, uploadResume('resume'), seekerJobApplicationController.analyzeResume);
    this.router.get(SeekerRoutes.APPLICATIONS, validateQuery(ApplicationFiltersDto), seekerJobApplicationController.getApplications);
    this.router.get(SeekerRoutes.APPLICATIONS_ID, seekerJobApplicationController.getApplicationDetails);
  }
}