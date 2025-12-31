import { ATSStage } from '@/constants/ats-stages';

export interface ATSJob {
  jobId: string;
  jobTitle: string;
  department: string;
  location: string;
  employmentType: string;
  enabledStages: ATSStage[];
  totalCandidates: number;
  createdAt: string;
}

export interface ATSCandidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  role: string;
  jobId: string;
  stage: ATSStage;
  subStage?: string;
  atsScore: number;
  appliedDate: string;
  interviewDate?: string;
  taskDeadline?: string;
  offerAmount?: string;
  skills: string[];
  experience: string;
  education: string;
}

export interface ATSActivity {
  id: string;
  candidateId: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  performedBy: string;
  stage?: ATSStage;
  subStage?: string;
}

export interface ATSInterview {
  id: string;
  candidateId: string;
  title: string;
  type: 'online' | 'offline';
  scheduledDate: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  videoType?: 'in-app' | 'external';
  webrtcRoomId?: string;
  meetingLink?: string;
  location?: string;
  rating?: number;
  feedback?: string;
  notes?: string;
}

export interface ATSTechnicalTask {
  id: string;
  candidateId?: string;
  applicationId?: string;
  title: string;
  description: string;
  assignedDate?: string;
  deadline: string;
  status: 'assigned' | 'submitted' | 'under_review' | 'completed' | 'cancelled';
  documentUrl?: string;
  documentFilename?: string;
  submissionUrl?: string;
  submissionFilename?: string;
  submissionLink?: string;
  submissionNote?: string;
  submittedAt?: string;
  attachments?: { name: string; url: string }[];
  submissions?: { name: string; url: string; submittedAt: string }[];
  rating?: number;
  feedback?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ATSOfferDocument {
  id: string;
  candidateId?: string;
  applicationId?: string;
  name?: string;
  documentUrl?: string;
  documentFilename?: string;
  documentType?: 'offer_letter' | 'contract' | 'other';
  uploadedAt?: string;
  uploadedBy?: string;
  uploadedByName?: string;
  url?: string;
  offerAmount?: string;
  status: 'draft' | 'sent' | 'signed' | 'declined';
  sentAt?: string;
  signedAt?: string;
  declinedAt?: string;
  signedDocumentUrl?: string;
  signedDocumentFilename?: string;
  withdrawalReason?: string;
  withdrawnByName?: string;
  employmentType?: string;
  declineReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ATSComment {
  id: string;
  candidateId?: string;
  applicationId?: string;
  stage: ATSStage;
  subStage?: string;
  comment: string;
  addedBy?: string;
  addedByName?: string;
  recruiterName?: string;
  timestamp?: string;
  createdAt?: string;
}
