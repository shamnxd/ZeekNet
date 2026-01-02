import { ATSInterview } from 'src/domain/entities/ats-interview.entity';

export interface IGetInterviewsByApplicationUseCase {
  execute(applicationId: string): Promise<ATSInterview[]>;
}

