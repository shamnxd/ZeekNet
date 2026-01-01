import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IUpdateApplicationScoreUseCase } from 'src/domain/interfaces/use-cases/applications/IUpdateApplicationScoreUseCase';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { JobApplication } from '../../../domain/entities/job-application.entity';
import { JobApplicationMapper } from '../../mappers/job-application/job-application.mapper';
import { JobApplicationListResponseDto } from '../../dtos/job-application/responses/job-application-response.dto';
import { UpdateApplicationScoreDto } from '../../dtos/job-application/requests/update-application-score.dto';

export class UpdateApplicationScoreUseCase implements IUpdateApplicationScoreUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(dto: UpdateApplicationScoreDto): Promise<JobApplicationListResponseDto> {
    const { userId, applicationId, score } = dto;
    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    const application = await this._jobApplicationRepository.findById(applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    const job = await this._jobPostingRepository.findById(application.jobId);
    if (!job) {
      throw new NotFoundError('Job posting not found');
    }
    if (job.companyId !== companyProfile.id) {
      throw new ValidationError('You can only update applications for your own job postings');
    }

    if (score < 0 || score > 5) {
      throw new ValidationError('Score must be between 0 and 5');
    }

    const updatedApplication = await this._jobApplicationRepository.update(applicationId, { score });

    if (!updatedApplication) {
      throw new NotFoundError('Failed to update application score');
    }

    return JobApplicationMapper.toListResponse(updatedApplication, {
      jobTitle: job.title,
    });
  }
}






