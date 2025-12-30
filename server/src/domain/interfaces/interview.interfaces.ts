export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
  NO_SHOW = 'no-show',
}

export interface InterviewFeedback {
  reviewerName: string;
  rating?: number;
  comment: string;
  reviewedAt: Date;
}

export interface InterviewSchedule {
  id?: string;
  date: Date;
  time: string;
  interviewType: string;
  location: string;
  status: InterviewStatus;
  feedback?: InterviewFeedback;
  createdAt?: Date;
  updatedAt?: Date;
}
