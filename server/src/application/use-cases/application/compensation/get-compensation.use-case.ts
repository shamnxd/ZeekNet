import { IGetCompensationUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IGetCompensationUseCase';
import { IATSCompensationRepository } from 'src/domain/interfaces/repositories/ats/IATSCompensationRepository';
import { ATSCompensation } from 'src/domain/entities/ats-compensation.entity';
import { ATSCompensationResponseDto } from 'src/application/dtos/application/compensation/responses/ats-compensation.response.dto';
import { ATSCompensationMapper } from 'src/application/mappers/ats/ats-compensation.mapper';

export class GetCompensationUseCase implements IGetCompensationUseCase {
  constructor(private compensationRepository: IATSCompensationRepository) {}

  async execute(applicationId: string): Promise<ATSCompensationResponseDto | null> {
    const compensation = await this.compensationRepository.findByApplicationId(applicationId);
    return compensation ? ATSCompensationMapper.toResponse(compensation) : null;
  }
}

