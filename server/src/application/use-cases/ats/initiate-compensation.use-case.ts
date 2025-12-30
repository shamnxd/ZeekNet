import { v4 as uuidv4 } from 'uuid';
import { IInitiateCompensationUseCase } from '../../../domain/interfaces/use-cases/ats/IInitiateCompensationUseCase';
import { IATSCompensationRepository } from '../../../domain/interfaces/repositories/ats/IATSCompensationRepository';
import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IAddCommentUseCase } from '../../../domain/interfaces/use-cases/ats/IAddCommentUseCase';
import { IActivityLoggerService } from '../../../domain/interfaces/services/IActivityLoggerService';
import { ATSCompensation } from '../../../domain/entities/ats-compensation.entity';
import { ATSStage } from '../../../domain/enums/ats-stage.enum';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';

export class InitiateCompensationUseCase implements IInitiateCompensationUseCase {
  constructor(
    private compensationRepository: IATSCompensationRepository,
    private jobApplicationRepository: IJobApplicationRepository,
    private addCommentUseCase: IAddCommentUseCase,
    private activityLoggerService: IActivityLoggerService,
  ) {}

  async execute(data: {
    applicationId: string;
    candidateExpected: string;
    notes?: string;
    performedBy: string;
    performedByName: string;
  }): Promise<ATSCompensation> {
    // Check if compensation already exists
    const existing = await this.compensationRepository.findByApplicationId(data.applicationId);
    if (existing) {
      throw new ValidationError('Compensation discussion already initiated');
    }

    // Get application to verify it exists and get current subStage
    const application = await this.jobApplicationRepository.findById(data.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    // Create compensation record
    const compensation = ATSCompensation.create({
      id: uuidv4(),
      applicationId: data.applicationId,
      candidateExpected: data.candidateExpected,
    });

    const created = await this.compensationRepository.create(compensation);

    // Log activity
    await this.activityLoggerService.logCompensationActivity({
      applicationId: data.applicationId,
      type: 'initiated',
      candidateExpected: data.candidateExpected,
      stage: ATSStage.COMPENSATION,
      subStage: application.subStage,
      performedBy: data.performedBy,
      performedByName: data.performedByName,
    });

    if (data.notes) {
      await this.addCommentUseCase.execute({
        applicationId: data.applicationId,
        comment: data.notes,
        stage: ATSStage.COMPENSATION,
        addedBy: data.performedBy,
        addedByName: data.performedByName,
      });
    }

    return created;
  }
}

