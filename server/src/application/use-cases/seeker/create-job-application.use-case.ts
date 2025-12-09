import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { INotificationRepository } from '../../../domain/interfaces/repositories/notification/INotificationRepository';
import { ICreateJobApplicationUseCase } from '../../../domain/interfaces/use-cases/IJobApplicationUseCases';
import { CreateJobApplicationData } from 'src/domain/interfaces/use-cases/applications/CreateJobApplicationData';
import { ValidationError, NotFoundError } from '../../../domain/errors/errors';
import { JobApplication } from '../../../domain/entities/job-application.entity';
import { notificationService } from '../../../infrastructure/di/notificationDi';
import { NotificationType } from '../../../domain/entities/notification.entity';
import { Types } from 'mongoose';

export class CreateJobApplicationUseCase implements ICreateJobApplicationUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(data: CreateJobApplicationData): Promise<{ id: string }> {
    const { seekerId, ...applicationData } = data;
    if (!seekerId) throw new Error('Seeker ID is required');
    const user = await this._userRepository.findById(seekerId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    if (!user.isVerified) {
      throw new ValidationError('Please verify your email before applying for jobs');
    }

    const job = await this._jobPostingRepository.findById(applicationData.job_id);
    if (!job) {
      throw new NotFoundError('Job posting not found');
    }
    if (job.status !== 'active') {
      throw new ValidationError('This job posting is not available for applications');
    }
    const existingApplication = await this._jobApplicationRepository.findOne({ 
      seeker_id: new Types.ObjectId(seekerId), 
      job_id: new Types.ObjectId(applicationData.job_id),
    });
    if (existingApplication) {
      throw new ValidationError('You have already applied for this job');
    }

    const application = await this._jobApplicationRepository.create({
      seekerId: seekerId,
      jobId: applicationData.job_id,
      companyId: job.companyId,
      coverLetter: applicationData.cover_letter,
      resumeUrl: applicationData.resume_url,
      resumeFilename: applicationData.resume_filename,
      stage: 'applied',
      interviews: [],
      appliedDate: new Date(),
    });

    await this._jobPostingRepository.update(applicationData.job_id, { 
      applicationCount: job.applicationCount + 1, 
    });

    const companyProfile = await this._companyProfileRepository.findById(job.companyId);
    if (companyProfile) {

      await notificationService.sendNotification({
        user_id: companyProfile.userId,
        type: NotificationType.JOB_APPLICATION,
        title: 'New Job Application',
        message: `You have received a new application for ${job.title}`,
        data: {
          job_id: job.id,
          application_id: application.id,
          job_title: job.title,
        },
      });
    }

    return { id: application.id };
  }
}



