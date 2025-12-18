import { InterviewStatus } from '../../interview.interfaces';

export interface UpdateInterviewData {
  userId: string;
  applicationId: string;
  interviewId: string;
  date?: Date | string;
  time?: string;
  interview_type?: string;
  location?: string;
  interviewer_name?: string;
  status?: InterviewStatus;
}





