import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { ATSStage, ATSSubStage } from 'src/domain/enums/ats-stage.enum';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IUpdateApplicationStageUseCase } from 'src/domain/interfaces/use-cases/company/hiring/IUpdateApplicationStageUseCase';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { JobApplication } from 'src/domain/entities/job-application.entity';
import { INotificationService } from 'src/domain/interfaces/services/INotificationService';
import { NotificationType } from 'src/domain/enums/notification-type.enum';
import { JobApplicationMapper } from 'src/application/mappers/job-application/job-application.mapper';
import { JobApplicationListResponseDto } from 'src/application/dtos/seeker/applications/responses/job-application-response.dto';
import { UpdateApplicationStageDto } from 'src/application/dtos/application/requests/update-application-stage.dto';

export class UpdateApplicationStageUseCase implements IUpdateApplicationStageUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _notificationService: INotificationService,
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
    
    if (subStage) {
      updateData.subStage = subStage as ATSSubStage;
    }
    
    

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
      await this._notificationService.sendNotification({
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






