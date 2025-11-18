import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { INotificationRepository } from '../../../domain/interfaces/repositories/notification/INotificationRepository';
import { ICreateJobApplicationUseCase, CreateJobApplicationData } from '../../../domain/interfaces/use-cases/IJobApplicationUseCases';
import { ValidationError, NotFoundError } from '../../../domain/errors/errors';
import { JobApplication } from '../../../domain/entities/job-application.entity';
import { notificationService } from '../../../infrastructure/services/notification.service';
import { NotificationType } from '../../../infrastructure/database/mongodb/models/notification.model';

export class CreateJobApplicationUseCase implements ICreateJobApplicationUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(seekerId: string, data: CreateJobApplicationData): Promise<JobApplication> {
    const user = await this._userRepository.findById(seekerId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    if (!user.isVerified) {
      throw new ValidationError('Please verify your email before applying for jobs');
    }

    const job = await this._jobPostingRepository.findById(data.job_id);
    if (!job) {
      throw new NotFoundError('Job posting not found');
    }
    if (!job.is_active) {
      throw new ValidationError('This job posting is no longer active');
    }
    if (job.admin_blocked) {
      throw new ValidationError('This job posting has been blocked');
    }

    const existingApplication = await this._jobApplicationRepository.checkDuplicateApplication(seekerId, data.job_id);
    if (existingApplication) {
      throw new ValidationError('You have already applied for this job');
    }

    const application = await this._jobApplicationRepository.create({
      seeker_id: seekerId,
      job_id: data.job_id,
      company_id: job.company_id,
      cover_letter: data.cover_letter,
      resume_url: data.resume_url,
      resume_filename: data.resume_filename,
    });

    // Increment application count
    await this._jobPostingRepository.update(data.job_id, { 
      application_count: job.application_count + 1 
    });

    const companyProfile = await this._companyProfileRepository.getProfileById(job.company_id);
    if (companyProfile) {
      // Send notification to company user
      await notificationService.sendNotification(
        this._notificationRepository,
        {
          user_id: companyProfile.userId,
          type: NotificationType.JOB_APPLICATION_RECEIVED,
          title: 'New Job Application',
          message: `You have received a new application for ${job.title}`,
          data: {
            job_id: job._id,
            application_id: application.id,
            job_title: job.title,
          },
        },
      );
    }

    return application;
  }
}

