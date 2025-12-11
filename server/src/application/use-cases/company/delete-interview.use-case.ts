import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IDeleteInterviewUseCase } from 'src/domain/interfaces/use-cases/interview/IDeleteInterviewUseCase';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { JobApplication } from '../../../domain/entities/job-application.entity';
import { JobApplicationMapper } from '../../mappers/job-application.mapper';
import { JobApplicationDetailResponseDto } from '../../dto/application/job-application-response.dto';
import { DeleteInterviewDto } from '../../dto/interview/delete-interview.dto';

export class DeleteInterviewUseCase implements IDeleteInterviewUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(dto: DeleteInterviewDto): Promise<JobApplicationDetailResponseDto> {
    const { userId, applicationId, interviewId } = dto;
    if (!userId) throw new Error('User ID is required');
    if (!applicationId) throw new Error('Application ID is required');
    if (!interviewId) throw new Error('Interview ID is required');
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
      throw new ValidationError('You can only manage interviews for your own job postings');
    }

    const interview = application.interviews.find((int) => int.id === interviewId);
    if (!interview) {
      throw new NotFoundError('Interview not found');
    }

    const updatedApplication = await this._jobApplicationRepository.deleteInterview(applicationId, interviewId);

    if (!updatedApplication) {
      throw new NotFoundError('Failed to delete interview');
    }

    return JobApplicationMapper.toDetailResponse(updatedApplication, undefined, {
      title: job.title,
      companyName: job.companyName,
      location: job.location,
      employmentTypes: job.employmentTypes,
    });
  }
}


