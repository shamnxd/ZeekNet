import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    MessageSquare,
    ChevronRight,
    File as FileIcon,
    ExternalLink,
    Edit,
    XCircle,
    Star,
    Zap,
    Loader2,
} from "lucide-react";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import type { ATSComment } from "@/types/ats";
import { formatATSStage, formatATSSubStage } from "@/utils/formatters";
import {
    ATSStage,
    ATSStageDisplayNames,
    TechnicalTaskSubStage,
    STAGE_SUB_STAGES,
} from "@/constants/ats-stages";
import type { ExtendedATSTechnicalTask } from "./CandidateProfileTypes";

interface CandidateTechnicalTaskStageProps {
    atsApplication: CompanySideApplication | null;
    selectedStage: string;
    technicalTasks: ExtendedATSTechnicalTask[];
    comments: ATSComment[];
    onSetShowAssignTaskModal: (show: boolean) => void;
    onSetShowCommentModal: (show: boolean) => void;
    onSetSelectedTaskForEdit: (task: ExtendedATSTechnicalTask) => void;
    onSetSelectedTaskForReview: (task: ExtendedATSTechnicalTask | null) => void;
    onSetShowFeedbackModal: (show: boolean) => void;
    onSetShowMoveToStageModal: (show: boolean) => void;
    onRevokeTask: (taskId: string) => void;
    onReviewTask: (taskId: string) => Promise<void>;
    onMoveToStage: (targetStage: ATSStage, reason?: string) => Promise<void>;
    formatDateTime: (dateString: string) => string;
    isCurrentStage: (stage: string) => boolean;
    getNextStage: (currentStage: string) => ATSStage | null;
    isUpdating?: boolean;
}

export const CandidateTechnicalTaskStage = ({
    atsApplication,
    selectedStage,
    technicalTasks,
    comments,
    onSetShowAssignTaskModal,
    onSetShowCommentModal,
    onSetSelectedTaskForEdit,
    onSetSelectedTaskForReview,
    onSetShowFeedbackModal,
    onSetShowMoveToStageModal,
    onRevokeTask,
    onReviewTask,
    onMoveToStage,
    formatDateTime,
    isCurrentStage,
    getNextStage,
    isUpdating = false,
}: CandidateTechnicalTaskStageProps) => {
    const showActions = isCurrentStage(selectedStage);

    // Calculate Technical Task Summary & Derive Sub-Stage
    const technicalTaskSummary = useMemo(() => {
        const activeTasks = technicalTasks.filter(
            (t: ExtendedATSTechnicalTask) => t.status !== "revoked"
        );
        const assignedTasks = activeTasks.filter(
            (t: ExtendedATSTechnicalTask) => t.status === "assigned"
        );
        const submittedTasks = activeTasks.filter(
            (t: ExtendedATSTechnicalTask) => t.status === "submitted"
        );
        const underReviewTasks = activeTasks.filter(
            (t: ExtendedATSTechnicalTask) => t.status === "under_review"
        );
        const completedTasks = activeTasks.filter(
            (t: ExtendedATSTechnicalTask) => t.status === "completed"
        );

        let calculatedSubStage: TechnicalTaskSubStage = TechnicalTaskSubStage.NOT_ASSIGNED;
        if (activeTasks.length === 0) {
            calculatedSubStage = TechnicalTaskSubStage.NOT_ASSIGNED;
        } else if (underReviewTasks.length > 0) {
            calculatedSubStage = TechnicalTaskSubStage.UNDER_REVIEW;
        } else if (
            completedTasks.length === activeTasks.length &&
            activeTasks.length > 0
        ) {
            calculatedSubStage = TechnicalTaskSubStage.COMPLETED;
        } else if (
            submittedTasks.length > 0
        ) {
            calculatedSubStage = TechnicalTaskSubStage.SUBMITTED;
        } else if (assignedTasks.length > 0) {
            calculatedSubStage = TechnicalTaskSubStage.ASSIGNED;
        }

        return {
            currentSubStage: calculatedSubStage,
            assignedTasks,
            submittedTasks,
            underReviewTasks,
            completedTasks,
            totalTasks: activeTasks.length,
        };
    }, [technicalTasks]);

    const { currentSubStage } = technicalTaskSummary;
    const subStages = STAGE_SUB_STAGES[ATSStage.TECHNICAL_TASK] || [];

    return (
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Technical Task Stage
                    </h3>
                    <div className="flex gap-1 mt-2">
                        <Badge
                            className={
                                currentSubStage === TechnicalTaskSubStage.COMPLETED
                                    ? "!bg-green-100 !text-green-700"
                                    : currentSubStage === TechnicalTaskSubStage.UNDER_REVIEW
                                        ? "!bg-purple-100 !text-purple-700"
                                        : currentSubStage === TechnicalTaskSubStage.NOT_ASSIGNED
                                            ? "!bg-gray-100 !text-gray-700"
                                            : "!bg-blue-100 !text-blue-700"
                            }
                        >
                            {subStages.find(s => s.key === currentSubStage)?.label || (currentSubStage as string)}
                        </Badge>
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
            </div>

            {/* NOT_ASSIGNED: Show "No task assigned" message and Assign Task button */}
            {currentSubStage === TechnicalTaskSubStage.NOT_ASSIGNED && (
                <div className="bg-white rounded-lg p-6 border text-center">
                    <p className="text-gray-600 mb-4">No technical task assigned yet</p>
                    {showActions && (
                        <Button
                            onClick={() => onSetShowAssignTaskModal(true)}
                            className="bg-[#4640DE] hover:bg-[#3730A3]"
                        >
                            Assign Task
                        </Button>
                    )}
                </div>
            )}

            {/* Task list for other sub-stages */}
            {currentSubStage !== TechnicalTaskSubStage.NOT_ASSIGNED && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold !text-gray-900">Task List</h4>
                        {showActions && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-2"
                                onClick={() => onSetShowAssignTaskModal(true)}
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
                                const isCancelled = taskStatus === "revoked";

                                return (
                                    <div
                                        key={task.id}
                                        className="bg-white rounded-lg p-4 border"
                                    >
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
                                                                ? "!bg-gray-100 !text-gray-600"
                                                                : isAssigned
                                                                    ? "!bg-blue-100 !text-blue-700"
                                                                    : isSubmitted
                                                                        ? "!bg-yellow-100 !text-yellow-700"
                                                                        : isUnderReview
                                                                            ? "!bg-purple-100 !text-purple-700"
                                                                            : "!bg-green-100 !text-green-700"
                                                        }
                                                    >
                                                        {taskStatus}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Task Description */}
                                        {task.description && (
                                            <div className="mb-3">
                                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                    {task.description}
                                                </p>
                                            </div>
                                        )}

                                        {/* Attachments */}
                                        {task.documentUrl && task.documentFilename && (
                                            <div className="mb-3">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <FileIcon className="h-4 w-4" />
                                                    <a
                                                        href={task.documentUrl as string}
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

                                        {/* Submission Files */}
                                        {(isSubmitted || isUnderReview || isCompleted) &&
                                            (task.submissionUrl || task.submissionLink) && (
                                                <div className="mb-3 p-3 bg-gray-50 rounded border">
                                                    <p className="text-sm font-medium text-gray-900 mb-2">
                                                        Submission Details
                                                    </p>
                                                    <div className="space-y-2">
                                                        {task.submissionUrl && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <FileIcon className="h-4 w-4" />
                                                                <a
                                                                    href={task.submissionUrl as string}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[#4640DE] hover:underline flex items-center gap-1 font-medium"
                                                                >
                                                                    {task.submissionFilename || "View File"}
                                                                    <ExternalLink className="h-3 w-3" />
                                                                </a>
                                                            </div>
                                                        )}
                                                        {task.submissionLink && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <ExternalLink className="h-4 w-4" />
                                                                <a
                                                                    href={task.submissionLink.startsWith('http') ? task.submissionLink : `https://${task.submissionLink}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[#4640DE] hover:underline flex items-center gap-1 font-medium"
                                                                >
                                                                    External Link
                                                                    <ExternalLink className="h-3 w-3" />
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {task.submittedAt && (
                                                        <p className="text-xs text-gray-500 mt-2 italic">
                                                            Submitted: {formatDateTime(task.submittedAt)}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                        {/* Feedback */}
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

                                        {/* Actions */}
                                        {showActions && !isCancelled && (
                                            <div className="flex gap-2 mt-4 pt-4 border-t justify-between items-center">
                                                <div className="flex gap-2">
                                                    {isSubmitted && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-[#4640DE] hover:bg-[#3730A3]"
                                                            onClick={() => onReviewTask(task.id)}
                                                        >
                                                            Review Submission
                                                        </Button>
                                                    )}
                                                    {isUnderReview && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                onSetSelectedTaskForReview(task);
                                                                onSetShowFeedbackModal(true);
                                                            }}
                                                        >
                                                            Add Feedback
                                                        </Button>
                                                    )}
                                                </div>

                                                {/* Edit and Revoke buttons */}
                                                {isAssigned && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => onSetSelectedTaskForEdit(task)}
                                                            className="gap-1"
                                                        >
                                                            <Edit className="h-3.5 w-3.5" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => onRevokeTask(task.id)}
                                                            className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <XCircle className="h-3.5 w-3.5" />
                                                            Revoke
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
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

            {/* Action Buttons */}
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
                                className="gap-2 !border-[#4640DE] !text-[#4640DE] !hover:bg-[#4640DE] !hover:text-white"
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
            {
                showActions &&
                comments.filter((c) => c.stage === ATSStage.TECHNICAL_TASK).length >
                0 && (
                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="font-medium text-gray-900">Comments</h4>
                        {comments
                            .filter((c) => c.stage === ATSStage.TECHNICAL_TASK)
                            .map((comment, idx) => (
                                <div key={idx} className="bg-white rounded-lg p-4 border">
                                    <p className="text-sm !text-gray-700">{comment.comment}</p>
                                    <p className="text-xs !text-blue-600 font-medium mt-1">
                                        {formatATSStage(comment.stage)} {comment.subStage ? `• ${formatATSSubStage(comment.subStage)}` : ''}
                                    </p>
                                    <p className="text-xs !text-gray-400 mt-1">
                                        {formatDateTime(
                                            comment.createdAt || comment.timestamp || ""
                                        )}
                                    </p>
                                </div>
                            ))}
                    </div>
                )
            }
        </div >
    );
};
