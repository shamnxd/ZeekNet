import { Router } from 'express';
import { seekerJobApplicationController, seekerProfileController } from 'src/infrastructure/di/seekerDi';

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

    this.router.post('/profile', seekerProfileController.createSeekerProfile);
    this.router.get('/profile', seekerProfileController.getSeekerProfile);
    this.router.put('/profile', seekerProfileController.updateSeekerProfile);

    this.router.post('/profile/experiences', seekerProfileController.addExperience);
    this.router.get('/profile/experiences', seekerProfileController.getExperiences);
    this.router.put('/profile/experiences/:experienceId', seekerProfileController.updateExperience);
    this.router.delete('/profile/experiences/:experienceId', seekerProfileController.removeExperience);

    this.router.post('/profile/education', seekerProfileController.addEducation);
    this.router.get('/profile/education', seekerProfileController.getEducation);
    this.router.put('/profile/education/:educationId', seekerProfileController.updateEducation);
    this.router.delete('/profile/education/:educationId', seekerProfileController.removeEducation);

    this.router.put('/profile/skills', seekerProfileController.updateSkills);

    this.router.put('/profile/languages', seekerProfileController.updateLanguages);

    this.router.post('/profile/resume', seekerProfileController.uploadResume);
    this.router.delete('/profile/resume', seekerProfileController.removeResume);

    this.router.post('/profile/avatar', uploadSingle('avatar'), seekerProfileController.uploadAvatar);
    this.router.post('/profile/banner', uploadSingle('banner'), seekerProfileController.uploadBanner);


    this.router.post('/applications', uploadResume('resume'), seekerJobApplicationController.createApplication);
    this.router.post('/applications/analyze-resume', uploadResume('resume'), seekerJobApplicationController.analyzeResume);
    this.router.get('/applications', seekerJobApplicationController.getApplications);
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
