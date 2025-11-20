import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IDeleteInterviewUseCase } from '../../../domain/interfaces/use-cases/IJobApplicationUseCases';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { JobApplication } from '../../../domain/entities/job-application.entity';

export class DeleteInterviewUseCase implements IDeleteInterviewUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(userId: string, applicationId: string, interviewId: string): Promise<JobApplication> {
    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    const application = await this._jobApplicationRepository.findById(applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    const job = await this._jobPostingRepository.findById(application.job_id);
    if (!job) {
      throw new NotFoundError('Job posting not found');
    }
    if (job.company_id !== companyProfile.id) {
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

    return updatedApplication;
  }
}


