import type { JobApplication, InterviewSchedule, InterviewFeedback, ApplicationStage } from '../../../entities/job-application.entity';
import { IBaseRepository } from '../IBaseRepository';
import { CreateInput } from '../../../types/common.types';

export interface PaginatedApplications {
  applications: JobApplication[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IJobApplicationRepository extends IBaseRepository<JobApplication> {
  addInterview(applicationId: string, interviewData: Omit<InterviewSchedule, 'id' | 'created_at' | 'updated_at'>): Promise<JobApplication | null>;
  addInterviewFeedback(applicationId: string, interviewId: string, feedbackData: InterviewFeedback): Promise<JobApplication | null>;
  deleteInterview(applicationId: string, interviewId: string): Promise<JobApplication | null>;
  updateInterview(applicationId: string, interviewId: string, interviewData: Partial<InterviewSchedule>): Promise<JobApplication | null>;
}


