import { PaginatedJobPostings, JobPostingFilters } from '../../entities/job-posting.entity';
import { JobPostingDetailResponseDto } from '../../../application/dto/job-posting/job-posting-response.dto';

export interface IGetAllJobPostingsUseCase {
  execute(query: JobPostingFilters): Promise<{
    jobs: Array<{
      id: string;
      title: string;
      viewCount: number;
      applicationCount: number;
      salary: { min: number; max: number };
      companyName: string;
      companyLogo?: string;
      createdAt: Date;
      location: string;
      description: string;
      skillsRequired: string[];
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
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