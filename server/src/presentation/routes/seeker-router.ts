import { Router } from 'express';
import { seekerJobApplicationController, seekerProfileController } from 'src/infrastructure/di/seekerDi';
import { APP_ROUTES } from 'src/shared/constants/routes';

import { authenticateToken } from 'src/presentation/middleware/auth.middleware';
import { uploadSingle } from 'src/presentation/middleware/upload.middleware';
import { uploadResume } from 'src/presentation/middleware/upload-resume.middleware';
import { uploadDocument } from 'src/presentation/middleware/upload-document.middleware';

export class SeekerRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);

    this.router.post(APP_ROUTES.SEEKER.PROFILE, seekerProfileController.createSeekerProfile);
    this.router.get(APP_ROUTES.SEEKER.PROFILE, seekerProfileController.getSeekerProfile);
    this.router.put(APP_ROUTES.SEEKER.PROFILE, seekerProfileController.updateSeekerProfile);

    this.router.post(APP_ROUTES.SEEKER.PROFILE_EXPERIENCES, seekerProfileController.addExperience);
    this.router.get(APP_ROUTES.SEEKER.PROFILE_EXPERIENCES, seekerProfileController.getExperiences);
    this.router.put(APP_ROUTES.SEEKER.PROFILE_EXPERIENCE_BY_ID, seekerProfileController.updateExperience);
    this.router.delete(APP_ROUTES.SEEKER.PROFILE_EXPERIENCE_BY_ID, seekerProfileController.removeExperience);

    this.router.post(APP_ROUTES.SEEKER.PROFILE_EDUCATION, seekerProfileController.addEducation);
    this.router.get(APP_ROUTES.SEEKER.PROFILE_EDUCATION, seekerProfileController.getEducation);
    this.router.put(APP_ROUTES.SEEKER.PROFILE_EDUCATION_BY_ID, seekerProfileController.updateEducation);
    this.router.delete(APP_ROUTES.SEEKER.PROFILE_EDUCATION_BY_ID, seekerProfileController.removeEducation);

    this.router.put(APP_ROUTES.SEEKER.PROFILE_SKILLS, seekerProfileController.updateSkills);

    this.router.put(APP_ROUTES.SEEKER.PROFILE_LANGUAGES, seekerProfileController.updateLanguages);

    this.router.post(APP_ROUTES.SEEKER.PROFILE_RESUME, seekerProfileController.uploadResume);
    this.router.delete(APP_ROUTES.SEEKER.PROFILE_RESUME, seekerProfileController.removeResume);

    this.router.post(APP_ROUTES.SEEKER.PROFILE_AVATAR, uploadSingle('avatar'), seekerProfileController.uploadAvatar);
    this.router.post(APP_ROUTES.SEEKER.PROFILE_BANNER, uploadSingle('banner'), seekerProfileController.uploadBanner);


    this.router.post(APP_ROUTES.SEEKER.APPLICATIONS, uploadResume('resume'), seekerJobApplicationController.createApplication);
    this.router.post(APP_ROUTES.SEEKER.APPLICATIONS_ANALYZE_RESUME, uploadResume('resume'), seekerJobApplicationController.analyzeResume);
    this.router.get(APP_ROUTES.SEEKER.APPLICATIONS, seekerJobApplicationController.getApplications);
    this.router.get(APP_ROUTES.SEEKER.APPLICATION_DETAIL, seekerJobApplicationController.getApplicationDetails);
    this.router.get(APP_ROUTES.SEEKER.APPLICATION_INTERVIEWS, seekerJobApplicationController.getInterviewsByApplication);
    this.router.get(APP_ROUTES.SEEKER.APPLICATION_TASKS, seekerJobApplicationController.getTechnicalTasksByApplication);
    this.router.put(APP_ROUTES.SEEKER.APPLICATION_TASK_SUBMIT, uploadDocument('document'), seekerJobApplicationController.submitTechnicalTask);
    this.router.get(APP_ROUTES.SEEKER.APPLICATION_OFFERS, seekerJobApplicationController.getOffersByApplication);
    this.router.put(APP_ROUTES.SEEKER.APPLICATION_OFFER_STATUS, seekerJobApplicationController.updateOfferStatus);
    this.router.post(APP_ROUTES.SEEKER.APPLICATION_OFFER_SIGNED, uploadDocument('document'), seekerJobApplicationController.uploadSignedOfferDocument);
    this.router.get(APP_ROUTES.SEEKER.APPLICATION_COMPENSATION, seekerJobApplicationController.getCompensation);
    this.router.get(APP_ROUTES.SEEKER.APPLICATION_COMPENSATION_MEETINGS, seekerJobApplicationController.getCompensationMeetings);
  }
}

