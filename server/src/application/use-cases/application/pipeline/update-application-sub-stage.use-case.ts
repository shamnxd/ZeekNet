import { IUpdateApplicationSubStageUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IUpdateApplicationSubStageUseCase';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IActivityLoggerService } from 'src/domain/interfaces/services/IActivityLoggerService';
import { JobApplication } from 'src/domain/entities/job-application.entity';
import { ATSSubStage, ATSStage } from 'src/domain/enums/ats-stage.enum';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { isValidSubStageForStage } from 'src/domain/utils/ats-pipeline.util';

export class UpdateApplicationSubStageUseCase implements IUpdateApplicationSubStageUseCase {
  constructor(
    private jobApplicationRepository: IJobApplicationRepository,
    private jobPostingRepository: IJobPostingRepository,
    private activityLoggerService: IActivityLoggerService,
  ) {}

  async execute(data: {
    applicationId: string;
    subStage: ATSSubStage;
    performedBy: string;
    performedByName: string;
  }): Promise<JobApplication> {
    
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

    
    const allowedSubStages = job.atsPipelineConfig[application.stage] || [];
    if (!allowedSubStages.includes(data.subStage)) {
      throw new ValidationError(`Sub-stage '${data.subStage}' is not allowed for stage '${application.stage}' in this job's pipeline`);
    }

    
    const previousSubStage = application.subStage;

    
    const updatedApplication = await this.jobApplicationRepository.update(data.applicationId, {
      subStage: data.subStage,
    });

    if (!updatedApplication) {
      throw new NotFoundError('Failed to update application');
    }

    
    await this.activityLoggerService.logSubStageChangeActivity({
      applicationId: data.applicationId,
      previousSubStage,
      nextSubStage: data.subStage,
      stage: application.stage,
      performedBy: data.performedBy,
      performedByName: data.performedByName,
    });

    return updatedApplication;
  }
}

