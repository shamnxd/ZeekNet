export const ActivityType = {
  STAGE_CHANGE: 'Stage Change',
  INTERVIEW_SCHEDULED: 'Interview Scheduled',
  INTERVIEW_COMPLETED: 'Interview Completed',
  TASK_ASSIGNED: 'Task Assigned',
  TASK_SUBMITTED: 'Task Submitted',
  TASK_REVIEWED: 'Task Reviewed',
  COMMENT_ADDED: 'Comment Added',
  OFFER_SENT: 'Offer Sent',
  OFFER_ACCEPTED: 'Offer Accepted',
  OFFER_DECLINED: 'Offer Declined',
  MEETING_SCHEDULED: 'Meeting Scheduled',
  DOCUMENT_UPLOADED: 'Document Uploaded'
} as const;

export type ActivityType = typeof ActivityType[keyof typeof ActivityType];

export interface ATSActivity {
  id: string;
  candidateId: string;
  type: ActivityType;
  title: string;
  description: string;
  performedBy: string;
  performedByRole?: string;
  timestamp: string;
  metadata?: {
    fromStage?: string;
    toStage?: string;
    fromSubStage?: string;
    toSubStage?: string;
    interviewDate?: string;
    interviewType?: 'online' | 'in-person' | 'phone';
    meetingLink?: string;
    taskTitle?: string;
    taskDescription?: string;
    taskDeadline?: string;
    documentName?: string;
    documentUrl?: string;
    rating?: number;
    feedback?: string;
  };
}

export interface Interview {
  id: string;
  candidateId: string;
  title: string;
  scheduledDate: string;
  type: 'online' | 'in-person' | 'phone';
  meetingLink?: string;
  location?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
}

export interface TechnicalTask {
  id: string;
  candidateId: string;
  title: string;
  description: string;
  assignedDate: string;
  deadline: string;
  status: 'assigned' | 'submitted' | 'reviewed' | 'completed';
  attachments?: TaskAttachment[];
  submissions?: TaskSubmission[];
  feedback?: string;
  rating?: number;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface TaskSubmission {
  id: string;
  submittedAt: string;
  files: TaskAttachment[];
  notes?: string;
}

export interface OfferDocument {
  id: string;
  candidateId: string;
  documentType: 'offer_letter' | 'contract' | 'benefits' | 'other';
  name: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  status: 'draft' | 'sent' | 'signed';
}

export interface InternalComment {
  id: string;
  candidateId: string;
  comment: string;
  addedBy: string;
  addedByRole?: string;
  timestamp: string;
  stage?: string;
  subStage?: string;
}
