import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IGetApplicationsBySeekerUseCase } from '../../../domain/interfaces/use-cases/IJobApplicationUseCases';
import { JobApplication } from '../../../domain/entities/job-application.entity';
import type { ApplicationStage } from '../../../domain/entities/job-application.entity';
import { Types } from 'mongoose';

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

    const query: Record<string, unknown> = { seeker_id: new Types.ObjectId(seekerId) };
    if (filters.stage) query.stage = filters.stage;

    const result = await this._jobApplicationRepository.paginate(query, {
      page,
      limit,
      sortBy: 'applied_date',
      sortOrder: 'desc',
    });

    return {
      applications: result.data,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }
}



