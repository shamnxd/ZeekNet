import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IGetSeekerApplicationDetailsUseCase } from '../../../domain/interfaces/use-cases/IJobApplicationUseCases';
import { GetApplicationDetailsRequestDto } from '../../dto/application/get-application-details.dto';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { JobApplicationMapper } from '../../mappers/job-application.mapper';
import { JobApplicationDetailResponseDto } from '../../dto/application/job-application-response.dto';

export class GetSeekerApplicationDetailsUseCase implements IGetSeekerApplicationDetailsUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
  ) {}

  async execute(data: GetApplicationDetailsRequestDto): Promise<JobApplicationDetailResponseDto> {
    const { seekerId, applicationId } = data;
    if (!seekerId) throw new Error('Seeker ID is required');
    if (!applicationId) throw new Error('Application ID is required');
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
      {
        title: job?.title,
        companyName: job?.companyName,
        companyLogo: job?.companyLogo,
        location: job?.location,
        employmentTypes: job?.employmentTypes,
      },
    );
  }
}



