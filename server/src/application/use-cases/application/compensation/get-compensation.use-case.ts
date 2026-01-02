import { IGetCompensationUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IGetCompensationUseCase';
import { IATSCompensationRepository } from 'src/domain/interfaces/repositories/ats/IATSCompensationRepository';
import { ATSCompensation } from 'src/domain/entities/ats-compensation.entity';

export class GetCompensationUseCase implements IGetCompensationUseCase {
  constructor(private compensationRepository: IATSCompensationRepository) {}

  async execute(applicationId: string): Promise<ATSCompensation | null> {
    return await this.compensationRepository.findByApplicationId(applicationId);
  }
}

