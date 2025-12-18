import { ApplicationStage } from '@/constants/enums';

export interface GetSeekerApplicationsParams {
  stage?: ApplicationStage;
  page?: number;
  limit?: number;
}

export interface GetCompanyApplicationsParams {
  job_id?: string;
  stage?: ApplicationStage;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UpdateApplicationStageRequest {
  stage: ApplicationStage;
  rejection_reason?: string;
}

export interface BulkUpdateApplicationStageRequest {
  application_ids: string[];
  stage: ApplicationStage;
}

export interface UpdateApplicationScoreRequest {
  score: number;
}

export interface AddInterviewRequest {
  date: string | Date;
  time: string;
  interview_type: string;
  location: string;
  interviewer_name?: string;
}

export interface UpdateInterviewRequest extends Partial<AddInterviewRequest> {
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
}

export interface AddInterviewFeedbackRequest {
  reviewer_name: string;
  rating?: number;
  comment: string;
}
