import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IAddInterviewFeedbackUseCase } from '../../../domain/interfaces/use-cases/IJobApplicationUseCases';
import { AddInterviewFeedbackData } from 'src/domain/interfaces/use-cases/interview/AddInterviewFeedbackData';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { JobApplication } from '../../../domain/entities/job-application.entity';
import { JobApplicationMapper } from '../../mappers/job-application.mapper';
import { JobApplicationDetailResponseDto } from '../../dto/application/job-application-response.dto';

export class AddInterviewFeedbackUseCase implements IAddInterviewFeedbackUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(userId: string, applicationId: string, interviewId: string, dto: AddInterviewFeedbackData): Promise<JobApplicationDetailResponseDto> {
    const feedbackData = {
      reviewer_name: dto.reviewer_name,
      rating: dto.rating,
      comment: dto.comment,
    };

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

    if (interview.status !== 'completed') {
      throw new ValidationError('Feedback can only be added for completed interviews');
    }

    if (interview.feedback) {
      throw new ValidationError('Feedback already exists for this interview');
    }

    const updatedApplication = await this._jobApplicationRepository.addInterviewFeedback(applicationId, interviewId, {
      reviewerName: feedbackData.reviewer_name,
      rating: feedbackData.rating,
      comment: feedbackData.comment,
      reviewedAt: new Date(),
    });

    if (!updatedApplication) {
      throw new NotFoundError('Failed to add interview feedback');
    }

    return JobApplicationMapper.toDetailResponse(updatedApplication, undefined, {
      title: job.title,
      companyName: job.companyName,
      location: job.location,
      employmentTypes: job.employmentTypes,
    });
  }
}



