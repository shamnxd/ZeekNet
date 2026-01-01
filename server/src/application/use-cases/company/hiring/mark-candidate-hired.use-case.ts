import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IMailerService } from 'src/domain/interfaces/services/IMailerService';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { JobStatus } from 'src/domain/enums/job-status.enum';
import { JobClosureType } from 'src/domain/enums/job-closure-type.enum';
import { ATSStage } from 'src/domain/enums/ats-stage.enum';

export interface MarkCandidateHiredDto {
  userId: string;
  applicationId: string;
}

export class MarkCandidateHiredUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _mailerService: IMailerService,
  ) {}

  async execute(dto: MarkCandidateHiredDto): Promise<void> {
    const { userId, applicationId } = dto;

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
      throw new ValidationError('You can only mark candidates as hired for your own job postings');
    }

    
    if (application.stage === ATSStage.HIRED) {
      throw new ValidationError('Candidate is already marked as hired');
    }

    
    if (job.status === JobStatus.CLOSED) {
      throw new ValidationError('Cannot mark candidate as hired for a closed job');
    }

    
    await this._jobApplicationRepository.update(applicationId, {
      stage: ATSStage.HIRED,
    });

    
    const currentFilled = job.filledVacancies ?? 0;
    const newFilled = currentFilled + 1;
    const totalVacancies = job.totalVacancies ?? 1;

    await this._jobPostingRepository.update(job.id, {
      filledVacancies: newFilled,
    });

    
    if (newFilled >= totalVacancies && job.status === JobStatus.ACTIVE) {
      await this.autoCloseJob(job.id, applicationId);
    }
  }

  private async autoCloseJob(jobId: string, hiredApplicationId: string): Promise<void> {
    const job = await this._jobPostingRepository.findById(jobId);
    if (!job) {
      throw new NotFoundError('Job posting not found');
    }

    
    await this._jobPostingRepository.update(jobId, {
      status: JobStatus.CLOSED,
      closureType: JobClosureType.AUTO_FILLED,
      closedAt: new Date(),
    });

    
    const allApplications = await this._jobApplicationRepository.findByJobId(jobId);
    const nonHiredApplications = allApplications.filter(
      (app) => app.id !== hiredApplicationId && app.stage !== ATSStage.HIRED,
    );

    
    for (const application of nonHiredApplications) {
      
      
      

      
      const seeker = await this._userRepository.findById(application.seekerId);
      if (seeker && seeker.email) {
        
        await this.sendRejectionEmail(seeker.email, job.title, seeker.name || 'Candidate');
      }
    }
  }

  private async sendRejectionEmail(email: string, jobTitle: string, candidateName: string): Promise<void> {
    const subject = `Update on Your Application for ${jobTitle}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4640DE; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Update</h1>
          </div>
          <div class="content">
            <p>Dear ${candidateName},</p>
            <p>Thank you for your interest in the position of <strong>${jobTitle}</strong>.</p>
            <p>We regret to inform you that this position has been filled. We appreciate the time and effort you invested in your application.</p>
            <p>We encourage you to continue exploring other opportunities on our platform.</p>
            <p>Best regards,<br>The Hiring Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this._mailerService.sendMail(email, subject, html);
    } catch (error) {
      
      console.error(`Failed to send rejection email to ${email}:`, error);
    }
  }
}

