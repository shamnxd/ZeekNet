import { IMoveApplicationStageUseCase } from '../../../domain/interfaces/use-cases/ats/IMoveApplicationStageUseCase';
import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IActivityLoggerService } from '../../../domain/interfaces/services/IActivityLoggerService';
import { JobApplication } from '../../../domain/entities/job-application.entity';
import { ATSStage, ATSSubStage } from '../../../domain/enums/ats-stage.enum';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { getDefaultSubStage, isValidSubStageForStage } from '../../../domain/utils/ats-pipeline.util';

export class MoveApplicationStageUseCase implements IMoveApplicationStageUseCase {
  constructor(
    private jobApplicationRepository: IJobApplicationRepository,
    private jobPostingRepository: IJobPostingRepository,
    private activityLoggerService: IActivityLoggerService,
  ) {}

  async execute(data: {
    applicationId: string;
    nextStage: ATSStage;
    subStage?: ATSSubStage;
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

    // Validate stage exists in job pipeline
    if (!job.enabledStages.includes(data.nextStage)) {
      throw new ValidationError(`Stage '${data.nextStage}' is not enabled for this job`);
    }

    // Validate that we're not trying to move from a past stage
    // Only allow stage changes from the current stage (prevent moving backward or from past stages)
    const currentStageIndex = job.enabledStages.indexOf(application.stage);
    const nextStageIndex = job.enabledStages.indexOf(data.nextStage);
    
    // If current stage is not found in enabled stages, allow the move (edge case)
    if (currentStageIndex === -1) {
      // Allow move if current stage is not in enabled stages (shouldn't happen, but handle gracefully)
    } else if (nextStageIndex !== -1 && nextStageIndex < currentStageIndex) {
      // Prevent moving to a stage that comes before the current stage (moving backward)
      throw new ValidationError(`Cannot move to stage '${data.nextStage}' as it is before the current stage '${application.stage}'. Stage changes can only be made from the current stage.`);
    }

    // Determine sub-stage
    let targetSubStage: ATSSubStage;
    if (data.subStage) {
      // Validate sub-stage belongs to stage
      if (!isValidSubStageForStage(data.nextStage, data.subStage)) {
        throw new ValidationError(`Sub-stage '${data.subStage}' is not valid for stage '${data.nextStage}'`);
      }

      // Validate sub-stage is allowed in job pipeline config
      const allowedSubStages = job.atsPipelineConfig[data.nextStage] || [];
      if (!allowedSubStages.includes(data.subStage)) {
        throw new ValidationError(`Sub-stage '${data.subStage}' is not allowed for stage '${data.nextStage}' in this job's pipeline`);
      }

      targetSubStage = data.subStage;
    } else {
      // Use default sub-stage for the stage
      targetSubStage = getDefaultSubStage(data.nextStage);

      // Ensure default is in pipeline config
      const allowedSubStages = job.atsPipelineConfig[data.nextStage] || [];
      if (!allowedSubStages.includes(targetSubStage)) {
        // Use first allowed sub-stage if default is not allowed
        targetSubStage = allowedSubStages[0] || targetSubStage;
      }
    }

    // Store previous state for activity log
    const previousStage = application.stage;
    const previousSubStage = application.subStage;

    // Update application
    const updatedApplication = await this.jobApplicationRepository.update(data.applicationId, {
      stage: data.nextStage,
      subStage: targetSubStage,
    });

    if (!updatedApplication) {
      throw new NotFoundError('Failed to update application');
    }

    // Log activity
    await this.activityLoggerService.logStageChangeActivity({
      applicationId: data.applicationId,
      previousStage,
      previousSubStage,
      nextStage: data.nextStage,
      nextSubStage: targetSubStage,
      performedBy: data.performedBy,
      performedByName: data.performedByName,
    });

    return updatedApplication;
  }
}

