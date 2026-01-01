import { IGetInterviewsByApplicationUseCase } from 'src/domain/interfaces/use-cases/application/interview/IGetInterviewsByApplicationUseCase';
import { IATSInterviewRepository } from 'src/domain/interfaces/repositories/ats/IATSInterviewRepository';
import { ATSInterview } from 'src/domain/entities/ats-interview.entity';

export class GetInterviewsByApplicationUseCase implements IGetInterviewsByApplicationUseCase {
  constructor(private interviewRepository: IATSInterviewRepository) {}

  async execute(applicationId: string): Promise<ATSInterview[]> {
    return await this.interviewRepository.findByApplicationId(applicationId);
  }
}

