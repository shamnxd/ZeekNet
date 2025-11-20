import type { JobApplication, InterviewSchedule, InterviewFeedback, ApplicationStage } from '../../../entities/job-application.entity';
import { IBaseRepository } from '../IBaseRepository';

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
  // Interview management
  addInterview(applicationId: string, interviewData: Omit<InterviewSchedule, 'id' | 'created_at' | 'updated_at'>): Promise<JobApplication | null>;
  addInterviewFeedback(applicationId: string, interviewId: string, feedbackData: InterviewFeedback): Promise<JobApplication | null>;
  deleteInterview(applicationId: string, interviewId: string): Promise<JobApplication | null>;
  updateInterview(applicationId: string, interviewId: string, interviewData: Partial<InterviewSchedule>): Promise<JobApplication | null>;
  
  // Complex queries with pagination
  findByCompanyId(companyId: string, filters: {
    stage?: ApplicationStage;
    search?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedApplications>;
  
  findByJobId(jobId: string, filters: {
    stage?: ApplicationStage;
    search?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedApplications>;
  
  findBySeekerId(seekerId: string, filters: {
    stage?: ApplicationStage;
    page: number;
    limit: number;
  }): Promise<PaginatedApplications>;
  
  // Score and stage updates
  updateScore(applicationId: string, score: number): Promise<JobApplication | null>;
  updateStage(applicationId: string, stage: ApplicationStage, rejectionReason?: string): Promise<JobApplication | null>;
}


