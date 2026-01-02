import { v4 as uuidv4 } from 'uuid';
import { IActivityLoggerService, LogInterviewActivityParams, LogTechnicalTaskActivityParams, LogOfferActivityParams, LogCompensationActivityParams, LogCompensationMeetingActivityParams, LogStageChangeActivityParams, LogSubStageChangeActivityParams, LogInterviewScheduledActivityParams, LogTaskAssignedActivityParams, LogOfferSentActivityParams, LogCommentAddedActivityParams } from 'src/domain/interfaces/services/IActivityLoggerService';
import { IATSActivityRepository } from 'src/domain/interfaces/repositories/ats/IATSActivityRepository';
import { ATSActivity } from 'src/domain/entities/ats-activity.entity';
import { ActivityType } from 'src/domain/enums/ats-stage.enum';

export class ActivityLoggerService implements IActivityLoggerService {
  constructor(private activityRepository: IATSActivityRepository) {}

  async logInterviewActivity(params: LogInterviewActivityParams): Promise<void> {
    const { applicationId, interviewId, interviewTitle, status, rating, feedback, stage, subStage, performedBy, performedByName } = params;

    
    let activityType: ActivityType | null = null;
    let activityTitle = 'Interview Updated';
    let activityDescription = 'Interview details updated';

    if (status === 'completed') {
      activityType = ActivityType.INTERVIEW_COMPLETED;
      activityTitle = 'Interview Completed';
      activityDescription = interviewTitle ? `${interviewTitle} completed` : 'Interview completed';
    } else if (status === 'cancelled') {
      activityType = ActivityType.INTERVIEW_CANCELLED;
      activityTitle = 'Interview Cancelled';
      activityDescription = interviewTitle ? `${interviewTitle} cancelled` : 'Interview cancelled';
    }

    
    const hasFeedbackOrRating = rating !== undefined || feedback;
    const shouldLogFeedbackUpdate = hasFeedbackOrRating && !status;

    if (activityType) {
      const activity = ATSActivity.create({
        id: uuidv4(),
        applicationId,
        type: activityType,
        title: activityTitle,
        description: activityDescription,
        performedBy,
        performedByName,
        stage,
        subStage,
        metadata: {
          interviewId,
          status,
          rating,
          feedback,
        },
      });

      await this.activityRepository.create(activity);
    } else if (shouldLogFeedbackUpdate) {
      
      const feedbackDescription = rating && feedback
        ? `Interview rated ${rating}/5 with feedback`
        : rating
          ? `Interview rated ${rating}/5`
          : 'Interview feedback added';
      
      const activity = ATSActivity.create({
        id: uuidv4(),
        applicationId,
        type: ActivityType.INTERVIEW_COMPLETED, 
        title: 'Interview Feedback Added',
        description: feedbackDescription,
        performedBy,
        performedByName,
        stage,
        subStage,
        metadata: {
          interviewId,
          rating,
          hasFeedback: !!feedback,
        },
      });

      await this.activityRepository.create(activity);
    }
  }

  async logTechnicalTaskActivity(params: LogTechnicalTaskActivityParams): Promise<void> {
    const { applicationId, taskId, taskTitle, status, rating, deadline, title, stage, subStage, performedBy, performedByName, action } = params;

    if (action === 'deleted') {
      const activity = ATSActivity.create({
        id: uuidv4(),
        applicationId,
        type: ActivityType.TASK_ASSIGNED, 
        title: 'Technical Task Deleted',
        description: taskTitle ? `${taskTitle} deleted` : 'Technical task deleted',
        performedBy,
        performedByName,
        stage,
        subStage,
        metadata: {
          taskId,
          action: 'deleted',
        },
      });

      await this.activityRepository.create(activity);
      return;
    }

    
    let activityType: ActivityType | null = null;
    let activityTitle = 'Technical Task Updated';
    let activityDescription = 'Technical task details updated';

    if (status === 'submitted') {
      activityType = ActivityType.TASK_SUBMITTED;
      activityTitle = 'Technical Task Submitted';
      activityDescription = taskTitle ? `${taskTitle} submitted` : 'Technical task submitted';
    } else if (status === 'under_review') {
      activityType = ActivityType.TASK_SUBMITTED; 
      activityTitle = 'Technical Task Under Review';
      activityDescription = taskTitle ? `${taskTitle} is now under review` : 'Technical task is now under review';
    } else if (status === 'completed') {
      activityType = ActivityType.TASK_COMPLETED;
      activityTitle = 'Technical Task Completed';
      activityDescription = taskTitle ? `${taskTitle} completed` : 'Technical task completed';
    } else if (status === 'cancelled') {
      activityType = ActivityType.TASK_ASSIGNED; 
      activityTitle = 'Technical Task Cancelled';
      activityDescription = taskTitle ? `${taskTitle} cancelled` : 'Technical task cancelled';
    }

    
    const hasDetailChanges = deadline || title || rating;
    const shouldLogDetailUpdate = hasDetailChanges && !status;

    if (activityType) {
      const activity = ATSActivity.create({
        id: uuidv4(),
        applicationId,
        type: activityType,
        title: activityTitle,
        description: activityDescription,
        performedBy,
        performedByName,
        stage,
        subStage,
        metadata: {
          taskId,
          status,
          rating,
        },
      });

      await this.activityRepository.create(activity);
    } else if (shouldLogDetailUpdate) {
      
      const updateDescription = deadline 
        ? `Task deadline updated to ${new Date(deadline).toLocaleDateString()}`
        : title
          ? `Task title updated to ${title}`
          : rating
            ? `Task rating updated to ${rating}`
            : 'Task details updated';
      
      const activity = ATSActivity.create({
        id: uuidv4(),
        applicationId,
        type: ActivityType.TASK_ASSIGNED, 
        title: 'Technical Task Updated',
        description: updateDescription,
        performedBy,
        performedByName,
        stage,
        subStage,
        metadata: {
          taskId,
          deadline,
          title,
          rating,
        },
      });

      await this.activityRepository.create(activity);
    }
  }

  async logOfferActivity(params: LogOfferActivityParams): Promise<void> {
    const { applicationId, offerId, status, withdrawalReason, stage, subStage, performedBy, performedByName } = params;

    
    let activityType: ActivityType | null = null;
    let activityTitle = 'Offer Status Updated';
    let activityDescription = 'Offer status updated';

    if (status === 'signed') {
      activityType = ActivityType.OFFER_ACCEPTED;
      activityTitle = 'Offer Accepted';
      activityDescription = 'Offer letter accepted by candidate';
    } else if (status === 'declined') {
      activityType = ActivityType.OFFER_DECLINED;
      
      
      if (withdrawalReason) {
        activityTitle = 'Offer Withdrawn';
        activityDescription = `Offer withdrawn by company. Reason: ${withdrawalReason}`;
      } else {
        activityTitle = 'Offer Declined';
        activityDescription = 'Offer letter declined by candidate';
      }
    }

    if (activityType) {
      const activity = ATSActivity.create({
        id: uuidv4(),
        applicationId,
        type: activityType,
        title: activityTitle,
        description: activityDescription,
        performedBy,
        performedByName,
        stage,
        subStage,
        metadata: {
          offerId,
          status,
          ...(withdrawalReason && { withdrawalReason, withdrawnBy: 'company' }),
        },
      });

      await this.activityRepository.create(activity);
    }
  }

  async logCompensationActivity(params: LogCompensationActivityParams): Promise<void> {
    const { applicationId, type, candidateExpected, companyProposed, finalAgreed, expectedJoining, benefits, approvedAt, stage, subStage, performedBy, performedByName } = params;

    let activityType: ActivityType;
    let activityTitle: string;
    let activityDescription: string;

    if (type === 'initiated') {
      activityType = ActivityType.COMPENSATION_INITIATED;
      activityTitle = 'Compensation Discussion Initiated';
      activityDescription = `Compensation discussion started. Candidate expects: ${candidateExpected}`;
    } else if (type === 'approved') {
      activityType = ActivityType.COMPENSATION_APPROVED;
      activityTitle = 'Compensation Approved';
      activityDescription = `Compensation approved. Final agreed: ${finalAgreed || companyProposed || 'N/A'}`;
    } else {
      activityType = ActivityType.COMPENSATION_UPDATED;
      activityTitle = 'Compensation Updated';
      activityDescription = candidateExpected
        ? `Expected salary updated to: ${candidateExpected}`
        : companyProposed 
          ? `Compensation updated. Proposed: ${companyProposed}`
          : 'Compensation details updated';
    }

    const activity = ATSActivity.create({
      id: uuidv4(),
      applicationId,
      type: activityType,
      title: activityTitle,
      description: activityDescription,
      performedBy,
      performedByName,
      stage,
      subStage,
      metadata: {
        candidateExpected,
        companyProposed,
        finalAgreed,
        expectedJoining,
        benefits,
        approvedAt,
      },
    });

    await this.activityRepository.create(activity);
  }

  async logCompensationMeetingActivity(params: LogCompensationMeetingActivityParams): Promise<void> {
    const { applicationId, meetingId, type, meetingType, scheduledDate, status, stage, subStage, performedBy, performedByName } = params;

    let activityTitle: string;
    let activityDescription: string;

    if (type === 'scheduled') {
      activityTitle = 'Compensation Meeting Scheduled';
      activityDescription = scheduledDate 
        ? `${meetingType} meeting scheduled for ${scheduledDate.toLocaleDateString()}`
        : `${meetingType} meeting scheduled`;
    } else {
      
      activityTitle = `Compensation Meeting ${status === 'completed' ? 'Completed' : status === 'cancelled' ? 'Cancelled' : 'Updated'}`;
      activityDescription = `Meeting status updated to ${status}`;
    }

    const activity = ATSActivity.create({
      id: uuidv4(),
      applicationId,
      type: ActivityType.COMPENSATION_MEETING_SCHEDULED,
      title: activityTitle,
      description: activityDescription,
      performedBy,
      performedByName,
      stage,
      subStage,
      metadata: {
        meetingId,
        type: meetingType,
        scheduledDate: scheduledDate?.toISOString(),
        status,
      },
    });

    await this.activityRepository.create(activity);
  }

  async logStageChangeActivity(params: LogStageChangeActivityParams): Promise<void> {
    const { applicationId, previousStage, previousSubStage, nextStage, nextSubStage, performedBy, performedByName } = params;

    const activity = ATSActivity.create({
      id: uuidv4(),
      applicationId,
      type: ActivityType.STAGE_CHANGE,
      title: 'Stage Changed',
      description: `Moved from ${previousStage} to ${nextStage}`,
      performedBy,
      performedByName,
      stage: nextStage,
      subStage: nextSubStage,
      metadata: {
        previousStage,
        previousSubStage,
        nextStage,
        nextSubStage,
      },
    });

    await this.activityRepository.create(activity);
  }

  async logSubStageChangeActivity(params: LogSubStageChangeActivityParams): Promise<void> {
    const { applicationId, previousSubStage, nextSubStage, stage, performedBy, performedByName } = params;

    const activity = ATSActivity.create({
      id: uuidv4(),
      applicationId,
      type: ActivityType.SUBSTAGE_CHANGE,
      title: 'Sub-Stage Changed',
      description: `Changed from ${previousSubStage} to ${nextSubStage}`,
      performedBy,
      performedByName,
      stage,
      subStage: nextSubStage,
      metadata: {
        previousSubStage,
        nextSubStage,
      },
    });

    await this.activityRepository.create(activity);
  }

  async logInterviewScheduledActivity(params: LogInterviewScheduledActivityParams): Promise<void> {
    const { applicationId, interviewId, interviewTitle, interviewType, scheduledDate, stage, subStage, performedBy, performedByName } = params;

    const activity = ATSActivity.create({
      id: uuidv4(),
      applicationId,
      type: ActivityType.INTERVIEW_SCHEDULED,
      title: 'Interview Scheduled',
      description: `${interviewTitle} scheduled for ${scheduledDate.toLocaleDateString()}`,
      performedBy,
      performedByName,
      stage,
      subStage,
      metadata: {
        interviewId,
        interviewType,
        scheduledDate,
      },
    });

    await this.activityRepository.create(activity);
  }

  async logTaskAssignedActivity(params: LogTaskAssignedActivityParams): Promise<void> {
    const { applicationId, taskId, taskTitle, deadline, stage, subStage, performedBy, performedByName } = params;

    const activity = ATSActivity.create({
      id: uuidv4(),
      applicationId,
      type: ActivityType.TASK_ASSIGNED,
      title: 'Technical Task Assigned',
      description: `${taskTitle} - Due: ${deadline.toLocaleDateString()}`,
      performedBy,
      performedByName,
      stage,
      subStage,
      metadata: {
        taskId,
        deadline,
      },
    });

    await this.activityRepository.create(activity);
  }

  async logOfferSentActivity(params: LogOfferSentActivityParams): Promise<void> {
    const { applicationId, offerId, offerAmount, stage, subStage, performedBy, performedByName } = params;

    const activity = ATSActivity.create({
      id: uuidv4(),
      applicationId,
      type: ActivityType.OFFER_SENT,
      title: 'Offer Letter Sent',
      description: offerAmount 
        ? `Offer sent with amount: ${offerAmount}`
        : 'Offer letter sent to candidate',
      performedBy,
      performedByName,
      stage,
      subStage,
      metadata: {
        offerId,
        offerAmount,
      },
    });

    await this.activityRepository.create(activity);
  }

  async logCommentAddedActivity(params: LogCommentAddedActivityParams): Promise<void> {
    const { applicationId, commentId, comment, stage, subStage, performedBy, performedByName } = params;

    const activity = ATSActivity.create({
      id: uuidv4(),
      applicationId,
      type: ActivityType.COMMENT_ADDED,
      title: 'Comment Added',
      description: comment.substring(0, 100) + (comment.length > 100 ? '...' : ''),
      performedBy,
      performedByName,
      stage,
      subStage,
      metadata: {
        commentId,
      },
    });

    await this.activityRepository.create(activity);
  }
}

