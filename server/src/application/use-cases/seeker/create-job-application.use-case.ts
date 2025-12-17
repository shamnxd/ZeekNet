import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { ApplicationStage } from '../../../domain/enums/application-stage.enum';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { INotificationRepository } from '../../../domain/interfaces/repositories/notification/INotificationRepository';
import { ICreateJobApplicationUseCase } from 'src/domain/interfaces/use-cases/applications/ICreateJobApplicationUseCase';
import { CreateJobApplicationDto } from '../../dto/application/create-job-application.dto';
import { z } from 'zod';
import { ValidationError, NotFoundError } from '../../../domain/errors/errors';
import { JobApplication } from '../../../domain/entities/job-application.entity';
import { notificationService } from '../../../infrastructure/di/notificationDi';
import { NotificationType } from '../../../domain/entities/notification.entity';
import { Types } from 'mongoose';
import { groqService } from '../../../infrastructure/services/groq.service';
import { ResumeParser } from '../../../shared/utils/resume-parser.utils';

export class CreateJobApplicationUseCase implements ICreateJobApplicationUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  private async calculateAndUpdateATSScore(
    applicationId: string,
    jobDetails: {
      title: string;
      description: string;
      qualifications?: string[];
      responsibilities?: string[];
      skillsRequired: string[];
    },
    candidateData: {

      coverLetter: string;
      resumeText?: string;
    },
  ): Promise<void> {
    try {
      const atsResult = await groqService.calculateATSScore(jobDetails, candidateData);
      
      // Update the application with the calculated score
      await this._jobApplicationRepository.update(applicationId, {
        score: atsResult.score,
      });
      
      console.log(`✅ ATS Score updated for application ${applicationId}: ${atsResult.score}/100 - ${atsResult.reasoning}`);
    } catch (error) {
      console.error(`❌ Failed to calculate ATS score for application ${applicationId}:`, error);
      
      // Set score to null if calculation fails (instead of leaving it at -1)
      await this._jobApplicationRepository.update(applicationId, {
        score: undefined,
      });
    }
  }

  async execute(data: z.infer<typeof CreateJobApplicationDto> & { seekerId?: string }, resumeBuffer?: Buffer, mimeType?: string): Promise<{ id: string }> {
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

    // Create application with score = -1 (processing)
    const application = await this._jobApplicationRepository.create({
      seekerId: seekerId,
      jobId: applicationData.job_id,
      companyId: job.companyId,
      coverLetter: applicationData.cover_letter,
      resumeUrl: applicationData.resume_url,
      resumeFilename: applicationData.resume_filename,
      stage: ApplicationStage.APPLIED,
      interviews: [],
      appliedDate: new Date(),
      score: -1, // -1 indicates ATS score is being processed
    });

    let resumeText = '';
    if (resumeBuffer && mimeType) {
      try {
        resumeText = await ResumeParser.parse(resumeBuffer, mimeType);
      } catch (error) {
        console.warn('Failed to parse resume for ATS scoring:', error);
        // Continue without resume text, scoring will rely on cover letter
      }
    }

    // Calculate ATS score asynchronously (don't block the response)
    this.calculateAndUpdateATSScore(
      application.id,
      {
        title: job.title,
        description: job.description,
        qualifications: job.qualifications,
        responsibilities: job.responsibilities,
        skillsRequired: job.skillsRequired,
      },
      {
        coverLetter: applicationData.cover_letter,
        resumeText: resumeText,
      },
    ).catch(error => {
      console.error(`Failed to calculate ATS score for application ${application.id}:`, error);
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



