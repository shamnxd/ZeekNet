import { ActivityType, ATSStage, ATSSubStage } from '../../enums/ats-stage.enum';

export interface LogInterviewActivityParams {
  applicationId: string;
  interviewId: string;
  interviewTitle?: string;
  status?: 'completed' | 'cancelled';
  rating?: number;
  feedback?: string;
  stage: ATSStage;
  subStage?: ATSSubStage;
  performedBy: string;
  performedByName: string;
}

export interface LogTechnicalTaskActivityParams {
  applicationId: string;
  taskId: string;
  taskTitle?: string;
  status?: 'submitted' | 'under_review' | 'completed' | 'cancelled';
  rating?: number;
  deadline?: string;
  title?: string;
  stage: ATSStage;
  subStage?: ATSSubStage;
  performedBy: string;
  performedByName: string;
  action?: 'updated' | 'deleted';
}

export interface LogOfferActivityParams {
  applicationId: string;
  offerId: string;
  status: 'signed' | 'declined';
  withdrawalReason?: string;
  stage: ATSStage;
  subStage?: ATSSubStage;
  performedBy: string;
  performedByName: string;
}

export interface LogCompensationActivityParams {
  applicationId: string;
  type: 'initiated' | 'updated' | 'approved';
  candidateExpected?: string;
  companyProposed?: string;
  finalAgreed?: string;
  expectedJoining?: string;
  benefits?: string[];
  approvedAt?: Date;
  stage: ATSStage;
  subStage?: ATSSubStage;
  performedBy: string;
  performedByName: string;
}

export interface LogCompensationMeetingActivityParams {
  applicationId: string;
  meetingId: string;
  type: 'scheduled' | 'status_updated';
  meetingType?: string;
  scheduledDate?: Date;
  status?: 'completed' | 'cancelled' | 'scheduled';
  stage: ATSStage;
  subStage?: ATSSubStage;
  performedBy: string;
  performedByName: string;
}

export interface LogStageChangeActivityParams {
  applicationId: string;
  previousStage: ATSStage;
  previousSubStage?: ATSSubStage;
  nextStage: ATSStage;
  nextSubStage?: ATSSubStage;
  performedBy: string;
  performedByName: string;
}

export interface LogSubStageChangeActivityParams {
  applicationId: string;
  previousSubStage: ATSSubStage;
  nextSubStage: ATSSubStage;
  stage: ATSStage;
  performedBy: string;
  performedByName: string;
}

export interface LogInterviewScheduledActivityParams {
  applicationId: string;
  interviewId: string;
  interviewTitle: string;
  interviewType: 'online' | 'offline';
  scheduledDate: Date;
  stage: ATSStage;
  subStage?: ATSSubStage;
  performedBy: string;
  performedByName: string;
}

export interface LogTaskAssignedActivityParams {
  applicationId: string;
  taskId: string;
  taskTitle: string;
  deadline: Date;
  stage: ATSStage;
  subStage?: ATSSubStage;
  performedBy: string;
  performedByName: string;
}

export interface LogOfferSentActivityParams {
  applicationId: string;
  offerId: string;
  offerAmount?: string;
  stage: ATSStage;
  subStage?: ATSSubStage;
  performedBy: string;
  performedByName: string;
}

export interface LogCommentAddedActivityParams {
  applicationId: string;
  commentId: string;
  comment: string;
  stage: ATSStage;
  subStage?: ATSSubStage;
  performedBy: string;
  performedByName: string;
}

export interface IActivityLoggerService {
  logInterviewActivity(params: LogInterviewActivityParams): Promise<void>;
  logTechnicalTaskActivity(params: LogTechnicalTaskActivityParams): Promise<void>;
  logOfferActivity(params: LogOfferActivityParams): Promise<void>;
  logCompensationActivity(params: LogCompensationActivityParams): Promise<void>;
  logCompensationMeetingActivity(params: LogCompensationMeetingActivityParams): Promise<void>;
  logStageChangeActivity(params: LogStageChangeActivityParams): Promise<void>;
  logSubStageChangeActivity(params: LogSubStageChangeActivityParams): Promise<void>;
  logInterviewScheduledActivity(params: LogInterviewScheduledActivityParams): Promise<void>;
  logTaskAssignedActivity(params: LogTaskAssignedActivityParams): Promise<void>;
  logOfferSentActivity(params: LogOfferSentActivityParams): Promise<void>;
  logCommentAddedActivity(params: LogCommentAddedActivityParams): Promise<void>;
}

