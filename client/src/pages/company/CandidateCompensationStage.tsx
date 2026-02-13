import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    MessageSquare,
    ChevronRight,
    DollarSign,
    Briefcase,
    CheckCircle2,
    Calendar,
    Video,
    Edit,
    X,
    Zap,
    Loader2,
} from "lucide-react";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import type { SeekerProfile } from "@/interfaces/seeker/seeker.interface";
import {
    ATSStage,
    CompensationSubStage,
    STAGE_SUB_STAGES,
} from "@/constants/ats-stages";
import type {
    CompensationData,
    CompensationMeeting,
} from "./CandidateProfileTypes";

interface CandidateCompensationStageProps {
    atsApplication: CompanySideApplication | null;
    candidateData: {
        profile: Partial<SeekerProfile>;
    } | null;
    selectedStage: string;
    compensationData: CompensationData | null;
    compensationMeetings: CompensationMeeting[];
    onSetShowCompensationInitModal: (show: boolean) => void;
    onSetShowCompensationUpdateModal: (show: boolean) => void;
    onSetShowCompensationMeetingModal: (show: boolean) => void;
    onSetSelectedMeetingForEdit: (meeting: CompensationMeeting) => void;
    onSetShowRejectConfirmDialog: (show: boolean) => void;
    onApproveCompensation: () => Promise<void>;
    onMarkMeetingCompleted: (id: string) => Promise<void>;
    onCancelMeeting: (id: string) => Promise<void>;
    onMoveToStage: (targetStage: ATSStage, reason?: string) => Promise<void>;
    onSetShowMoveToStageModal: (show: boolean) => void;
    onOpenChat: () => void;
    formatDateTime: (dateString: string) => string;
    isCurrentStage: (stage: string) => boolean;
    getNextStage: (currentStage: string) => ATSStage | null;
    isUpdating?: boolean;
}

export const CandidateCompensationStage = ({
    atsApplication,
    candidateData,
    selectedStage,
    compensationData,
    compensationMeetings,
    onSetShowCompensationInitModal,
    onSetShowCompensationUpdateModal,
    onSetShowCompensationMeetingModal,
    onSetSelectedMeetingForEdit,
    onApproveCompensation,
    onMarkMeetingCompleted,
    onCancelMeeting,
    onMoveToStage,
    onSetShowMoveToStageModal,
    formatDateTime,
    isCurrentStage,
    getNextStage,
    isUpdating = false,
}: CandidateCompensationStageProps) => {
    const showActions = isCurrentStage(selectedStage);

    // Derive sub-stage from compensation data
    let currentSubStage: CompensationSubStage = CompensationSubStage.NOT_INITIATED;
    if (compensationData?.approvedAt) {
        currentSubStage = CompensationSubStage.APPROVED;
    } else if (compensationMeetings.length > 0) {
        currentSubStage = CompensationSubStage.NEGOTIATION_ONGOING;
    } else if (compensationData) {
        currentSubStage = CompensationSubStage.INITIATED;
    }

    const subStages = STAGE_SUB_STAGES[ATSStage.COMPENSATION] || [];
    const expectedSalary = candidateData?.profile.expectedSalary || "N/A";

    return (
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Compensation Stage
                    </h3>
                    <div className="flex gap-1 mt-2">
                    </div>
                </div>

                {showActions && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-[#4640DE] text-[#4640DE] hover:bg-[#4640DE] hover:text-white transition-all shadow-sm"
                        onClick={() => onSetShowMoveToStageModal(true)}
                    >
                        <Zap className="h-4 w-4 fill-current" />
                        Quick Action
                    </Button>
                )}

                <Badge
                    className={
                        currentSubStage === CompensationSubStage.APPROVED
                            ? "bg-green-100 text-green-700"
                            : currentSubStage === CompensationSubStage.NEGOTIATION_ONGOING
                                ? "bg-blue-100 text-blue-700"
                                : currentSubStage === CompensationSubStage.INITIATED
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-gray-100 text-gray-700"
                    }
                >
                    {subStages.find(s => s.key === currentSubStage)?.label || (currentSubStage as string)}
                </Badge>
            </div>

            {/* Candidate Expectations */}
            <div className="bg-white rounded-lg p-6 border flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                        <Briefcase className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Expected salary</p>
                        <p className="text-lg font-bold text-gray-900 leading-tight">
                            {expectedSalary}
                        </p>
                    </div>
                </div>
            </div>

            {/* NOT_INITIATED: Show "No compensation data" message and Initiate button */}
            {currentSubStage === CompensationSubStage.NOT_INITIATED && (
                <div className="bg-white rounded-lg p-6 border text-center">
                    <p className="text-gray-600 mb-4">No compensation data recorded yet</p>
                    {showActions && (
                        <Button
                            onClick={() => onSetShowCompensationInitModal(true)}
                            className="bg-[#4640DE] hover:bg-[#3730A3]"
                        >
                            Initiate Compensation
                        </Button>
                    )}
                </div>
            )}

            {/* Current Offer Section */}
            {compensationData && (
                <div className="bg-white rounded-lg p-6 border space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            Current Offer Details
                        </h4>
                        {showActions && currentSubStage !== CompensationSubStage.APPROVED && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-[#4640DE]"
                                onClick={() => onSetShowCompensationUpdateModal(true)}
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Offer
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Base Salary</p>
                            <p className="text-md font-bold text-gray-900">
                                {compensationData.baseSalary}{" "}
                                <span className="text-xs text-gray-500 font-normal">
                                    /{compensationData.salaryFrequency || "year"}
                                </span>
                            </p>
                        </div>
                        {compensationData.bonus && (
                            <div>
                                <p className="text-sm text-gray-600">Annual Bonus</p>
                                <p className="text-md font-bold text-gray-900">
                                    {compensationData.bonus}
                                </p>
                            </div>
                        )}
                    </div>

                    {currentSubStage === CompensationSubStage.APPROVED ? (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200 flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-green-900">
                                This offer has been approved internally.
                            </span>
                        </div>
                    ) : (
                        showActions && (
                            <div className="pt-4 border-t">
                                <Button
                                    onClick={onApproveCompensation}
                                    className="bg-green-600 hover:bg-green-700 text-white gap-2"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Approve Internally
                                </Button>
                            </div>
                        )
                    )}
                </div>
            )}

            {/* Negotiation Meetings */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">Negotiation Meetings</h4>
                    {showActions && currentSubStage !== CompensationSubStage.APPROVED && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => onSetShowCompensationMeetingModal(true)}
                        >
                            <Calendar className="h-4 w-4" />
                            Schedule Meeting
                        </Button>
                    )}
                </div>

                <div className="space-y-3">
                    {compensationMeetings.length === 0 ? (
                        <p className="text-sm text-gray-500 italic py-4 text-center bg-white rounded-lg border">
                            No meetings scheduled
                        </p>
                    ) : (
                        compensationMeetings.map((meeting) => (
                            <div
                                key={meeting.id}
                                className="bg-white rounded-lg p-4 border flex items-start justify-between"
                            >
                                <div className="space-y-2">
                                    <h5 className="font-medium text-gray-900 truncate">
                                        {meeting.title}
                                    </h5>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-4 w-4" />
                                            {formatDateTime(meeting.scheduledDate)}
                                        </div>
                                        <Badge
                                            className={
                                                meeting.status === "completed"
                                                    ? "bg-green-100 text-green-700"
                                                    : meeting.status === "cancelled"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-blue-100 text-blue-700"
                                            }
                                        >
                                            {meeting.status}
                                        </Badge>
                                    </div>
                                    {meeting.meetingLink && (
                                        <a
                                            href={meeting.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#4640DE] hover:underline flex items-center gap-1.5 text-sm"
                                        >
                                            <Video className="h-4 w-4" />
                                            Meeting Link
                                        </a>
                                    )}
                                </div>
                                {showActions && meeting.status === "scheduled" && (
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                onSetSelectedMeetingForEdit(meeting);
                                                onSetShowCompensationMeetingModal(true);
                                            }}
                                        >
                                            <Edit className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onCancelMeeting(meeting.id || "")}
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => onMarkMeetingCompleted(meeting.id || "")}
                                        >
                                            Done
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Final Actions */}
            {showActions && (
                <div className="flex flex-col gap-3">
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => { }} // Internal notes can be handled by comments if integrated
                    >
                        <MessageSquare className="h-4 w-4" />
                        Internal Notes
                    </Button>

                    {/* Move to Next Stage button */}
                    {(() => {
                        const nextStage = atsApplication?.stage
                            ? getNextStage(atsApplication.stage)
                            : null;
                        if (!nextStage) return null;
                        return (
                            <Button
                                variant="outline"
                                className="gap-2 border-[#4640DE] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
                                onClick={() => onMoveToStage(nextStage)}
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                                Move to Offer Stage
                            </Button>
                        );
                    })()}
                </div>
            )}
        </div>
    );
};
