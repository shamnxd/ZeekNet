import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IATSCompensationRepository } from 'src/domain/interfaces/repositories/ats/IATSCompensationRepository';
import { NotFoundError, AuthorizationError } from 'src/domain/errors/errors';
import { ATSCompensation } from 'src/domain/entities/ats-compensation.entity';
import { ATSCompensationResponseDto } from 'src/application/dtos/application/compensation/responses/ats-compensation.response.dto';
import { ATSCompensationMapper } from 'src/application/mappers/ats/ats-compensation.mapper';

export interface IGetCompensationByApplicationUseCase {
  execute(userId: string, applicationId: string): Promise<ATSCompensationResponseDto | null>;
}

export class GetCompensationByApplicationUseCase implements IGetCompensationByApplicationUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _compensationRepository: IATSCompensationRepository,
  ) {}

  async execute(userId: string, applicationId: string): Promise<ATSCompensationResponseDto | null> {
    const application = await this._jobApplicationRepository.findById(applicationId);
    
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    if (application.seekerId !== userId) {
      throw new AuthorizationError('You can only view your own applications');
    }

    const compensation = await this._compensationRepository.findByApplicationId(applicationId);
    return compensation ? ATSCompensationMapper.toResponse(compensation) : null;
  }
}
