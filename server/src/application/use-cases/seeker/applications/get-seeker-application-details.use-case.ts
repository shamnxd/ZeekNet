import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IGetSeekerApplicationDetailsUseCase } from 'src/domain/interfaces/use-cases/seeker/applications/IGetSeekerApplicationDetailsUseCase';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { JobApplicationMapper } from 'src/application/mappers/job-application/job-application.mapper';
import { JobApplicationDetailResponseDto } from 'src/application/dtos/seeker/applications/responses/job-application-response.dto';

export class GetSeekerApplicationDetailsUseCase implements IGetSeekerApplicationDetailsUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
  ) {}

  async execute(userId: string, applicationId: string): Promise<JobApplicationDetailResponseDto> {
    const seekerId = userId;
    const application = await this._jobApplicationRepository.findById(applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    if (application.seekerId !== seekerId) {
      throw new ValidationError('You can only view your own applications');
    }

    const job = await this._jobPostingRepository.findById(application.jobId);

    return JobApplicationMapper.toDetailResponse(
      application,
      undefined,
      job,
    );
  }
}







