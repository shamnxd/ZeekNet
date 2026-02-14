import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    MessageSquare,
    ChevronRight,
    Video,
    X,
    Plus,
    Clock,
    CheckCircle2,
    Star,
} from "lucide-react";
import {
    ATSStage,
    InterviewSubStage,
    ATSStageDisplayNames,
} from "@/constants/ats-stages";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import type { ATSComment, ATSInterview } from "@/types/ats";
import { formatDateTime, formatATSStage, formatATSSubStage } from "@/utils/formatters";

interface InterviewStageProps {
    interviewSummary: {
        overallStatus: string;
        interviewsConducted: number;
        upcomingInterview: {
            title: string;
            scheduledDate: string;
        } | null;
    };
    atsApplication: CompanySideApplication | null;
    selectedStage: string;
    isCurrentStage: (stage: string) => boolean;
    setShowScheduleModal: (show: boolean) => void;
    interviews: ATSInterview[];
    setSelectedInterviewForReschedule: (interview: ATSInterview) => void;
    handleCancelInterview: (interviewId: string) => Promise<void>;
    handleMarkInterviewComplete: (interviewId: string) => Promise<void>;
    setSelectedInterviewForFeedback: (interview: ATSInterview) => void;
    setShowFeedbackModal: (show: boolean) => void;
    setShowCommentModal: (show: boolean) => void;
    getNextStage: (currentStage: string) => ATSStage | null;
    handleMoveToStage: (stage: ATSStage, reason?: string) => Promise<void>;
    hasNextStages: (currentStage: ATSStage | string) => boolean;
    setShowMoveToStageModal: (show: boolean) => void;
    comments: ATSComment[];
}

export const InterviewStage = ({
    interviewSummary,
    atsApplication,
    selectedStage,
    isCurrentStage,
    setShowScheduleModal,
    interviews,
    setSelectedInterviewForReschedule,
    handleCancelInterview,
    handleMarkInterviewComplete,
    setSelectedInterviewForFeedback,
    setShowFeedbackModal,
    setShowCommentModal,
    getNextStage,
    handleMoveToStage,
    hasNextStages,
    setShowMoveToStageModal,
    comments,
}: InterviewStageProps) => {
    const navigate = useNavigate();
    const { overallStatus, interviewsConducted, upcomingInterview } =
        interviewSummary;
    const currentSubStage =
        atsApplication?.subStage || InterviewSubStage.NOT_SCHEDULED;

    const showActions = isCurrentStage(selectedStage);

    return (
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
            { }
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Interview Stage
                </h3>
                {showActions && (
                    <Badge className="bg-purple-100 text-purple-700 mb-4">
                        Current Sub-stage:{" "}
                        {currentSubStage === InterviewSubStage.NOT_SCHEDULED
                            ? "Not Scheduled"
                            : currentSubStage === InterviewSubStage.SCHEDULED
                                ? "Scheduled"
                                : currentSubStage === InterviewSubStage.COMPLETED
                                    ? "Completed"
                                    : currentSubStage === InterviewSubStage.EVALUATION_PENDING
                                        ? "Evaluation Pending"
                                        : currentSubStage}
                    </Badge>
                )}
            </div>

            { }
            <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Interview Summary
                        </h3>
                        <p className="text-sm text-gray-600">Stage: Interview</p>
                    </div>
                    <Badge
                        className={
                            overallStatus === "Ready for Decision"
                                ? "bg-green-100 text-green-700"
                                : overallStatus === "Evaluation Pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-blue-100 text-blue-700"
                        }
                    >
                        {overallStatus}
                    </Badge>
                </div>
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

            { }
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Interview Timeline</h4>
                    {showActions && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => setShowScheduleModal(true)}
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
                                                            className={`h-4 w-4 ${interview.rating && star <= interview.rating
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

                                { }
                                {showActions && (
                                    <div className="mt-3 pt-3 border-t flex gap-2 flex-wrap">
                                        {interview.status === "scheduled" && (
                                            <>
                                                {(interview as ATSInterview & { videoType?: string; webrtcRoomId?: string }).videoType === "in-app" &&
                                                    (interview as ATSInterview & { videoType?: string; webrtcRoomId?: string }).webrtcRoomId ? (
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        onClick={() =>
                                                            navigate(
                                                                `/video-call/${(interview as ATSInterview & { videoType?: string; webrtcRoomId?: string }).webrtcRoomId
                                                                }`
                                                            )
                                                        }
                                                    >
                                                        <Video className="h-3.5 w-3.5 mr-1" />
                                                        Join In-App Video
                                                    </Button>
                                                ) : interview.meetingLink ? (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            window.open(interview.meetingLink, "_blank")
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
                                                        setSelectedInterviewForReschedule(interview);
                                                        setShowScheduleModal(true);
                                                    }}
                                                >
                                                    <Calendar className="h-3.5 w-3.5 mr-1" />
                                                    Reschedule
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleCancelInterview(interview.id)}
                                                >
                                                    <X className="h-3.5 w-3.5 mr-1" />
                                                    Cancel
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-[#4640DE] hover:bg-[#3730A3]"
                                                    onClick={() =>
                                                        handleMarkInterviewComplete(interview.id)
                                                    }
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
                                                        setSelectedInterviewForFeedback(interview);
                                                        setShowFeedbackModal(true);
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

            { }
            {showActions && (
                <div className="flex flex-col gap-3">
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => setShowCommentModal(true)}
                    >
                        <MessageSquare className="h-4 w-4" />
                        Add Comment
                    </Button>

                    { }
                    {currentSubStage === InterviewSubStage.EVALUATION_PENDING &&
                        (() => {
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
                                    onClick={() => handleMoveToStage(nextStage)}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                    Move to {nextStageDisplayName}
                                </Button>
                            );
                        })()}

                    { }
                    {atsApplication?.stage &&
                        hasNextStages(atsApplication.stage as ATSStage) && (
                            <Button
                                variant="outline"
                                className="gap-2 border-[#4640DE] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
                                onClick={() => setShowMoveToStageModal(true)}
                            >
                                <ChevronRight className="h-4 w-4" />
                                Move to Another Stage
                            </Button>
                        )}
                </div>
            )}

            { }
            {showActions &&
                comments.filter((c) => c.stage === ATSStage.INTERVIEW).length > 0 && (
                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="font-medium text-gray-900">Comments</h4>
                        {comments
                            .filter((c) => c.stage === ATSStage.INTERVIEW)
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
