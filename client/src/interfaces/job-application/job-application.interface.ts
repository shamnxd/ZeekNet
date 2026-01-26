import { ApplicationStage } from '@/constants/enums';
import { ATSStage } from '@/constants/ats-stages';

export interface GetSeekerApplicationsParams {
  stage?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetCompanyApplicationsParams {
  stage?: ApplicationStage | ATSStage | string;
  search?: string;
  page?: number;
  limit?: number;
  job_id?: string;
}

export interface UpdateApplicationStageRequest {
  stage: ApplicationStage | ATSStage | string;
  rejection_reason?: string;
}

export interface BulkUpdateApplicationStageRequest {
  application_ids: string[];
  stage: ApplicationStage | ATSStage | string;
}

export interface UpdateApplicationScoreRequest {
  score: number;
}

export interface AddInterviewRequest {
  date: string | Date;
  time: string;
  interview_type: string;
  location: string;
}

export interface UpdateInterviewRequest extends Partial<AddInterviewRequest> {
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
}

export interface AddInterviewFeedbackRequest {
  reviewer_name: string;
  rating?: number;
  comment: string;
}
