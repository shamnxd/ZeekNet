import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { INotificationRepository } from '../../../domain/interfaces/repositories/notification/INotificationRepository';
import { IUpdateInterviewUseCase, UpdateInterviewData } from '../../../domain/interfaces/use-cases/IJobApplicationUseCases';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { JobApplication } from '../../../domain/entities/job-application.entity';
import { notificationService } from '../../../infrastructure/di/notificationDi';
import { NotificationType } from '../../../domain/entities/notification.entity';

export class UpdateInterviewUseCase implements IUpdateInterviewUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string, applicationId: string, interviewId: string, interviewData: UpdateInterviewData): Promise<JobApplication> {

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

    const updateData: Partial<UpdateInterviewData> = {};
    if (interviewData.date !== undefined) {
      updateData.date = interviewData.date instanceof Date ? interviewData.date : new Date(interviewData.date);
    }
    if (interviewData.time !== undefined) {
      updateData.time = interviewData.time;
    }
    if (interviewData.interviewType !== undefined) {
      updateData.interviewType = interviewData.interviewType;
    }
    if (interviewData.location !== undefined) {
      updateData.location = interviewData.location;
    }
    if (interviewData.interviewerName !== undefined) {
      updateData.interviewerName = interviewData.interviewerName;
    }
    if (interviewData.status !== undefined) {
      updateData.status = interviewData.status;
    }

    const updatedApplication = await this._jobApplicationRepository.updateInterview(applicationId, interviewId, updateData);

    if (!updatedApplication) {
      throw new NotFoundError('Failed to update interview');
    }

    const updatedInterview = updatedApplication.interviews.find((int) => int.id === interviewId);

    if (updatedInterview) {
      await notificationService.sendNotification({
        user_id: application.seekerId,
        type: NotificationType.INTERVIEW_SCHEDULED,
        title: 'Interview Updated',
        message: `Interview details for ${job.title} have been updated`,
        data: {
          job_id: job.id,
          application_id: application.id,
          interview_id: interviewId,
          interview_date: updatedInterview.date?.toISOString(),
          interview_time: updatedInterview.time,
          interview_type: updatedInterview.interviewType,
          location: updatedInterview.location,
          interviewer_name: updatedInterview.interviewerName,
            status: updatedInterview.status,
            job_title: job.title,
          },
        },
      );
    }

    return updatedApplication;
  }
}


