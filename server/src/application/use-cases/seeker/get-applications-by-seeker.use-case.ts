import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IGetApplicationsBySeekerUseCase } from '../../../domain/interfaces/use-cases/IJobApplicationUseCases';
import { JobApplication } from '../../../domain/entities/job-application.entity';
import type { ApplicationStage } from '../../../domain/entities/job-application.entity';

export interface PaginatedApplications {
  applications: JobApplication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class GetApplicationsBySeekerUseCase implements IGetApplicationsBySeekerUseCase {
  constructor(private readonly _jobApplicationRepository: IJobApplicationRepository) {}

  async execute(
    seekerId: string,
    filters: { stage?: ApplicationStage; page?: number; limit?: number },
  ): Promise<PaginatedApplications> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const result = await this._jobApplicationRepository.findBySeekerId(seekerId, {
      stage: filters.stage,
      page,
      limit,
    });

    return {
      applications: result.applications,
      pagination: {
        page,
        limit,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
      },
    };
  }
}



