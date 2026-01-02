import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { ATSStage } from 'src/domain/enums/ats-stage.enum';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICreateJobApplicationUseCase } from 'src/domain/interfaces/use-cases/seeker/applications/ICreateJobApplicationUseCase';
import { CreateJobApplicationDto } from 'src/application/dtos/seeker/applications/requests/create-job-application.dto';
import { z } from 'zod';
import { ValidationError, NotFoundError } from 'src/domain/errors/errors';
import { INotificationService } from 'src/domain/interfaces/services/INotificationService';
import { NotificationType } from 'src/domain/enums/notification-type.enum';
import { IResumeParserService } from 'src/domain/interfaces/services/IResumeParserService';
import { JobApplicationMapper } from 'src/application/mappers/job-application/job-application.mapper';
import { ICalculateATSScoreUseCase } from 'src/application/use-cases/seeker/applications/calculate-ats-score.use-case';
import { JobPosting } from 'src/domain/entities/job-posting.entity';


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
    mimeType?: string,
  ): Promise<{ id: string }> {
    const { seekerId, ...applicationData } = data;
    
    
    await this._validateSeeker(seekerId);
    
    
    const job = await this._validateJobPosting(applicationData.job_id);
    
    
    await this._checkDuplicateApplication(seekerId!, applicationData.job_id);
    
    
    const application = await this._createApplication(seekerId!, applicationData, job);
    
    
    const resumeText = await this._parseResume(resumeBuffer, mimeType);
    
    
    this._triggerATSCalculation(application.id, job, applicationData.cover_letter, resumeText);
    
    
    await this._incrementApplicationCount(applicationData.job_id, job.applicationCount);
    
    
    await this._notifyCompany(job, application.id);
    
    return { id: application.id };
  }

  
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

  
  private async _checkDuplicateApplication(seekerId: string, jobId: string): Promise<void> {
    const existingApplication = await this._jobApplicationRepository.findOne({
      seeker_id: seekerId,
      job_id: jobId,
    });

    if (existingApplication) {
      throw new ValidationError('You have already applied for this job');
    }
  }

  
  private async _createApplication(seekerId: string, applicationData: z.infer<typeof CreateJobApplicationDto>, job: JobPosting) {
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
        score: -1, 
      }),
    );
  }

  
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

  
  private _triggerATSCalculation(
    applicationId: string,
    job: JobPosting,
    coverLetter: string,
    resumeText: string,
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
      
      
    });
  }

  
  private async _incrementApplicationCount(jobId: string, currentCount: number): Promise<void> {
    await this._jobPostingRepository.update(jobId, {
      applicationCount: currentCount + 1,
    });
  }

  
  private async _notifyCompany(job: JobPosting, applicationId: string): Promise<void> {
    const companyProfile = await this._companyProfileRepository.findById(job.companyId);
    
    if (!companyProfile) {
      return; 
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
      
      console.error('Failed to send notification to company:', error);
    }
  }
}



