
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import type { JobPostingResponse } from "@/interfaces/job/job-posting-response.interface";
import type { CandidateDetailsResponse } from "@/api/company.api";
import type { ATSComment, ATSCompensation } from "@/types/ats";
import type { ATSStage } from "@/constants/ats-stages";
import type { CompensationMeeting } from "@/types/ats-profile";

export interface CompensationNote {
    comment?: string;
    note?: string;
    recruiterName?: string;
    createdAt: string;
    [key: string]: unknown;
}

export interface CompensationStageProps {
    atsApplication: CompanySideApplication | null;
    selectedStage: string;
    isCurrentStage: (stage: string) => boolean;
    atsJob: JobPostingResponse | null;
    compensationData: ATSCompensation | null;
    candidateData: CandidateDetailsResponse | null;
    compensationNotes: CompensationNote[];
    currentId: string | undefined;
    setShowCompensationInitModal: (show: boolean) => void;
    setShowCompensationUpdateModal: (show: boolean) => void;
    setAtsApplication: (app: CompanySideApplication) => void;
    setCompensationData: (data: ATSCompensation | null) => void;
    setShowRevokeConfirmDialog: (show: boolean) => void;
    getNextStage: (currentStage: ATSStage | string) => ATSStage | null;
    handleMoveToStage: (stage: ATSStage, reason?: string) => Promise<void>;
    compensationMeetings: CompensationMeeting[];
    setShowCompensationMeetingModal: (show: boolean) => void;
    setSelectedMeetingForEdit: (meeting: CompensationMeeting) => void;
    setCompensationMeetings: (meetings: CompensationMeeting[]) => void;
    setShowCommentModal: (show: boolean) => void;
    comments: ATSComment[];
}
