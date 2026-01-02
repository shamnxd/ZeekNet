import { ATSInterview } from 'src/domain/entities/ats-interview.entity';

export interface IUpdateInterviewUseCase {
  execute(data: {
    interviewId: string;
    status?: 'scheduled' | 'completed' | 'cancelled';
    rating?: number;
    feedback?: string;
    performedBy: string;
    performedByName: string;
  }): Promise<ATSInterview>;
}

