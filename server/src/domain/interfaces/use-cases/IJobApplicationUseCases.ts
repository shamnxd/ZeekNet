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
import { DeleteInterviewData } from './interview/DeleteInterviewData';
import { ApplicationFiltersRequestDto } from 'src/application/dto/application/application-filters.dto';
import { UpdateApplicationStageRequestDto } from 'src/application/dto/application/update-application-stage.dto';
import { GetApplicationsByJobRequestDto } from 'src/application/dto/application/get-applications-by-job.dto';
import { GetApplicationDetailsRequestDto } from 'src/application/dto/application/get-application-details.dto';
import { UpdateScoreRequestDto } from 'src/application/dto/application/update-score.dto';
import { GetApplicationsBySeekerRequestDto } from 'src/application/dto/application/get-applications-by-seeker.dto';

export interface ICreateJobApplicationUseCase {
  execute(data: CreateJobApplicationData): Promise<{ id: string }>;
}

export interface IGetApplicationsByJobUseCase {
  execute(data: GetApplicationsByJobRequestDto): Promise<PaginatedApplicationsResponseDto>;
}

export interface IGetApplicationsBySeekerUseCase {
  execute(data: GetApplicationsBySeekerRequestDto): Promise<PaginatedApplicationsResponseDto>;
}

export interface IGetApplicationsByCompanyUseCase {
  execute(data: ApplicationFiltersRequestDto): Promise<PaginatedApplicationsResponseDto>;
}

export interface IGetApplicationDetailsUseCase {
  execute(data: GetApplicationDetailsRequestDto): Promise<JobApplicationDetailResponseDto>;
}

export interface IGetSeekerApplicationDetailsUseCase {
  execute(data: GetApplicationDetailsRequestDto): Promise<JobApplicationDetailResponseDto>;
}

export interface IUpdateApplicationStageUseCase {
  execute(data: UpdateApplicationStageRequestDto): Promise<JobApplicationListResponseDto>;
}

export interface IUpdateApplicationScoreUseCase {
  execute(data: UpdateScoreRequestDto): Promise<JobApplicationListResponseDto>;
}

export interface IAddInterviewUseCase {
  execute(data: AddInterviewData): Promise<JobApplicationDetailResponseDto>;
}

export interface IUpdateInterviewUseCase {
  execute(data: UpdateInterviewData): Promise<JobApplicationDetailResponseDto>;
}

export interface IDeleteInterviewUseCase {
  execute(userId: string, applicationId: string, interviewId: string): Promise<JobApplicationDetailResponseDto>;
}

export interface IAddInterviewFeedbackUseCase {
  execute(data: AddInterviewFeedbackData): Promise<JobApplicationDetailResponseDto>;
}

export interface IDeleteJobApplicationUseCase {
  execute(seekerId: string, applicationId: string): Promise<void>;
}


