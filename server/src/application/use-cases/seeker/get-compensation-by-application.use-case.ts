import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IATSCompensationRepository } from '../../../domain/interfaces/repositories/ats/IATSCompensationRepository';
import { NotFoundError, AuthorizationError } from '../../../domain/errors/errors';
import { ATSCompensation } from '../../../domain/entities/ats-compensation.entity';

export interface IGetCompensationByApplicationUseCase {
  execute(userId: string, applicationId: string): Promise<ATSCompensation | null>;
}

export class GetCompensationByApplicationUseCase implements IGetCompensationByApplicationUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _compensationRepository: IATSCompensationRepository,
  ) {}

  async execute(userId: string, applicationId: string): Promise<ATSCompensation | null> {
    const application = await this._jobApplicationRepository.findById(applicationId);
    
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    if (application.seekerId !== userId) {
      throw new AuthorizationError('You can only view your own applications');
    }

    return this._compensationRepository.findByApplicationId(applicationId);
  }
}
