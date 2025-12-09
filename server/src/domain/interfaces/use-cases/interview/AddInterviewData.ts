
export interface AddInterviewData {
  userId?: string;
  applicationId?: string;
  date: Date;
  time: string;
  interview_type: string;
  location: string;
  interviewer_name?: string;
}
