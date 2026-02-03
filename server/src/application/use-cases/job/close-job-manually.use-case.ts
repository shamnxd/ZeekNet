import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IMailerService } from 'src/domain/interfaces/services/IMailerService';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { JobStatus } from 'src/domain/enums/job-status.enum';
import { JobClosureType } from 'src/domain/enums/job-closure-type.enum';
import { ATSStage } from 'src/domain/enums/ats-stage.enum';
import { IEmailTemplateService } from 'src/domain/interfaces/services/IEmailTemplateService';
import { ILogger } from 'src/domain/interfaces/services/ILogger';

import { CloseJobDto } from 'src/application/dtos/company/job/requests/close-job.dto';
import { ICloseJobManuallyUseCase } from 'src/domain/interfaces/use-cases/job/ICloseJobManuallyUseCase';

export class CloseJobManuallyUseCase implements ICloseJobManuallyUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _mailerService: IMailerService,
    private readonly _emailTemplateService: IEmailTemplateService,
    private readonly _logger: ILogger,
  ) { }

  async execute(dto: CloseJobDto): Promise<void> {
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

        await this.sendJobClosedEmail(seeker.email, job.title, seeker.name || 'Candidate', job.companyName || 'ZeekNet');
      }
    }
  }

  private async sendJobClosedEmail(email: string, jobTitle: string, candidateName: string, companyName: string): Promise<void> {
    try {
      const { subject, html } = this._emailTemplateService.getJobClosedEmail(
        candidateName,
        jobTitle,
        companyName,
      );
      await this._mailerService.sendMail(email, subject, html);
    } catch (error) {

      this._logger.error(`Failed to send job closed email to ${email}:`, error);
    }
  }
}
