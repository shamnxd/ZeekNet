import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { ATSStage } from '../../../domain/enums/ats-stage.enum';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICreateJobApplicationUseCase } from '../../../domain/interfaces/use-cases/applications/ICreateJobApplicationUseCase';
import { CreateJobApplicationDto } from '../../dto/application/create-job-application.dto';
import { z } from 'zod';
import { ValidationError, NotFoundError } from '../../../domain/errors/errors';
import { INotificationService } from '../../../domain/interfaces/services/INotificationService';
import { NotificationType } from '../../../domain/enums/notification-type.enum';
import { IResumeParserService } from '../../../domain/interfaces/services/IResumeParserService';
import { JobApplicationMapper } from '../../mappers/job-application.mapper';
import { ICalculateATSScoreUseCase } from './calculate-ats-score.use-case';

/**
 * Create Job Application Use Case
 * 
 * Refactored to follow Single Responsibility Principle
 * 
 * Primary Responsibility: Create and validate job applications
 * 
 * Side Effects (acceptable for this use case):
 * - Increment job application count
 * - Send notification to company
 * - Trigger ATS score calculation (async, non-blocking)
 * 
 * Note: In a more advanced architecture, these side effects would be
 * handled via Domain Events, but for pragmatic reasons they remain here.
 */
export class CreateJobApplicationUseCase implements ICreateJobApplicationUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _notificationService: INotificationService,
    private readonly _resumeParserService: IResumeParserService,
    private readonly _calculateATSScoreUseCase: ICalculateATSScoreUseCase,
  ) {}

  async execute(
    data: z.infer<typeof CreateJobApplicationDto> & { seekerId?: string },
    resumeBuffer?: Buffer,
    mimeType?: string
  ): Promise<{ id: string }> {
    const { seekerId, ...applicationData } = data;
    
    // Step 1: Validate seeker
    await this._validateSeeker(seekerId);
    
    // Step 2: Validate job posting
    const job = await this._validateJobPosting(applicationData.job_id);
    
    // Step 3: Check for duplicate application
    await this._checkDuplicateApplication(seekerId!, applicationData.job_id);
    
    // Step 4: Create application
    const application = await this._createApplication(seekerId!, applicationData, job);
    
    // Step 5: Parse resume for ATS (non-blocking)
    const resumeText = await this._parseResume(resumeBuffer, mimeType);
    
    // Step 6: Trigger ATS score calculation (async, non-blocking)
    this._triggerATSCalculation(application.id, job, applicationData.cover_letter, resumeText);
    
    // Step 7: Update job application count
    await this._incrementApplicationCount(applicationData.job_id, job.applicationCount);
    
    // Step 8: Notify company
    await this._notifyCompany(job, application.id);
    
    return { id: application.id };
  }

  /**
   * Validate that the seeker exists and is verified
   */
  private async _validateSeeker(seekerId?: string): Promise<void> {
    if (!seekerId) {
      throw new Error('Seeker ID is required');
    }

    const user = await this._userRepository.findById(seekerId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.isVerified) {
      throw new ValidationError('Please verify your email before applying for jobs');
    }
  }

  /**
   * Validate that the job posting exists and is accepting applications
   */
  private async _validateJobPosting(jobId: string) {
    const job = await this._jobPostingRepository.findById(jobId);
    
    if (!job) {
      throw new NotFoundError('Job posting not found');
    }

    if (job.status === 'closed') {
      throw new ValidationError('This job posting has been closed and is no longer accepting applications');
    }

    if (job.status !== 'active') {
      throw new ValidationError('This job posting is not available for applications');
    }

    return job;
  }

  /**
   * Check if the seeker has already applied for this job
   */
  private async _checkDuplicateApplication(seekerId: string, jobId: string): Promise<void> {
    const existingApplication = await this._jobApplicationRepository.findOne({
      seeker_id: seekerId,
      job_id: jobId,
    });

    if (existingApplication) {
      throw new ValidationError('You have already applied for this job');
    }
  }

  /**
   * Create the job application entity
   */
  private async _createApplication(seekerId: string, applicationData: any, job: any) {
    return await this._jobApplicationRepository.create(
      JobApplicationMapper.toEntity({
        seekerId: seekerId,
        jobId: applicationData.job_id,
        companyId: job.companyId,
        coverLetter: applicationData.cover_letter,
        resumeUrl: applicationData.resume_url,
        resumeFilename: applicationData.resume_filename,
        stage: ATSStage.IN_REVIEW,
        appliedDate: new Date(),
        score: -1, // Will be updated by ATS calculation
      })
    );
  }

  /**
   * Parse resume text for ATS scoring
   * Non-blocking - failures don't affect application creation
   */
  private async _parseResume(resumeBuffer?: Buffer, mimeType?: string): Promise<string> {
    if (!resumeBuffer || !mimeType) {
      return '';
    }

    try {
      return await this._resumeParserService.parse(resumeBuffer, mimeType);
    } catch (error) {
      console.error('Failed to parse resume for ATS scoring:', error);
      return '';
    }
  }

  /**
   * Trigger ATS score calculation asynchronously
   * This is a fire-and-forget operation that doesn't block application creation
   */
  private _triggerATSCalculation(
    applicationId: string,
    job: any,
    coverLetter: string,
    resumeText: string
  ): void {
    this._calculateATSScoreUseCase.execute({
      applicationId,
      jobDetails: {
        title: job.title,
        description: job.description,
        qualifications: job.qualifications,
        responsibilities: job.responsibilities,
        skillsRequired: job.skillsRequired,
      },
      candidateData: {
        coverLetter,
        resumeText,
      },
    }).catch(error => {
      // Errors are already logged in the CalculateATSScoreUseCase
      // This catch prevents unhandled promise rejection
    });
  }

  /**
   * Increment the application count for the job posting
   */
  private async _incrementApplicationCount(jobId: string, currentCount: number): Promise<void> {
    await this._jobPostingRepository.update(jobId, {
      applicationCount: currentCount + 1,
    });
  }

  /**
   * Send notification to the company about the new application
   */
  private async _notifyCompany(job: any, applicationId: string): Promise<void> {
    const companyProfile = await this._companyProfileRepository.findById(job.companyId);
    
    if (!companyProfile) {
      return; // Company profile not found, skip notification
    }

    try {
      await this._notificationService.sendNotification({
        user_id: companyProfile.userId,
        type: NotificationType.JOB_APPLICATION,
        title: 'New Job Application',
        message: `You have received a new application for ${job.title}`,
        data: {
          job_id: job.id,
          application_id: applicationId,
          job_title: job.title,
        },
      });
    } catch (error) {
      // Notification failure shouldn't block application creation
      console.error('Failed to send notification to company:', error);
    }
  }
}
