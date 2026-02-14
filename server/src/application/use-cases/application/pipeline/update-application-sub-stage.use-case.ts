import { IUpdateApplicationSubStageUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IUpdateApplicationSubStageUseCase';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IATSCommentRepository } from 'src/domain/interfaces/repositories/ats/IATSCommentRepository';

import { JobApplication } from 'src/domain/entities/job-application.entity';
import { ATSSubStage, ATSStage } from 'src/domain/enums/ats-stage.enum';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { isValidSubStageForStage } from 'src/domain/utils/ats-pipeline.util';
import { UpdateSubStageDto } from 'src/application/dtos/application/requests/update-sub-stage.dto';
import { JobApplicationResponseDto } from 'src/application/dtos/application/responses/job-application-response.dto';
import { JobApplicationMapper } from 'src/application/mappers/job-application/job-application.mapper';
import { ATSComment } from 'src/domain/entities/ats-comment.entity';
import { v4 as uuidv4 } from 'uuid';

export class UpdateApplicationSubStageUseCase implements IUpdateApplicationSubStageUseCase {
  constructor(
    private jobApplicationRepository: IJobApplicationRepository,
    private jobPostingRepository: IJobPostingRepository,
    private commentRepository: IATSCommentRepository,
  ) { }

  async execute(dto: UpdateSubStageDto): Promise<JobApplication> {
    const data = {
      applicationId: dto.applicationId,
      subStage: dto.subStage as ATSSubStage,
      performedBy: dto.userId,
      performedByName: dto.userName,
      comment: dto.comment,
    };

    const application = await this.jobApplicationRepository.findById(data.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }


    const job = await this.jobPostingRepository.findById(application.jobId);
    if (!job) {
      throw new NotFoundError('Job not found');
    }


    if (!isValidSubStageForStage(application.stage, data.subStage)) {
      throw new ValidationError(`Sub-stage '${data.subStage}' is not valid for stage '${application.stage}'`);
    }



    const previousSubStage = application.subStage;


    const updatedApplication = await this.jobApplicationRepository.update(data.applicationId, {
      subStage: data.subStage,
    });

    if (!updatedApplication) {
      throw new NotFoundError('Failed to update application');
    }

    // Create comment for substage change if reason provided
    if (data.comment) {
      const comment = ATSComment.create({
        id: uuidv4(),
        applicationId: data.applicationId,
        comment: data.comment,
        stage: application.stage,
        subStage: data.subStage,
      });
      await this.commentRepository.create(comment);
    }

    return JobApplicationMapper.toResponse(updatedApplication);
  }
}

