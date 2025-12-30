import { IGetCompensationUseCase } from '../../../domain/interfaces/use-cases/ats/IGetCompensationUseCase';
import { IATSCompensationRepository } from '../../../domain/interfaces/repositories/ats/IATSCompensationRepository';
import { ATSCompensation } from '../../../domain/entities/ats-compensation.entity';

export class GetCompensationUseCase implements IGetCompensationUseCase {
  constructor(private compensationRepository: IATSCompensationRepository) {}

  async execute(applicationId: string): Promise<ATSCompensation | null> {
    return await this.compensationRepository.findByApplicationId(applicationId);
  }
}

