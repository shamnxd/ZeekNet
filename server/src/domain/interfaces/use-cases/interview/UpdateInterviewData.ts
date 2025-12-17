export interface UpdateInterviewData {
  userId: string;
  applicationId: string;
  interviewId: string;
  date?: Date | string;
  time?: string;
  interview_type?: string;
  location?: string;
  interviewer_name?: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no-show';
}





