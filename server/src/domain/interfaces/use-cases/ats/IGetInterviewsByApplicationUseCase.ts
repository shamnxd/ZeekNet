import { ATSInterview } from '../../../entities/ats-interview.entity';

export interface IGetInterviewsByApplicationUseCase {
  execute(applicationId: string): Promise<ATSInterview[]>;
}

