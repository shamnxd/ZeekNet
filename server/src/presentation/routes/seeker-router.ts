import { Router } from 'express';
import { container } from 'src/infrastructure/di/container';
import { TYPES } from 'src/shared/constants/types';
import { SeekerProfileController } from 'src/presentation/controllers/seeker/profile/seeker-profile.controller';
import { SeekerJobApplicationController } from 'src/presentation/controllers/seeker/applications/job-application.controller';
import { APP_ROUTES } from 'src/shared/constants/routes';

import { authenticateToken } from 'src/presentation/middleware/auth.middleware';
import { uploadSingle } from 'src/presentation/middleware/upload.middleware';
import { uploadResume } from 'src/presentation/middleware/upload-resume.middleware';
import { uploadDocument } from 'src/presentation/middleware/upload-document.middleware';

export class SeekerRouter {
  public router: Router;
  private _seekerProfileController: SeekerProfileController;
  private _seekerJobApplicationController: SeekerJobApplicationController;

  constructor() {
    this.router = Router();
    this._seekerProfileController = container.get<SeekerProfileController>(TYPES.SeekerProfileController);
    this._seekerJobApplicationController = container.get<SeekerJobApplicationController>(TYPES.SeekerJobApplicationController);
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);

    this.router.post(APP_ROUTES.SEEKER.PROFILE, this._seekerProfileController.createSeekerProfile);
    this.router.get(APP_ROUTES.SEEKER.PROFILE, this._seekerProfileController.getSeekerProfile);
    this.router.put(APP_ROUTES.SEEKER.PROFILE, this._seekerProfileController.updateSeekerProfile);

    this.router.post(APP_ROUTES.SEEKER.PROFILE_EXPERIENCES, this._seekerProfileController.addExperience);
    this.router.get(APP_ROUTES.SEEKER.PROFILE_EXPERIENCES, this._seekerProfileController.getExperiences);
    this.router.put(APP_ROUTES.SEEKER.PROFILE_EXPERIENCE_BY_ID, this._seekerProfileController.updateExperience);
    this.router.delete(APP_ROUTES.SEEKER.PROFILE_EXPERIENCE_BY_ID, this._seekerProfileController.removeExperience);

    this.router.post(APP_ROUTES.SEEKER.PROFILE_EDUCATION, this._seekerProfileController.addEducation);
    this.router.get(APP_ROUTES.SEEKER.PROFILE_EDUCATION, this._seekerProfileController.getEducation);
    this.router.put(APP_ROUTES.SEEKER.PROFILE_EDUCATION_BY_ID, this._seekerProfileController.updateEducation);
    this.router.delete(APP_ROUTES.SEEKER.PROFILE_EDUCATION_BY_ID, this._seekerProfileController.removeEducation);

    this.router.put(APP_ROUTES.SEEKER.PROFILE_SKILLS, this._seekerProfileController.updateSkills);

    this.router.put(APP_ROUTES.SEEKER.PROFILE_LANGUAGES, this._seekerProfileController.updateLanguages);

    this.router.post(APP_ROUTES.SEEKER.PROFILE_RESUME, this._seekerProfileController.uploadResume);
    this.router.delete(APP_ROUTES.SEEKER.PROFILE_RESUME, this._seekerProfileController.removeResume);

    this.router.post(APP_ROUTES.SEEKER.PROFILE_AVATAR, uploadSingle('avatar'), this._seekerProfileController.uploadAvatar);
    this.router.post(APP_ROUTES.SEEKER.PROFILE_BANNER, uploadSingle('banner'), this._seekerProfileController.uploadBanner);


    this.router.post(APP_ROUTES.SEEKER.APPLICATIONS, uploadResume('resume'), this._seekerJobApplicationController.createApplication);
    this.router.post(APP_ROUTES.SEEKER.APPLICATIONS_ANALYZE_RESUME, uploadResume('resume'), this._seekerJobApplicationController.analyzeResume);
    this.router.get(APP_ROUTES.SEEKER.APPLICATIONS, this._seekerJobApplicationController.getApplications);
    this.router.get(APP_ROUTES.SEEKER.APPLICATION_DETAIL, this._seekerJobApplicationController.getApplicationDetails);
    this.router.get(APP_ROUTES.SEEKER.APPLICATION_INTERVIEWS, this._seekerJobApplicationController.getInterviewsByApplication);
    this.router.get(APP_ROUTES.SEEKER.APPLICATION_TASKS, this._seekerJobApplicationController.getTechnicalTasksByApplication);
    this.router.put(APP_ROUTES.SEEKER.APPLICATION_TASK_SUBMIT, uploadDocument('document'), this._seekerJobApplicationController.submitTechnicalTask);
    this.router.get(APP_ROUTES.SEEKER.APPLICATION_OFFERS, this._seekerJobApplicationController.getOffersByApplication);
    this.router.put(APP_ROUTES.SEEKER.APPLICATION_OFFER_STATUS, this._seekerJobApplicationController.updateOfferStatus);
    this.router.post(APP_ROUTES.SEEKER.APPLICATION_OFFER_SIGNED, uploadDocument('document'), this._seekerJobApplicationController.uploadSignedOfferDocument);
    this.router.get(APP_ROUTES.SEEKER.APPLICATION_COMPENSATION, this._seekerJobApplicationController.getCompensation);
    this.router.get(APP_ROUTES.SEEKER.APPLICATION_COMPENSATION_MEETINGS, this._seekerJobApplicationController.getCompensationMeetings);
  }
}

