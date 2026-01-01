import { InterviewStatus } from 'src/domain/interfaces/interview.interfaces';

export interface UpdateInterviewData {
  userId: string;
  applicationId: string;
  interviewId: string;
  date?: Date | string;
  time?: string;
  interview_type?: string;
  location?: string;
  status?: InterviewStatus;
}









