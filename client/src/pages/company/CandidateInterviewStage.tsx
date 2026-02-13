import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle2,
    Clock,
    Calendar,
    Video,
    Star,
    Plus,
    X,
    MessageSquare,
    ChevronRight,
    Zap,
    Loader2,
} from "lucide-react";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import type { ATSInterview, ATSComment } from "@/types/ats";
import { formatATSStage, formatATSSubStage } from "@/utils/formatters";
import {
    ATSStage,
    ATSStageDisplayNames,
    InterviewSubStage,
    STAGE_SUB_STAGES,
} from "@/constants/ats-stages";

interface CandidateInterviewStageProps {
    atsApplication: CompanySideApplication | null;
    selectedStage: string;
    interviews: ATSInterview[];
    comments: ATSComment[];
    onSetShowScheduleModal: (show: boolean) => void;
    onSetShowCommentModal: (show: boolean) => void;
    onSetShowMoveToStageModal: (show: boolean) => void;
    onSetSelectedInterviewForReschedule: (interview: ATSInterview) => void;
    onSetSelectedInterviewForFeedback: (interview: ATSInterview) => void;
    onSetShowFeedbackModal: (show: boolean) => void;
    onMarkInterviewComplete: (interviewId: string) => Promise<void>;
    onCancelInterview: (interviewId: string) => Promise<void>;
    onMoveToStage: (targetStage: ATSStage, reason?: string) => Promise<void>;
    formatDateTime: (dateString: string) => string;
    isCurrentStage: (stage: string) => boolean;
    getNextStage: (currentStage: string) => ATSStage | null;
    isUpdating?: boolean;
}

export const CandidateInterviewStage = ({
    atsApplication,
    selectedStage,
    interviews,
    comments,
    onSetShowScheduleModal,
    onSetShowCommentModal,
    onSetShowMoveToStageModal,
    onSetSelectedInterviewForReschedule,
    onSetSelectedInterviewForFeedback,
    onSetShowFeedbackModal,
    onMarkInterviewComplete,
    onCancelInterview,
    onMoveToStage,
    formatDateTime,
    isCurrentStage,
    getNextStage,
    isUpdating = false,
}: CandidateInterviewStageProps) => {
    const navigate = useNavigate();
    const showActions = isCurrentStage(selectedStage);

    // Derive sub-stage from interview data with explicit typing
    const scheduledInterviews = interviews.filter((i) => i.status === "scheduled");
    const completedInterviews = interviews.filter((i) => i.status === "completed");

    let currentSubStage: InterviewSubStage = InterviewSubStage.NOT_SCHEDULED;
    if (scheduledInterviews.length > 0) {
        currentSubStage = InterviewSubStage.SCHEDULED;
    } else if (completedInterviews.length > 0) {
        const hasPendingFeedback = completedInterviews.some(i => !i.feedback || !i.rating);
        currentSubStage = hasPendingFeedback ? InterviewSubStage.EVALUATION_PENDING : InterviewSubStage.COMPLETED;
    }

    const subStages = STAGE_SUB_STAGES[ATSStage.INTERVIEW] || [];
    const interviewsConducted = completedInterviews.length;
    const upcomingInterview = scheduledInterviews[0];

    return (
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
            {/* Interview Summary */}
            <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Interview Summary
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600">Stage: Interview</span>
                            <div className="flex gap-1 ml-4">
                            </div>
                        </div>
                    </div>
                    <Badge
                        className={
                            currentSubStage === InterviewSubStage.COMPLETED
                                ? "bg-green-100 text-green-700"
                                : currentSubStage === InterviewSubStage.EVALUATION_PENDING
                                    ? "bg-yellow-100 text-yellow-700"
                                    : currentSubStage === InterviewSubStage.SCHEDULED
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-700"
                        }
                    >
                        {subStages.find(s => s.key === currentSubStage)?.label || (currentSubStage as string)}
                    </Badge>
                </div>

                {showActions && (
                    <div className="flex justify-end mt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 border-[#4640DE] text-[#4640DE] hover:bg-[#4640DE] hover:text-white transition-all shadow-sm"
                            onClick={() => onSetShowMoveToStageModal(true)}
                        >
                            <Zap className="h-4 w-4 fill-current" />
                            Quick Action
                        </Button>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <p className="text-sm text-gray-600">Interviews Conducted</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {interviewsConducted}
                        </p>
                    </div>
                    {upcomingInterview && (
                        <div>
                            <p className="text-sm text-gray-600">Upcoming Interview</p>
                            <p className="text-sm font-medium text-gray-900">
                                {upcomingInterview.title}
                            </p>
                            <p className="text-xs text-gray-500">
                                {formatDateTime(upcomingInterview.scheduledDate)}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Interview Timeline */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Interview Timeline</h4>
                    {showActions && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => onSetShowScheduleModal(true)}
                        >
                            <Plus className="h-4 w-4" />
                            Schedule Another Interview
                        </Button>
                    )}
                </div>

                <div className="space-y-4">
                    {interviews.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 bg-white rounded-lg border">
                            No interviews scheduled yet
                        </div>
                    ) : (
                        interviews.map((interview, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-4 border">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${interview.status === "completed"
                                                ? "bg-green-100"
                                                : "bg-blue-100"
                                                }`}
                                        >
                                            {interview.status === "completed" ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            ) : (
                                                <Clock className="h-5 w-5 text-blue-600" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                {interview.title}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {interview.type === "online" ? "Online" : "In-Person"}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        className={
                                            interview.status === "completed"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-blue-100 text-blue-700"
                                        }
                                    >
                                        {interview.status}
                                    </Badge>
                                </div>

                                <div className="pl-13 space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDateTime(interview.scheduledDate)}</span>
                                    </div>
                                    {interview.meetingLink &&
                                        interview.status === "scheduled" && (
                                            <a
                                                href={interview.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#4640DE] hover:underline flex items-center gap-2"
                                            >
                                                <Video className="h-4 w-4" />
                                                Join Meeting
                                            </a>
                                        )}
                                    {interview.feedback && (
                                        <div className="mt-3 p-3 bg-gray-50 rounded">
                                            <p className="text-sm font-medium text-gray-900 mb-1">
                                                Feedback:
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {interview.feedback}
                                            </p>
                                            {interview.rating && (
                                                <div className="flex items-center gap-1 mt-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`h-4 w-4 ${interview.rating && star <= (interview.rating || 0)
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-gray-300"
                                                                }`}
                                                        />
                                                    ))}
                                                    <span className="text-sm text-gray-700 ml-2">
                                                        {interview.rating}/5
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Per-interview actions */}
                                {showActions && (
                                    <div className="mt-3 pt-3 border-t flex gap-2 flex-wrap">
                                        {interview.status === "scheduled" && (
                                            <>
                                                {("videoType" in interview) &&
                                                    (interview as unknown as { videoType: string })
                                                        .videoType === "in-app" &&
                                                    ("webrtcRoomId" in interview) &&
                                                    (interview as unknown as { webrtcRoomId: string })
                                                        .webrtcRoomId ? (
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        onClick={() =>
                                                            navigate(
                                                                `/video-call/${(
                                                                    interview as unknown as {
                                                                        webrtcRoomId: string;
                                                                    }
                                                                ).webrtcRoomId
                                                                }`
                                                            )
                                                        }
                                                        className="mb-2"
                                                    >
                                                        <Video className="h-3.5 w-3.5 mr-1" />
                                                        Join In-App Video
                                                    </Button>
                                                ) : interview.meetingLink ? (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            window.open(interview.meetingLink as string, "_blank")
                                                        }
                                                    >
                                                        <Video className="h-3.5 w-3.5 mr-1" />
                                                        Join External Link
                                                    </Button>
                                                ) : null}
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        onSetSelectedInterviewForReschedule(interview);
                                                        onSetShowScheduleModal(true);
                                                    }}
                                                >
                                                    <Calendar className="h-3.5 w-3.5 mr-1" />
                                                    Reschedule
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onCancelInterview(interview.id)}
                                                >
                                                    <X className="h-3.5 w-3.5 mr-1" />
                                                    Cancel
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-[#4640DE] hover:bg-[#3730A3]"
                                                    onClick={() => onMarkInterviewComplete(interview.id)}
                                                >
                                                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                                    Mark as Complete
                                                </Button>
                                            </>
                                        )}
                                        {interview.status === "completed" &&
                                            (!interview.feedback || !interview.rating) && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        onSetSelectedInterviewForFeedback(interview);
                                                        onSetShowFeedbackModal(true);
                                                    }}
                                                >
                                                    <Star className="h-3.5 w-3.5 mr-1" />
                                                    Add Feedback
                                                </Button>
                                            )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add Comment and Move to Stage buttons */}
            {showActions && (
                <div className="flex flex-col gap-3">
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => onSetShowCommentModal(true)}
                    >
                        <MessageSquare className="h-4 w-4" />
                        Add Comment
                    </Button>

                    {/* Move to Next Stage button */}
                    {(() => {
                        const nextStage = atsApplication?.stage
                            ? getNextStage(atsApplication.stage)
                            : null;
                        if (!nextStage) return null;
                        const nextStageDisplayName =
                            ATSStageDisplayNames[nextStage] || nextStage;
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
                                Move to {nextStageDisplayName}
                            </Button>
                        );
                    })()}

                </div>
            )}

            {/* Show comments */}
            {showActions &&
                comments.filter((c) => String(c.stage).toUpperCase() === ATSStage.INTERVIEW).length > 0 && (
                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="font-medium text-gray-900">Comments</h4>
                        {comments
                            .filter((c) => String(c.stage).toUpperCase() === ATSStage.INTERVIEW)
                            .map((comment, idx) => (
                                <div key={idx} className="bg-white rounded-lg p-4 border">
                                    <p className="text-sm text-gray-700">{comment.comment}</p>
                                    <p className="text-xs text-blue-600 font-medium mt-1">
                                        {formatATSStage(comment.stage)} {comment.subStage ? `• ${formatATSSubStage(comment.subStage)}` : ''}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {formatDateTime(
                                            comment.createdAt || comment.timestamp || ""
                                        )}
                                    </p>
                                </div>
                            ))}
                    </div>
                )}
        </div>
    );
};
