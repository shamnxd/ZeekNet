import { PaginatedJobPostings, JobPostingFilters } from '../../entities/job-posting.entity';
import { JobPostingDetailResponseDto } from '../../../application/dto/job-posting/job-posting-response.dto';
import { GetAllJobPostingsResponseDto } from 'src/application/dto/public/public-job-postings-response.dto';

export interface IGetAllJobPostingsUseCase {
  execute(query: JobPostingFilters): Promise<GetAllJobPostingsResponseDto>;
}

export interface IGetJobPostingForPublicUseCase {
  execute(jobId: string, userId?: string): Promise<JobPostingDetailResponseDto>;
}

export interface IGetPublicSkillsUseCase {
  execute(): Promise<string[]>;
}

export interface IGetPublicJobCategoriesUseCase {
  execute(): Promise<string[]>;
}

export interface IGetPublicJobRolesUseCase {
  execute(): Promise<string[]>;
}