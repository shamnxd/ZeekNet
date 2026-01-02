
import type { ATSTechnicalTask, ATSOfferDocument } from '@/types/ats';

export type ExtendedATSTechnicalTask = ATSTechnicalTask & {
    documentUrl?: string;
    documentFilename?: string;
    submissionUrl?: string;
    submissionFilename?: string;
    submissionLink?: string;
    submissionNote?: string;
    submittedAt?: string;
};

export type ExtendedATSOfferDocument = ATSOfferDocument & {
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
};

export interface CompensationMeeting {
    id?: string;
    type: string;
    scheduledDate: string;
    location?: string;
    meetingLink?: string;
    status?: string;
    completedAt?: string;
    createdAt: string;
}
