import { ATSInterview } from 'src/domain/entities/ats-interview.entity';

export interface IATSInterviewRepository {
  create(interview: ATSInterview): Promise<ATSInterview>;
  findById(id: string): Promise<ATSInterview | null>;
  findByApplicationId(applicationId: string): Promise<ATSInterview[]>;
  update(id: string, data: Partial<ATSInterview>): Promise<ATSInterview | null>;
  delete(id: string): Promise<boolean>;
}
