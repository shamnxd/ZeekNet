import type { ATSTechnicalTask, ATSOfferDocument } from "@/types/ats";

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

export interface CompensationData {
    candidateExpected?: string;
    companyProposed?: string;
    finalAgreed?: string;
    expectedJoining?: string;
    benefits?: string[];
    approvedAt?: string;
    approvedBy?: string;
    approvedByName?: string;
    createdAt?: string;
    updatedAt?: string;
    notes?: string;
}

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
    employmentType?: string;
};

export interface InterviewFormData {
    date: string;
    time: string;
    title: string;
    type: 'online' | 'offline';
    videoType?: 'in-app' | 'external';
    meetingLink?: string;
    location?: string;
}

export interface TaskFormData {
    title: string;
    description: string;
    deadline: string;
    document?: File;
    documentUrl?: string;
    documentFilename?: string;
    status?: string;
}

export interface CompensationFormData {
    candidateExpected?: string;
    companyProposed?: string;
    benefits?: string[];
    expectedJoining?: string;
    notes?: string;
}

export interface CompensationMeetingFormData {
    type: string;
    videoType?: 'in-app' | 'external';
    date: string;
    time: string;
    location?: string;
    meetingLink?: string;
    notes?: string;
}

export interface OfferFormData {
    offerAmount: string;
    document?: File;
    notes?: string;
}
