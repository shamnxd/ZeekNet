import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IMailerService } from 'src/domain/interfaces/services/IMailerService';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { JobStatus } from 'src/domain/enums/job-status.enum';
import { JobClosureType } from 'src/domain/enums/job-closure-type.enum';
import { ATSStage } from 'src/domain/enums/ats-stage.enum';

export interface CloseJobManuallyDto {
  userId: string;
  jobId: string;
}

export class CloseJobManuallyUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _mailerService: IMailerService,
  ) {}

  async execute(dto: CloseJobManuallyDto): Promise<void> {
    const { userId, jobId } = dto;

    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    const job = await this._jobPostingRepository.findById(jobId);
    if (!job) {
      throw new NotFoundError('Job posting not found');
    }

    if (job.companyId !== companyProfile.id) {
      throw new ValidationError('You can only close your own job postings');
    }

    
    if (job.status === JobStatus.CLOSED) {
      throw new ValidationError('Job is already closed');
    }

    
    await this._jobPostingRepository.update(jobId, {
      status: JobStatus.CLOSED,
      closureType: JobClosureType.MANUAL,
      closedAt: new Date(),
    });

    
    const allApplications = await this._jobApplicationRepository.findByJobId(jobId);
    const nonHiredApplications = allApplications.filter(
      (app) => app.stage !== ATSStage.HIRED,
    );

    
    for (const application of nonHiredApplications) {
      
      const seeker = await this._userRepository.findById(application.seekerId);
      if (seeker && seeker.email) {
        
        await this.sendJobClosedEmail(seeker.email, job.title, seeker.name || 'Candidate');
      }
    }
  }

  private async sendJobClosedEmail(email: string, jobTitle: string, candidateName: string): Promise<void> {
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
            <p>We regret to inform you that this position has been closed by the employer due to internal hiring decisions. This decision is not related to your qualifications or application quality.</p>
            <p>We appreciate the time and effort you invested in your application and encourage you to continue exploring other opportunities on our platform.</p>
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
      
      console.error(`Failed to send job closed email to ${email}:`, error);
    }
  }
}



