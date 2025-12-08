import type { ApplicationStage, InterviewSchedule, JobApplication } from '../../entities/job-application.entity';
import type { 
  JobApplicationListResponseDto, 
  JobApplicationDetailResponseDto, 
  PaginatedApplicationsResponseDto, 
} from '../../../application/dto/application/job-application-response.dto';
import { CreateJobApplicationData } from './applications/CreateJobApplicationData';
import { AddInterviewData } from './interview/AddInterviewData';
import { UpdateInterviewData } from './interview/UpdateInterviewData';
import { AddInterviewFeedbackData } from './interview/AddInterviewFeedbackData';

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
  execute(userId: string, applicationId: string, dto: AddInterviewData): Promise<JobApplicationDetailResponseDto>;
}

export interface IUpdateInterviewUseCase {
  execute(userId: string, applicationId: string, interviewId: string, dto: UpdateInterviewData): Promise<JobApplicationDetailResponseDto>;
}

export interface IDeleteInterviewUseCase {
  execute(userId: string, applicationId: string, interviewId: string): Promise<JobApplicationDetailResponseDto>;
}

export interface IAddInterviewFeedbackUseCase {
  execute(userId: string, applicationId: string, interviewId: string, dto: AddInterviewFeedbackData): Promise<JobApplicationDetailResponseDto>;
}

export interface IDeleteJobApplicationUseCase {
  execute(seekerId: string, applicationId: string): Promise<void>;
}


