import { Router } from 'express';
import {
  atsInterviewController,
  atsTechnicalTaskController,
  atsOfferController,
  atsCommentController,
  atsCompensationController,

} from 'src/infrastructure/di/atsDi';
import { APP_ROUTES } from 'src/shared/constants/routes';

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

    this.router.post(APP_ROUTES.ATS.INTERVIEWS, atsInterviewController.scheduleInterview);
    this.router.put(APP_ROUTES.ATS.INTERVIEW_BY_ID, atsInterviewController.updateInterview);
    this.router.get(APP_ROUTES.ATS.APPLICATION_INTERVIEWS, atsInterviewController.getInterviewsByApplication);

    this.router.post(APP_ROUTES.ATS.TASKS, uploadDocument('document'), atsTechnicalTaskController.assignTechnicalTask);
    this.router.put(APP_ROUTES.ATS.TASK_BY_ID, uploadDocument('document'), atsTechnicalTaskController.updateTechnicalTask);
    this.router.delete(APP_ROUTES.ATS.TASK_BY_ID, atsTechnicalTaskController.deleteTechnicalTask);
    this.router.get(APP_ROUTES.ATS.APPLICATION_TASKS, atsTechnicalTaskController.getTechnicalTasksByApplication);

    this.router.post(APP_ROUTES.ATS.OFFERS, uploadDocument('document'), atsOfferController.uploadOffer);
    this.router.put(APP_ROUTES.ATS.OFFER_BY_ID, atsOfferController.updateOfferStatus);
    this.router.get(APP_ROUTES.ATS.APPLICATION_OFFERS, atsOfferController.getOffersByApplication);

    this.router.post(APP_ROUTES.ATS.COMMENTS, atsCommentController.addComment);
    this.router.get(APP_ROUTES.ATS.APPLICATION_COMMENTS, atsCommentController.getCommentsByApplication);

    this.router.post(APP_ROUTES.ATS.COMPENSATION_INITIATE, atsCompensationController.initiateCompensation);
    this.router.put(APP_ROUTES.ATS.COMPENSATION_DETAIL, atsCompensationController.updateCompensation);
    this.router.get(APP_ROUTES.ATS.COMPENSATION_DETAIL, atsCompensationController.getCompensation);
    this.router.post(APP_ROUTES.ATS.COMPENSATION_MEETINGS, atsCompensationController.scheduleCompensationMeeting);
    this.router.get(APP_ROUTES.ATS.COMPENSATION_MEETINGS, atsCompensationController.getCompensationMeetings);
    this.router.put(APP_ROUTES.ATS.COMPENSATION_MEETING_STATUS, atsCompensationController.updateCompensationMeetingStatus);
  }
}

