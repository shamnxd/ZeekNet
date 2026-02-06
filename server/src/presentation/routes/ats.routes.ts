import { Router } from 'express';
import {
  atsInterviewController,
  atsTechnicalTaskController,
  atsOfferController,
  atsCommentController,
  atsCompensationController,

} from 'src/infrastructure/di/atsDi';

import { authenticateToken, authorizeRoles } from 'src/presentation/middleware/auth.middleware';
import { uploadDocument } from 'src/presentation/middleware/upload-document.middleware';

export class ATSRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);
    this.router.use(authorizeRoles('company'));

    this.router.post('/interviews', atsInterviewController.scheduleInterview);
    this.router.put('/interviews/:id', atsInterviewController.updateInterview);
    this.router.get('/:applicationId/interviews', atsInterviewController.getInterviewsByApplication);

    this.router.post('/tasks', uploadDocument('document'), atsTechnicalTaskController.assignTechnicalTask);
    this.router.put('/tasks/:id', uploadDocument('document'), atsTechnicalTaskController.updateTechnicalTask);
    this.router.delete('/tasks/:id', atsTechnicalTaskController.deleteTechnicalTask);
    this.router.get('/:applicationId/tasks', atsTechnicalTaskController.getTechnicalTasksByApplication);

    this.router.post('/offers', uploadDocument('document'), atsOfferController.uploadOffer);
    this.router.put('/offers/:id/status', atsOfferController.updateOfferStatus);
    this.router.get('/:applicationId/offers', atsOfferController.getOffersByApplication);

    this.router.post('/comments', atsCommentController.addComment);
    this.router.get('/:applicationId/comments', atsCommentController.getCommentsByApplication);



    this.router.post('/:applicationId/compensation/initiate', atsCompensationController.initiateCompensation);
    this.router.put('/:applicationId/compensation', atsCompensationController.updateCompensation);
    this.router.get('/:applicationId/compensation', atsCompensationController.getCompensation);
    this.router.post('/:applicationId/compensation/meetings', atsCompensationController.scheduleCompensationMeeting);
    this.router.get('/:applicationId/compensation/meetings', atsCompensationController.getCompensationMeetings);
    this.router.put('/:applicationId/compensation/meetings/:meetingId/status', atsCompensationController.updateCompensationMeetingStatus);
    this.router.post('/:applicationId/compensation/notes', atsCommentController.addCompensationNote);
    this.router.get('/:applicationId/compensation/notes', atsCommentController.getCompensationNotes);
  }
}
