import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { INotificationRepository } from '../../../domain/interfaces/repositories/notification/INotificationRepository';
import { IAddInterviewUseCase, AddInterviewData } from '../../../domain/interfaces/use-cases/IJobApplicationUseCases';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { JobApplication } from '../../../domain/entities/job-application.entity';
import { notificationService } from '../../../infrastructure/services/notification.service';
import { NotificationType } from '../../../infrastructure/database/mongodb/models/notification.model';

export class AddInterviewUseCase implements IAddInterviewUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string, applicationId: string, interviewData: AddInterviewData): Promise<JobApplication> {  
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

    const interviewDate = interviewData.date instanceof Date ? interviewData.date : new Date(interviewData.date);
    if (interviewDate < new Date()) {
      throw new ValidationError('Interview date must be in the future');
    }

    const updatedApplication = await this._jobApplicationRepository.addInterview(applicationId, {
      date: interviewDate,
      time: interviewData.time,
      interviewType: interviewData.interview_type,
      location: interviewData.location,
      interviewerName: interviewData.interviewer_name,
      status: 'scheduled',
    });

    if (!updatedApplication) {
      throw new NotFoundError('Failed to add interview');
    }

    const newInterview = updatedApplication.interviews[updatedApplication.interviews.length - 1];

    await notificationService.sendNotification(
      this._notificationRepository,
      {
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
          interview_type: interviewData.interview_type,
          location: interviewData.location,
          interviewer_name: interviewData.interviewer_name,
          job_title: job.title,
        },
      },
    );

    return updatedApplication;
  }
}


