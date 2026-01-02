import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Edit,
    XCircle,
    File as FileIcon,
    ExternalLink,
    Star,
    MessageSquare,
    ChevronRight,
} from "lucide-react";
import {
    ATSStage,
    TechnicalTaskSubStage,
    SubStageDisplayNames,
    ATSStageDisplayNames,
} from "@/constants/ats-stages";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import type { ATSComment } from "@/types/ats";
import type { ExtendedATSTechnicalTask } from "@/types/ats-profile";
import { formatDateTime } from "@/utils/formatters";

interface TechnicalTaskStageProps {
    technicalTasks: ExtendedATSTechnicalTask[];
    atsApplication: CompanySideApplication | null;
    selectedStage: string;
    isCurrentStage: (stage: string) => boolean;
    setShowAssignTaskModal: (show: boolean) => void;
    handleReviewTask: (taskId: string) => Promise<void>;
    setSelectedTaskForReview: (task: ExtendedATSTechnicalTask) => void;
    setShowFeedbackModal: (show: boolean) => void;
    handleEditTask: (task: ExtendedATSTechnicalTask) => void;
    handleRevokeTaskClick: (taskId: string) => void;
    handleMoveToStage: (stage: ATSStage, reason?: string) => Promise<void>;
    getNextStage: (currentStage: string) => ATSStage | null;
    hasNextStages: (currentStage: ATSStage | string) => boolean;
    setShowMoveToStageModal: (show: boolean) => void;
    comments: ATSComment[];
    setShowCommentModal: (show: boolean) => void;
}

export const TechnicalTaskStage = ({
    technicalTasks,
    atsApplication,
    selectedStage,
    isCurrentStage,
    setShowAssignTaskModal,
    handleReviewTask,
    setSelectedTaskForReview,
    setShowFeedbackModal,
    handleEditTask,
    handleRevokeTaskClick,
    handleMoveToStage,
    getNextStage,
    hasNextStages,
    setShowMoveToStageModal,
    comments,
    setShowCommentModal,
}: TechnicalTaskStageProps) => {
    const showActions = isCurrentStage(selectedStage);
    const currentSubStage =
        atsApplication?.subStage || TechnicalTaskSubStage.NOT_ASSIGNED;
    const currentSubStageDisplayName =
        SubStageDisplayNames[currentSubStage] || currentSubStage;

    return (
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
            {}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Technical Task Stage
                </h3>
                {showActions && (
                    <Badge className="bg-purple-100 text-purple-700 mb-4">
                        Current Sub-stage: {currentSubStageDisplayName}
                    </Badge>
                )}
            </div>

            {}
            {currentSubStage === TechnicalTaskSubStage.NOT_ASSIGNED && (
                <div className="bg-white rounded-lg p-6 border text-center">
                    <p className="text-gray-600 mb-4">No technical task assigned yet</p>
                    {showActions && (
                        <Button
                            onClick={() => setShowAssignTaskModal(true)}
                            className="bg-[#4640DE] hover:bg-[#3730A3]"
                        >
                            Assign Task
                        </Button>
                    )}
                </div>
            )}

            {}
            {currentSubStage !== TechnicalTaskSubStage.NOT_ASSIGNED && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">Task List</h4>
                        {showActions && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-2"
                                onClick={() => setShowAssignTaskModal(true)}
                            >
                                <Plus className="h-4 w-4" />
                                Assign Another Task
                            </Button>
                        )}
                    </div>

                    {technicalTasks.length > 0 && (
                        <div className="space-y-4">
                            {technicalTasks.map((task: ExtendedATSTechnicalTask) => {
                                const taskStatus = task.status || "assigned";
                                const isAssigned = taskStatus === "assigned";
                                const isSubmitted = taskStatus === "submitted";
                                const isUnderReview = taskStatus === "under_review";
                                const isCompleted = taskStatus === "completed";
                                const isCancelled = false; 

                                return (
                                    <div key={task.id} className="bg-white rounded-lg p-4 border">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h5 className="font-semibold text-gray-900 mb-1">
                                                    {task.title}
                                                </h5>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span>
                                                        Due:{" "}
                                                        {task.deadline
                                                            ? formatDateTime(task.deadline)
                                                            : "No deadline"}
                                                    </span>
                                                    <Badge
                                                        className={
                                                            isCancelled
                                                                ? "bg-gray-100 text-gray-600"
                                                                : isAssigned
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : isSubmitted
                                                                        ? "bg-yellow-100 text-yellow-700"
                                                                        : isUnderReview
                                                                            ? "bg-purple-100 text-purple-700"
                                                                            : "bg-green-100 text-green-700"
                                                        }
                                                    >
                                                        {isCancelled
                                                            ? "Cancelled"
                                                            : isAssigned
                                                                ? "Assigned"
                                                                : isSubmitted
                                                                    ? "Submitted"
                                                                    : isUnderReview
                                                                        ? "Under Review"
                                                                        : "Completed"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        {}
                                        {task.description && (
                                            <div className="mb-3">
                                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                    {task.description}
                                                </p>
                                            </div>
                                        )}

                                        {}
                                        {task.documentUrl && task.documentFilename && (
                                            <div className="mb-3">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <FileIcon className="h-4 w-4" />
                                                    <a
                                                        href={task.documentUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[#4640DE] hover:underline flex items-center gap-1"
                                                    >
                                                        {task.documentFilename}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {}
                                        {(isSubmitted || isUnderReview || isCompleted) &&
                                            task.submissionUrl && (
                                                <div className="mb-3 p-3 bg-gray-50 rounded border">
                                                    <p className="text-sm font-medium text-gray-900 mb-2">
                                                        Submitted Files
                                                    </p>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <FileIcon className="h-4 w-4" />
                                                        <a
                                                            href={task.submissionUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[#4640DE] hover:underline flex items-center gap-1"
                                                        >
                                                            {task.submissionFilename || "Submission"}
                                                            <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    </div>
                                                    {task.submittedAt && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Submitted: {formatDateTime(task.submittedAt)}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                        {}
                                        {isCompleted && (task.feedback || task.rating) && (
                                            <div className="mb-3 p-3 bg-green-50 rounded border">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        Rating: {task.rating || "N/A"}/5
                                                    </span>
                                                </div>
                                                {task.feedback && (
                                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                        {task.feedback}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {}
                                        {showActions && !isCancelled && (
                                            <div className="flex gap-2 mt-4 pt-4 border-t justify-between items-center">
                                                <div className="flex gap-2">
                                                    {isSubmitted && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-[#4640DE] hover:bg-[#3730A3]"
                                                            onClick={() => handleReviewTask(task.id)}
                                                        >
                                                            Review Submission
                                                        </Button>
                                                    )}
                                                    {isUnderReview && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setSelectedTaskForReview(task);
                                                                setShowFeedbackModal(true);
                                                            }}
                                                        >
                                                            Add Feedback
                                                        </Button>
                                                    )}
                                                </div>

                                                {}
                                                {isAssigned && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleEditTask(task)}
                                                            className="gap-1"
                                                        >
                                                            <Edit className="h-3.5 w-3.5" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleRevokeTaskClick(task.id)}
                                                            className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <XCircle className="h-3.5 w-3.5" />
                                                            Revoke
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {}
                                        {isCancelled && (
                                            <div className="mt-4 pt-4 border-t">
                                                <p className="text-sm text-gray-500 italic">
                                                    Task has been revoked
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {}
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

                    {}
                    {(() => {
                        const nextStage = atsApplication?.stage
                            ? getNextStage(atsApplication.stage)
                            : null;
                        if (!nextStage) return null;
                        const nextStageDisplayName =
                            ATSStageDisplayNames[nextStage] || nextStage;
                        const isCompleted =
                            currentSubStage === TechnicalTaskSubStage.COMPLETED ||
                            currentSubStage === "COMPLETED";
                        return (
                            <Button
                                variant="outline"
                                className="gap-2 border-[#4640DE] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
                                onClick={() => handleMoveToStage(nextStage)}
                                disabled={!isCompleted}
                            >
                                <ChevronRight className="h-4 w-4" />
                                Move to {nextStageDisplayName}
                            </Button>
                        );
                    })()}

                    {}
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

            {}
            {showActions &&
                comments.filter((c) => c.stage === ATSStage.TECHNICAL_TASK).length >
                0 && (
                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="font-medium text-gray-900">Comments</h4>
                        {comments
                            .filter((c) => c.stage === ATSStage.TECHNICAL_TASK)
                            .map((comment, idx) => (
                                <div key={idx} className="bg-white rounded-lg p-4 border">
                                    <p className="text-sm text-gray-700">{comment.comment}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        by{" "}
                                        {comment.recruiterName ||
                                            comment.addedByName ||
                                            comment.addedBy ||
                                            "Recruiter"}{" "}
                                        •{" "}
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
