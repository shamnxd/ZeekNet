import type { ApplicationStage, InterviewSchedule, JobApplication } from '../../entities/job-application.entity';
import type { 
  JobApplicationListResponseDto, 
  JobApplicationDetailResponseDto, 
  PaginatedApplicationsResponseDto, 
} from '../../../application/dto/job-application/job-application-response.dto';

export interface CreateJobApplicationData {
  job_id: string;
  cover_letter: string;
  resume_url: string;
  resume_filename: string;
}

export type AddInterviewData = Omit<InterviewSchedule, 'id' | 'created_at' | 'updated_at' | 'feedback'>;
export type UpdateInterviewData = Partial<Omit<InterviewSchedule, 'id' | 'created_at' | 'updated_at' | 'feedback'>>;
export interface AddInterviewFeedbackData {
  reviewer_name: string;
  rating?: number;
  comment: string;
}

// DTO types for use case interfaces
export type AddInterviewRequestDto = import('../../../application/dto/job-application/add-interview.dto').AddInterviewRequestDto;
export type UpdateInterviewRequestDto = import('../../../application/dto/job-application/update-interview.dto').UpdateInterviewRequestDto;
export type AddInterviewFeedbackRequestDto = import('../../../application/dto/job-application/add-interview-feedback.dto').AddInterviewFeedbackRequestDto;

export interface ICreateJobApplicationUseCase {
  execute(seekerId: string, data: CreateJobApplicationData): Promise<{ id: string }>;
}

export interface IGetApplicationsByJobUseCase {
  execute(userId: string, jobId: string, filters: { stage?: ApplicationStage; search?: string; page?: number; limit?: number }): Promise<PaginatedApplicationsResponseDto>;
}

export interface IGetApplicationsBySeekerUseCase {
  execute(seekerId: string, filters: { stage?: ApplicationStage; page?: number; limit?: number }): Promise<PaginatedApplicationsResponseDto>;
}

export interface IGetApplicationsByCompanyUseCase {
  execute(userId: string, filters: { job_id?: string; stage?: ApplicationStage; search?: string; page?: number; limit?: number }): Promise<PaginatedApplicationsResponseDto>;
}

export interface IGetApplicationDetailsUseCase {
  execute(userId: string, applicationId: string): Promise<JobApplicationDetailResponseDto>;
}

export interface IGetSeekerApplicationDetailsUseCase {
  execute(seekerId: string, applicationId: string): Promise<JobApplicationDetailResponseDto>;
}

export interface IUpdateApplicationStageUseCase {
  execute(userId: string, applicationId: string, stage: ApplicationStage, rejectionReason?: string): Promise<JobApplicationListResponseDto>;
}

export interface IUpdateApplicationScoreUseCase {
  execute(userId: string, applicationId: string, score: number): Promise<JobApplicationListResponseDto>;
}

export interface IAddInterviewUseCase {
  execute(userId: string, applicationId: string, dto: AddInterviewRequestDto): Promise<JobApplicationDetailResponseDto>;
}

export interface IUpdateInterviewUseCase {
  execute(userId: string, applicationId: string, interviewId: string, dto: UpdateInterviewRequestDto): Promise<JobApplicationDetailResponseDto>;
}

export interface IDeleteInterviewUseCase {
  execute(userId: string, applicationId: string, interviewId: string): Promise<JobApplicationDetailResponseDto>;
}

export interface IAddInterviewFeedbackUseCase {
  execute(userId: string, applicationId: string, interviewId: string, dto: AddInterviewFeedbackRequestDto): Promise<JobApplicationDetailResponseDto>;
}

export interface IDeleteJobApplicationUseCase {
  execute(seekerId: string, applicationId: string): Promise<void>;
}


