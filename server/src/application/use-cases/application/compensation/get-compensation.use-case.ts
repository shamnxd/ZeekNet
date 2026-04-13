import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { IGetCompensationUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IGetCompensationUseCase';
import { IATSCompensationRepository } from 'src/domain/interfaces/repositories/ats/IATSCompensationRepository';
import { ATSCompensationResponseDto } from 'src/application/dtos/application/compensation/responses/ats-compensation.response.dto';
import { ATSCompensationMapper } from 'src/application/mappers/ats/ats-compensation.mapper';

@injectable()
export class GetCompensationUseCase implements IGetCompensationUseCase {
  constructor(
    @inject(TYPES.ATSCompensationRepository) private compensationRepository: IATSCompensationRepository,
  ) {}

  async execute(applicationId: string): Promise<ATSCompensationResponseDto | null> {
    const compensation = await this.compensationRepository.findByApplicationId(applicationId);
    return compensation ? ATSCompensationMapper.toResponse(compensation) : null;
  }
}
