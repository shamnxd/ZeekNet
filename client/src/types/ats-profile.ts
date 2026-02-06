
import type { ATSTechnicalTask, ATSOfferDocument } from "@/types/ats";

export interface ExtendedATSTechnicalTask extends ATSTechnicalTask {
  documentUrl?: string;
  documentFilename?: string;
  submissionUrl?: string;
  submissionFilename?: string;
  submissionLink?: string;
  submissionNote?: string;
  submittedAt?: string;
}

export interface ExtendedATSOfferDocument extends ATSOfferDocument {
  documentUrl?: string;
  documentFilename?: string;
  offerAmount?: string;
  sentAt?: string;
  signedAt?: string;
  declinedAt?: string;
  signedDocumentUrl?: string;
  signedDocumentFilename?: string;
  withdrawalReason?: string;
  withdrawnByName?: string;
  declineReason?: string;
  employmentType?: string;
}



export interface CompensationMeeting {
  id?: string;
  type: "call" | "online" | "in-person";
  scheduledDate: string;
  location?: string;
  meetingLink?: string;
  notes?: string;
  status?: "scheduled" | "completed" | "cancelled";
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
