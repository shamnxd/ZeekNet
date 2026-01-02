import { Router } from 'express';
import { ATSInterviewController } from 'src/presentation/controllers/ats/evaluation/ats-interview.controller';
import { ATSTechnicalTaskController } from 'src/presentation/controllers/ats/evaluation/ats-technical-task.controller';
import { ATSOfferController } from 'src/presentation/controllers/ats/offer/ats-offer.controller';
import { ATSCommentController } from 'src/presentation/controllers/ats/activity/ats-comment.controller';
import { ATSCompensationController } from 'src/presentation/controllers/ats/offer/ats-compensation.controller';
import { ATSActivityController } from 'src/presentation/controllers/ats/activity/ats-activity.controller';
import { authenticateToken, authorizeRoles } from 'src/presentation/middleware/auth.middleware';
import { uploadDocument } from 'src/presentation/middleware/upload-document.middleware';

export const createATSRoutes = (
  interviewController: ATSInterviewController,
  technicalTaskController: ATSTechnicalTaskController,
  offerController: ATSOfferController,
  commentController: ATSCommentController,
  compensationController: ATSCompensationController,
  activityController: ATSActivityController,
): Router => {
  const router = Router();

  router.use(authenticateToken);
  router.use(authorizeRoles('company'));

  router.post('/interviews', interviewController.scheduleInterview);
  router.put('/interviews/:id', interviewController.updateInterview);
  router.get('/:applicationId/interviews', interviewController.getInterviewsByApplication);

  router.post('/tasks', uploadDocument('document'), technicalTaskController.assignTechnicalTask);
  router.put('/tasks/:id', uploadDocument('document'), technicalTaskController.updateTechnicalTask);
  router.delete('/tasks/:id', technicalTaskController.deleteTechnicalTask);
  router.get('/:applicationId/tasks', technicalTaskController.getTechnicalTasksByApplication);

  router.post('/offers', uploadDocument('document'), offerController.uploadOffer);
  router.put('/offers/:id/status', offerController.updateOfferStatus);
  router.get('/:applicationId/offers', offerController.getOffersByApplication);

  router.post('/comments', commentController.addComment);
  router.get('/:applicationId/comments', commentController.getCommentsByApplication);

  router.get('/:applicationId/activities', activityController.getActivitiesByApplication);

  router.post('/:applicationId/compensation/initiate', compensationController.initiateCompensation);
  router.put('/:applicationId/compensation', compensationController.updateCompensation);
  router.get('/:applicationId/compensation', compensationController.getCompensation);
  router.post('/:applicationId/compensation/meetings', compensationController.scheduleCompensationMeeting);
  router.get('/:applicationId/compensation/meetings', compensationController.getCompensationMeetings);
  router.put('/:applicationId/compensation/meetings/:meetingId/status', compensationController.updateCompensationMeetingStatus);
  router.post('/:applicationId/compensation/notes', commentController.addCompensationNote);
  router.get('/:applicationId/compensation/notes', commentController.getCompensationNotes);

  return router;
};
