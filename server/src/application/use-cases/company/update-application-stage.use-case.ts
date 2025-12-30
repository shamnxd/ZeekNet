import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { ATSStage, ATSSubStage } from '../../../domain/enums/ats-stage.enum';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';

import { IUpdateApplicationStageUseCase } from 'src/domain/interfaces/use-cases/applications/IUpdateApplicationStageUseCase';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { JobApplication } from '../../../domain/entities/job-application.entity';
import { notificationService } from '../../../infrastructure/di/notificationDi';
import { NotificationType } from '../../../domain/enums/notification-type.enum';
import { JobApplicationMapper } from '../../mappers/job-application.mapper';
import { JobApplicationListResponseDto } from '../../dto/application/job-application-response.dto';
import { UpdateApplicationStageDto } from '../../dto/application/update-application-stage.dto';

export class UpdateApplicationStageUseCase implements IUpdateApplicationStageUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(dto: UpdateApplicationStageDto): Promise<JobApplicationListResponseDto> {
    const { userId, applicationId, stage, subStage, rejectionReason } = dto;
    
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

    const updateData: Partial<Omit<JobApplication, 'subStage'>> & { subStage?: ATSSubStage; rejectionReason?: string } = { stage };
    // Add subStage to update data if provided
    if (subStage) {
      updateData.subStage = subStage as ATSSubStage;
    }
    // Note: REJECTED stage removed - applications can be moved to any stage
    // If rejection logic is needed, it should be handled differently (e.g., status field)

    const updatedApplication = await this._jobApplicationRepository.update(applicationId, updateData as Partial<JobApplication>);

    if (!updatedApplication) {
      throw new NotFoundError('Failed to update application stage');
    }

    const stageMessages: Record<string, { title: string; message: string }> = {
      [ATSStage.SHORTLISTED]: {
        title: 'Application Shortlisted',
        message: `Congratulations! Your application for ${job.title} has been shortlisted`,
      },
      [ATSStage.IN_REVIEW]: {
        title: 'Application Status Updated',
        message: `Your application for ${job.title} is being reviewed`,
      },
      [ATSStage.INTERVIEW]: {
        title: 'Interview Stage',
        message: `Your application for ${job.title} has moved to the interview stage`,
      },
      [ATSStage.TECHNICAL_TASK]: {
        title: 'Technical Task',
        message: `A technical task has been assigned for your application to ${job.title}`,
      },
      [ATSStage.COMPENSATION]: {
        title: 'Compensation Discussion',
        message: `Compensation discussion has started for your application to ${job.title}`,
      },
      [ATSStage.OFFER]: {
        title: 'Offer Received',
        message: `Congratulations! You have received an offer for ${job.title}`,
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


