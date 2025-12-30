import { IGetInterviewsByApplicationUseCase } from '../../../domain/interfaces/use-cases/ats/IGetInterviewsByApplicationUseCase';
import { IATSInterviewRepository } from '../../../domain/interfaces/repositories/ats/IATSInterviewRepository';
import { ATSInterview } from '../../../domain/entities/ats-interview.entity';

export class GetInterviewsByApplicationUseCase implements IGetInterviewsByApplicationUseCase {
  constructor(private interviewRepository: IATSInterviewRepository) {}

  async execute(applicationId: string): Promise<ATSInterview[]> {
    return await this.interviewRepository.findByApplicationId(applicationId);
  }
}

