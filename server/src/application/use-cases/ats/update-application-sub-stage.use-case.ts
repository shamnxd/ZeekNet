import { IUpdateApplicationSubStageUseCase } from '../../../domain/interfaces/use-cases/ats/IUpdateApplicationSubStageUseCase';
import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IActivityLoggerService } from '../../../domain/interfaces/services/IActivityLoggerService';
import { JobApplication } from '../../../domain/entities/job-application.entity';
import { ATSSubStage, ATSStage } from '../../../domain/enums/ats-stage.enum';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { isValidSubStageForStage } from '../../../domain/utils/ats-pipeline.util';

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
    // Get application
    const application = await this.jobApplicationRepository.findById(data.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    // Get job to validate pipeline
    const job = await this.jobPostingRepository.findById(application.jobId);
    if (!job) {
      throw new NotFoundError('Job not found');
    }

    // Validate sub-stage belongs to current stage
    if (!isValidSubStageForStage(application.stage, data.subStage)) {
      throw new ValidationError(`Sub-stage '${data.subStage}' is not valid for stage '${application.stage}'`);
    }

    // Validate sub-stage is allowed in job pipeline config
    const allowedSubStages = job.atsPipelineConfig[application.stage] || [];
    if (!allowedSubStages.includes(data.subStage)) {
      throw new ValidationError(`Sub-stage '${data.subStage}' is not allowed for stage '${application.stage}' in this job's pipeline`);
    }

    // Store previous state for activity log
    const previousSubStage = application.subStage;

    // Update application
    const updatedApplication = await this.jobApplicationRepository.update(data.applicationId, {
      subStage: data.subStage,
    });

    if (!updatedApplication) {
      throw new NotFoundError('Failed to update application');
    }

    // Log activity
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

