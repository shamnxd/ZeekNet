import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { INotificationRepository } from '../../../domain/interfaces/repositories/notification/INotificationRepository';
import { IAddInterviewUseCase, AddInterviewData } from '../../../domain/interfaces/use-cases/IJobApplicationUseCases';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { JobApplication } from '../../../domain/entities/job-application.entity';
import { notificationService } from '../../../infrastructure/di/notificationDi';
import { NotificationType } from '../../../domain/entities/notification.entity';
import { JobApplicationMapper } from '../../mappers/job-application.mapper';
import { JobApplicationDetailResponseDto } from '../../dto/job-application/job-application-response.dto';

export class AddInterviewUseCase implements IAddInterviewUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string, applicationId: string, dto: AddInterviewData): Promise<JobApplicationDetailResponseDto> {
    // DTO -> Domain mapping (moved from controller)
    const interviewDate = dto.date instanceof Date ? dto.date : new Date(dto.date);
    const interviewData = {
      date: interviewDate,
      time: dto.time,
      interviewType: dto.interview_type,
      location: dto.location,
      interviewerName: dto.interviewer_name,
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

    if (interviewDate < new Date()) {
      throw new ValidationError('Interview date must be in the future');
    }

    const updatedApplication = await this._jobApplicationRepository.addInterview(applicationId, {
      date: interviewDate,
      time: interviewData.time,
      interviewType: interviewData.interviewType,
      location: interviewData.location,
      interviewerName: interviewData.interviewerName,
      status: 'scheduled',
    });

    if (!updatedApplication) {
      throw new NotFoundError('Failed to add interview');
    }

    const newInterview = updatedApplication.interviews[updatedApplication.interviews.length - 1];

    await notificationService.sendNotification({
      user_id: application.seekerId,
      type: NotificationType.INTERVIEW_SCHEDULED,
      title: 'Interview Scheduled',
      message: `An interview has been scheduled for ${job.title}`,
      data: {
        job_id: job.id,
        application_id: application.id,
        interview_id: newInterview.id,
        interview_date: interviewDate.toISOString(),
        interview_time: interviewData.time,
        interview_type: interviewData.interviewType,
        location: interviewData.location,
        interviewer_name: interviewData.interviewerName,
        job_title: job.title,
      },
    },
    );

    return JobApplicationMapper.toDetailResponse(updatedApplication, undefined, {
      title: job.title,
      companyName: job.companyName,
      location: job.location,
      employmentTypes: job.employmentTypes,
    });
  }
}
