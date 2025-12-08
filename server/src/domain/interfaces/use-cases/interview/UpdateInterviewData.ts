import type { InterviewStatus } from 'src/domain/entities/job-application.entity';


export interface UpdateInterviewData {
  date?: Date;
  time?: string;
  interview_type?: string;
  location?: string;
  interviewer_name?: string;
  status?: InterviewStatus;
}
