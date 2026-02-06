import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DollarSign,
    Mail,
    Phone,
    MessageCircle,
    Calendar,
    Plus,
    Edit,
    X,
    CheckCircle,
    ChevronRight,
    TrendingUp,
} from "lucide-react";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import type { JobPostingResponse } from "@/interfaces/job/job-posting-response.interface";
import type { CandidateDetailsResponse } from "@/api/company.api";
import {
    ATSStage,
    ATSStageDisplayNames,
    CompensationSubStage,
} from "@/constants/ats-stages";

interface CompensationMeeting {
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

interface CompensationData {
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
}

interface CandidateCompensationStageProps {
    atsApplication: CompanySideApplication | null;
    atsJob: JobPostingResponse | null;
    candidateData: CandidateDetailsResponse | null;
    selectedStage: string;
    currentId?: string;
    compensationData: CompensationData | null;
    compensationMeetings: CompensationMeeting[];
    onSetShowCompensationInitModal: (show: boolean) => void;
    onSetShowCompensationUpdateModal: (show: boolean) => void;
    onSetShowCompensationMeetingModal: (show: boolean) => void;
    onSetSelectedMeetingForEdit: (meeting: CompensationMeeting) => void;
    onSetShowRejectConfirmDialog: (show: boolean) => void;
    onApproveCompensation: () => Promise<void>;
    onMarkMeetingCompleted: (meetingId: string) => Promise<void>;
    onCancelMeeting: (meetingId: string) => Promise<void>;
    onMoveToStage: (targetStage: ATSStage, reason?: string) => Promise<void>;
    onOpenChat: () => Promise<void>;
    formatDateTime: (dateString: string) => string;
    isCurrentStage: (stage: string) => boolean;
    getNextStage: (currentStage: string) => ATSStage | null;
}

export const CandidateCompensationStage = ({
    atsApplication,
    atsJob,
    candidateData,
    selectedStage,
    compensationData,
    compensationMeetings,
    onSetShowCompensationInitModal,
    onSetShowCompensationUpdateModal,
    onSetShowCompensationMeetingModal,
    onSetSelectedMeetingForEdit,
    onSetShowRejectConfirmDialog,
    onApproveCompensation,
    onMarkMeetingCompleted,
    onCancelMeeting,
    onMoveToStage,
    onOpenChat,
    formatDateTime,
    isCurrentStage,
    getNextStage,
}: CandidateCompensationStageProps) => {
    const showActions = isCurrentStage(selectedStage);
    const currentSubStage =
        atsApplication?.subStage || CompensationSubStage.NOT_INITIATED;

    const jobSalaryMin = atsJob?.salary?.min || 0;
    const jobSalaryMax = atsJob?.salary?.max || 0;
    const jobSalaryRange =
        jobSalaryMin > 0 && jobSalaryMax > 0
            ? `₹${(jobSalaryMin / 100000).toFixed(1)}L - ₹${(
                jobSalaryMax / 100000
            ).toFixed(1)}L`
            : "Not specified";

    const candidateExpected = compensationData?.candidateExpected || "";
    const companyProposed = compensationData?.companyProposed || "";
    const finalAgreed = compensationData?.finalAgreed || "";
    const benefits = compensationData?.benefits || [];
    const expectedJoining = compensationData?.expectedJoining || "";
    const approvedAt = compensationData?.approvedAt || "";
    const approvedBy = compensationData?.approvedBy || "";

    const candidateEmail =
        candidateData?.user?.email || atsApplication?.email || "";
    const candidatePhone =
        candidateData?.profile?.phone || atsApplication?.phone || "";

    const hasExpectedSalary = !!candidateExpected;
    const hasNotesOrUpdates =
        !!companyProposed ||
        (compensationData?.updatedAt &&
            compensationData?.createdAt &&
            new Date(compensationData.updatedAt) >
            new Date(compensationData.createdAt));
    const canApprove = hasExpectedSalary && hasNotesOrUpdates;

    return (
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
            {/* Header with Action Bar */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Compensation Stage
                    </h3>
                </div>

                {/* Compact Action Bar */}
                {showActions && (
                    <div className="flex items-center gap-2 mb-4">
                        {candidateEmail && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                    (window.location.href = `mailto:${candidateEmail}`)
                                }
                                className="gap-2"
                            >
                                <Mail className="h-4 w-4" />
                                Email
                            </Button>
                        )}
                        {candidatePhone && candidatePhone !== "-" && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => (window.location.href = `tel:${candidatePhone}`)}
                                className="gap-2"
                            >
                                <Phone className="h-4 w-4" />
                                <p> {candidatePhone} </p>
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onOpenChat}
                            className="gap-2"
                        >
                            <MessageCircle className="h-4 w-4" />
                            Chat
                        </Button>
                    </div>
                )}
            </div>

            {/* Compensation Summary Section */}
            <div className="bg-white rounded-lg p-6 border">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-amber-600" />
                    Compensation Summary
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Stage</p>
                        <p className="text-sm font-medium text-gray-900">Compensation</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="text-sm font-medium text-gray-900">
                            {currentSubStage === CompensationSubStage.NOT_INITIATED
                                ? "Not Initiated"
                                : currentSubStage === CompensationSubStage.INITIATED
                                    ? "Initiated"
                                    : currentSubStage === CompensationSubStage.NEGOTIATION_ONGOING
                                        ? "Negotiation Ongoing"
                                        : "Approved"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Company Budget Range</p>
                        <p className="text-sm font-medium text-gray-900">
                            {jobSalaryRange}
                        </p>
                    </div>
                    {currentSubStage !== CompensationSubStage.NOT_INITIATED && (
                        <>
                            {finalAgreed ? (
                                <div>
                                    <p className="text-sm text-gray-600">Final Agreed Range</p>
                                    <p className="text-sm font-medium text-green-700">
                                        {finalAgreed}
                                    </p>
                                </div>
                            ) : companyProposed ? (
                                <div>
                                    <p className="text-sm text-gray-600">Proposed Range</p>
                                    <p className="text-sm font-medium text-amber-700">
                                        {companyProposed}
                                    </p>
                                </div>
                            ) : null}
                            {expectedJoining && (
                                <div>
                                    <p className="text-sm text-gray-600">Expected Joining</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(expectedJoining).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                    {currentSubStage === CompensationSubStage.APPROVED &&
                        approvedAt && (
                            <div>
                                <p className="text-sm text-gray-600">Approved On</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {formatDateTime(approvedAt)}
                                </p>
                            </div>
                        )}
                </div>
                {benefits.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-600 mb-2">Benefits</p>
                        <div className="flex flex-wrap gap-2">
                            {benefits.map((benefit: string, idx: number) => (
                                <Badge
                                    key={idx}
                                    variant="outline"
                                    className="bg-amber-50 text-amber-700 border-amber-200"
                                >
                                    {benefit}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Expected Salary Summary Row */}
            <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <p className="text-sm text-gray-600">
                            Candidate Expected Salary:
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                            {candidateExpected || "—"}
                        </p>
                        {currentSubStage === CompensationSubStage.NEGOTIATION_ONGOING && (
                            <Badge
                                variant="outline"
                                className="bg-amber-50 text-amber-700 border-amber-200"
                            >
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Negotiation in Progress
                            </Badge>
                        )}
                    </div>
                    {showActions &&
                        currentSubStage === CompensationSubStage.NOT_INITIATED && (
                            <Button
                                size="sm"
                                variant="default"
                                onClick={() => onSetShowCompensationInitModal(true)}
                                className="bg-[#4640DE] hover:bg-[#3730A3]"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Compensation
                            </Button>
                        )}
                </div>
            </div>

            {/* Initiated State */}
            {currentSubStage === CompensationSubStage.INITIATED && (
                <div className="bg-white rounded-lg p-6 border space-y-4">
                    <h4 className="font-semibold text-gray-900">
                        Compensation Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">
                                Candidate Expected Salary
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                                {candidateExpected || "Not specified"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">
                                Company Budget Range
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                                {jobSalaryRange}
                            </p>
                        </div>
                    </div>
                    {showActions && (
                        <div className="flex gap-2 pt-4 border-t">
                            <Button
                                variant="outline"
                                onClick={() => onSetShowCompensationUpdateModal(true)}
                                className="gap-2"
                            >
                                <Edit className="h-4 w-4" />
                                Update Compensation
                            </Button>
                            {canApprove && (
                                <Button
                                    onClick={onApproveCompensation}
                                    className="bg-green-600 hover:bg-green-700 text-white gap-2"
                                >
                                    <CheckCircle className="h-4 w-4" />
                                    Approve Compensation
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                onClick={() => onSetShowRejectConfirmDialog(true)}
                                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <X className="h-4 w-4" />
                                Reject Candidate
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Approved State */}
            {currentSubStage === CompensationSubStage.APPROVED && (
                <div className="bg-white rounded-lg p-6 border space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Compensation Approved
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">
                                Final Agreed Salary
                            </p>
                            <p className="text-sm font-medium text-green-700">
                                {finalAgreed || companyProposed || "Not set"}
                            </p>
                        </div>
                        {expectedJoining && (
                            <div>
                                <p className="text-sm text-gray-600 mb-1">
                                    Expected Joining Date
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                    {new Date(expectedJoining).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        )}
                    </div>
                    {benefits.length > 0 && (
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Benefits Summary</p>
                            <ul className="list-disc list-inside space-y-1">
                                {benefits.map((benefit: string, idx: number) => (
                                    <li key={idx} className="text-sm text-gray-700">
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {approvedAt && (
                        <div className="pt-4 border-t">
                            <p className="text-xs text-gray-500">
                                Approved on {formatDateTime(approvedAt)} by{" "}
                                {approvedBy || "Recruiter"}
                            </p>
                        </div>
                    )}
                    {showActions && (
                        <div className="pt-4 border-t">
                            <Button
                                onClick={() => {
                                    const nextStage = getNextStage(ATSStage.COMPENSATION);
                                    if (nextStage) {
                                        onMoveToStage(nextStage);
                                    }
                                }}
                                className="bg-[#4640DE] hover:bg-[#3730A3] gap-2"
                            >
                                <ChevronRight className="h-4 w-4" />
                                Proceed to Offer
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Discussion / Meeting History */}
            {currentSubStage !== CompensationSubStage.NOT_INITIATED && (
                <div className="bg-white rounded-lg p-6 border">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-amber-600" />
                            Discussion / Meeting History
                        </h4>
                        {showActions &&
                            currentSubStage !== CompensationSubStage.APPROVED && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onSetShowCompensationMeetingModal(true)}
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Meeting
                                </Button>
                            )}
                    </div>

                    {compensationMeetings.length > 0 ? (
                        <div className="space-y-3">
                            {compensationMeetings
                                .filter((meeting) => meeting != null)
                                .map((meeting: CompensationMeeting, idx: number) => {
                                    const meetingType = meeting?.type || "call";

                                    const isCompleted = meeting.status === "completed";
                                    const isCancelled = meeting.status === "cancelled";
                                    return (
                                        <div
                                            key={idx}
                                            className={`border rounded-lg p-4 ${isCompleted
                                                ? "bg-green-50 border-green-200"
                                                : isCancelled
                                                    ? "bg-gray-50 border-gray-200"
                                                    : ""
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="text-sm font-medium text-gray-900 capitalize">
                                                            {meetingType}
                                                        </p>
                                                        <Badge variant="outline" className="text-xs">
                                                            {meetingType}
                                                        </Badge>
                                                        {isCompleted && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs bg-green-100 text-green-700 border-green-300"
                                                            >
                                                                Completed
                                                            </Badge>
                                                        )}
                                                        {isCancelled && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs bg-gray-100 text-gray-700 border-gray-300"
                                                            >
                                                                Cancelled
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        {formatDateTime(
                                                            meeting.scheduledDate || meeting.createdAt || ""
                                                        )}
                                                    </p>
                                                    {isCompleted && meeting.completedAt && (
                                                        <p className="text-xs text-green-600 mt-1">
                                                            Completed on{" "}
                                                            {formatDateTime(meeting.completedAt)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {meeting.location && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Location: {meeting.location}
                                                </p>
                                            )}
                                            {meeting.meetingLink && (
                                                <a
                                                    href={meeting.meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-[#4640DE] hover:underline mt-1 block"
                                                >
                                                    Meeting Link: {meeting.meetingLink}
                                                </a>
                                            )}
                                            {meeting.notes && (
                                                <div className="mt-3 pt-3 border-t">
                                                    <p className="text-xs font-medium text-gray-600 mb-1">
                                                        Notes / Outcome:
                                                    </p>
                                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                        {meeting.notes}
                                                    </p>
                                                </div>
                                            )}
                                            {showActions &&
                                                currentSubStage !== CompensationSubStage.APPROVED &&
                                                !isCompleted &&
                                                !isCancelled && (
                                                    <div className="flex gap-2 mt-3 pt-3 border-t">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                onSetSelectedMeetingForEdit(meeting);
                                                                onSetShowCompensationMeetingModal(true);
                                                            }}
                                                            className="gap-2"
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                            Update
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                meeting.id &&
                                                                onMarkMeetingCompleted(meeting.id)
                                                            }
                                                            className="gap-2 text-green-600 hover:text-green-700"
                                                        >
                                                            <CheckCircle className="h-3 w-3" />
                                                            Mark as Completed
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                meeting.id && onCancelMeeting(meeting.id)
                                                            }
                                                            className="gap-2 text-red-600 hover:text-red-700"
                                                        >
                                                            <X className="h-3 w-3" />
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                )}
                                        </div>
                                    );
                                })}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">
                            No meetings scheduled yet
                        </p>
                    )}
                </div>
            )}

            {/* Move to Next Stage */}
            {showActions &&
                currentSubStage !== CompensationSubStage.NOT_INITIATED && (
                    <div className="flex flex-col gap-3">
                        {(() => {
                            const nextStage = getNextStage(ATSStage.COMPENSATION);
                            if (!nextStage) return null;
                            const nextStageDisplayName =
                                ATSStageDisplayNames[nextStage] || nextStage;
                            return (
                                <Button
                                    variant="outline"
                                    className="gap-2 border-[#4640DE] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
                                    onClick={() => onMoveToStage(nextStage)}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                    Move to {nextStageDisplayName}
                                </Button>
                            );
                        })()}
                    </div>
                )}
        </div>
    );
};
