import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { v4 as uuidv4 } from 'uuid';
import { IInitiateCompensationUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IInitiateCompensationUseCase';
import { IATSCompensationRepository } from 'src/domain/interfaces/repositories/ats/IATSCompensationRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IAddCommentUseCase } from 'src/domain/interfaces/use-cases/application/comments/IAddCommentUseCase';

import { ATSCompensation } from 'src/domain/entities/ats-compensation.entity';
import { ATSStage } from 'src/domain/enums/ats-stage.enum';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';

import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IMailerService } from 'src/domain/interfaces/services/IMailerService';
import { IEmailTemplateService } from 'src/domain/interfaces/services/IEmailTemplateService';
import { InitiateCompensationRequestDto } from 'src/application/dtos/application/compensation/requests/initiate-compensation.dto';
import { ATSCompensationResponseDto } from 'src/application/dtos/application/compensation/responses/ats-compensation.response.dto';
import { ATSCompensationMapper } from 'src/application/mappers/ats/ats-compensation.mapper';
import { ILogger } from 'src/domain/interfaces/services/ILogger';
import { ERROR } from 'src/shared/constants/messages';

@injectable()
export class InitiateCompensationUseCase implements IInitiateCompensationUseCase {
  constructor(
    @inject(TYPES.ATSCompensationRepository) private readonly _compensationRepository: IATSCompensationRepository,
    @inject(TYPES.JobApplicationRepository) private readonly _jobApplicationRepository: IJobApplicationRepository,
    @inject(TYPES.JobPostingRepository) private readonly _jobPostingRepository: IJobPostingRepository,
    @inject(TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    @inject(TYPES.ATS_AddCommentUseCase) private readonly _addCommentUseCase: IAddCommentUseCase,

    @inject(TYPES.MailerService) private readonly _mailerService: IMailerService,
    @inject(TYPES.EmailTemplateService) private readonly _emailTemplateService: IEmailTemplateService,
    @inject(TYPES.LoggerService) private readonly _logger: ILogger,
  ) { }

  async execute(dto: InitiateCompensationRequestDto): Promise<ATSCompensationResponseDto> {

    const existing = await this._compensationRepository.findByApplicationId(dto.applicationId);
    if (existing) {
      throw new ValidationError('Compensation discussion already initiated');
    }


    const application = await this._jobApplicationRepository.findById(dto.applicationId);
    if (!application) {
      throw new NotFoundError(ERROR.NOT_FOUND('Application'));
    }

    const job = await this._jobPostingRepository.findById(application.jobId);
    if (job && application.seekerId) {
      await this._sendCompensationInitiatedEmail(
        application.seekerId,
        job.title,
        job.companyName || 'ZeekNet',
      );
    }


    const compensation = ATSCompensation.create({
      id: uuidv4(),
      applicationId: dto.applicationId,
      candidateExpected: dto.candidateExpected,
    });

    const created = await this._compensationRepository.create(compensation);


    const currentUser = await this._userRepository.findById(dto.performedBy);
    const performedByName = currentUser ? currentUser.name : 'Unknown';



    if (dto.notes) {
      await this._addCommentUseCase.execute({
        applicationId: dto.applicationId,
        comment: dto.notes,
        stage: ATSStage.COMPENSATION,
        userId: dto.performedBy,
      });
    }

    if (!created) {
      throw new Error(ERROR.FAILED_TO('create compensation'));
    }

    return ATSCompensationMapper.toResponse(created) as ATSCompensationResponseDto;
  }

  private async _sendCompensationInitiatedEmail(
    seekerId: string,
    jobTitle: string,
    companyName: string,
  ): Promise<void> {
    try {
      const user = await this._userRepository.findById(seekerId);
      if (!user) return;

      const { subject, html } = this._emailTemplateService.getCompensationInitiatedEmail(
        user.name,
        jobTitle,
        companyName,
      );
      await this._mailerService.sendMail(user.email, subject, html);
    } catch (error) {
      this._logger.error(ERROR.FAILED_TO('send compensation initiated email:'), error);
    }
  }
}
