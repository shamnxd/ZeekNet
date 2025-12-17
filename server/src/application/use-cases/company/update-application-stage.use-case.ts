import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { ApplicationStage } from '../../../domain/enums/application-stage.enum';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { INotificationRepository } from '../../../domain/interfaces/repositories/notification/INotificationRepository';
import { IUpdateApplicationStageUseCase } from 'src/domain/interfaces/use-cases/applications/IUpdateApplicationStageUseCase';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { JobApplication } from '../../../domain/entities/job-application.entity';
import { notificationService } from '../../../infrastructure/di/notificationDi';
import { NotificationType } from '../../../domain/entities/notification.entity';
import { JobApplicationMapper } from '../../mappers/job-application.mapper';
import { JobApplicationListResponseDto } from '../../dto/application/job-application-response.dto';
import { UpdateApplicationStageDto } from '../../dto/application/update-application-stage.dto';

export class UpdateApplicationStageUseCase implements IUpdateApplicationStageUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(dto: UpdateApplicationStageDto): Promise<JobApplicationListResponseDto> {
    const { userId, applicationId, stage, rejectionReason } = dto;
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

    const updateData: Partial<JobApplication> & { rejectionReason?: string } = { stage };
    if (stage === ApplicationStage.REJECTED && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const updatedApplication = await this._jobApplicationRepository.update(applicationId, updateData as Partial<JobApplication>);

    if (!updatedApplication) {
      throw new NotFoundError('Failed to update application stage');
    }

    const stageMessages: Record<string, { title: string; message: string }> = {
      [ApplicationStage.SHORTLISTED]: {
        title: 'Application Shortlisted',
        message: `Congratulations! Your application for ${job.title} has been shortlisted`,
      },
      [ApplicationStage.INTERVIEW]: {
        title: 'Interview Stage',
        message: `Your application for ${job.title} has moved to the interview stage`,
      },
      [ApplicationStage.REJECTED]: {
        title: 'Application Status Updated',
        message: `Your application status for ${job.title} has been updated`,
      },
      [ApplicationStage.HIRED]: {
        title: 'Congratulations! You\'re Hired',
        message: `Congratulations! You have been hired for ${job.title}`,
      },
    };

    const notification = stageMessages[stage];
    if (notification) {
      await notificationService.sendNotification({
        user_id: application.seekerId,
        type: NotificationType.APPLICATION_STATUS,
        title: notification.title,
        message: notification.message,
        data: {
          job_id: job.id,
          application_id: application.id,
          stage: stage,
          job_title: job.title,
          rejection_reason: rejectionReason,
        },
      });
    }

    return JobApplicationMapper.toListResponse(updatedApplication, {
      jobTitle: job.title,
    });
  }
}


