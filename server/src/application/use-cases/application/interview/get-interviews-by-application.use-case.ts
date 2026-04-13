import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { IGetInterviewsByApplicationUseCase } from 'src/domain/interfaces/use-cases/application/interview/IGetInterviewsByApplicationUseCase';
import { IATSInterviewRepository } from 'src/domain/interfaces/repositories/ats/IATSInterviewRepository';
import { ATSInterviewResponseDto } from 'src/application/dtos/application/interview/responses/ats-interview-response.dto';
import { ATSInterviewMapper } from 'src/application/mappers/ats/ats-interview.mapper';

@injectable()
export class GetInterviewsByApplicationUseCase implements IGetInterviewsByApplicationUseCase {
  constructor(
    @inject(TYPES.ATSInterviewRepository) private interviewRepository: IATSInterviewRepository,
  ) {}

  async execute(applicationId: string): Promise<ATSInterviewResponseDto[]> {
    const interviews = await this.interviewRepository.findByApplicationId(applicationId);
    return ATSInterviewMapper.toResponseList(interviews);
  }
}
