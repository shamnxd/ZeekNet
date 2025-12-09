import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IGetApplicationsBySeekerUseCase } from '../../../domain/interfaces/use-cases/IJobApplicationUseCases';
import { GetApplicationsBySeekerRequestDto } from '../../dto/application/get-applications-by-seeker.dto';
import type { ApplicationStage } from '../../../domain/entities/job-application.entity';
import { JobApplicationMapper } from '../../mappers/job-application.mapper';
import { JobApplicationListResponseDto, PaginatedApplicationsResponseDto } from '../../dto/application/job-application-response.dto';
import { Types } from 'mongoose';

export class GetApplicationsBySeekerUseCase implements IGetApplicationsBySeekerUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
  ) {}

  async execute(data: GetApplicationsBySeekerRequestDto): Promise<PaginatedApplicationsResponseDto> {
    const { seekerId, ...filters } = data;
    if (!seekerId) throw new Error('Seeker ID is required');
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

    const applications: JobApplicationListResponseDto[] = [];
    for (const app of result.data) {
      const job = await this._jobPostingRepository.findById(app.jobId);
      applications.push(
        JobApplicationMapper.toListResponse(app, {
          jobTitle: job?.title,
          companyName: job?.companyName,
          companyLogo: job?.companyLogo,
        }),
      );
    }

    return {
      applications,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }
}



