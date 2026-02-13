import { Button } from "@/components/ui/button";
import { ChevronRight, MessageSquare, X } from "lucide-react";
import { ATSStage, STAGE_SUB_STAGES, OfferSubStage } from "@/constants/ats-stages";
import { formatDateTime, formatATSStage, formatATSSubStage } from "@/utils/formatters";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import type { ATSComment } from "@/types/ats";

interface InReviewStageProps {
    atsApplication: CompanySideApplication | null;
    selectedStage: string;
    comments: ATSComment[];
    currentId: string | undefined;
    isCurrentStage: (stage: string) => boolean;
    onUpdateStage: (stage: string, subStage?: string) => Promise<void>;
    reloadData: () => Promise<void>;
    setShowCommentModal: (show: boolean) => void;
    setShowMoveToStageModal: (show: boolean) => void;
    hasNextStages: (currentStage: ATSStage | string) => boolean;
}

export const InReviewStage = ({
    atsApplication,
    selectedStage,
    comments,
    currentId,
    isCurrentStage,
    onUpdateStage,
    reloadData,
    setShowCommentModal,
    setShowMoveToStageModal,
    hasNextStages,
}: InReviewStageProps) => {
    const currentSubStage = atsApplication?.subStage || "PROFILE_REVIEW";
    const subStages = STAGE_SUB_STAGES[ATSStage.IN_REVIEW] || [];

    const showActions = isCurrentStage(selectedStage);

    return (
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    In Review Stage
                </h3>
                {showActions && (
                    <p className="text-sm text-gray-600 mb-4">
                        Current sub-stage:{" "}
                        <span className="font-medium text-gray-900">
                            {subStages.find((s) => s.key === currentSubStage)?.label ||
                                currentSubStage}
                        </span>
                    </p>
                )}
            </div>

            { }
            {comments.filter((c) => c.stage === ATSStage.IN_REVIEW || String(c.stage) === 'in_review').length > 0 && (
                <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Comments</h4>
                    {comments
                        .filter((c) => c.stage === ATSStage.IN_REVIEW || String(c.stage) === 'in_review')
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

            { }
            {showActions && (
                <div className="flex flex-col gap-3">
                    {subStages.map((subStage, idx) => {

                        if (subStage.key === currentSubStage) return null;






                        return (
                            <Button
                                key={subStage.key}
                                variant={idx === subStages.length - 1 ? "default" : "outline"}
                                className={`gap-2 ${idx === subStages.length - 1
                                    ? "bg-[#4640DE] hover:bg-[#3730A3]"
                                    : ""
                                    }`}
                                onClick={async () => {
                                    if (!currentId) return;
                                    await onUpdateStage(selectedStage, subStage.key);
                                }}
                            >
                                <ChevronRight className="h-4 w-4" />
                                Move to {subStage.label}
                            </Button>
                        );
                    })}

                    { }
                    {currentSubStage === "PENDING_DECISION" && (
                        <div className="flex gap-3 pt-2 border-t">
                            <Button
                                className="flex-1 gap-2 bg-[#4640DE] hover:bg-[#3730A3]"
                                onClick={() =>
                                    onUpdateStage(
                                        ATSStage.SHORTLISTED,
                                        "READY_FOR_INTERVIEW"
                                    )
                                }
                            >
                                <ChevronRight className="h-4 w-4" />
                                Move to Shortlisted
                            </Button>
                            { }
                            {!(
                                selectedStage === ATSStage.OFFER &&
                                String(currentSubStage) === String(OfferSubStage.OFFER_SENT)
                            ) && (
                                    <Button
                                        variant="destructive"
                                        className="flex-1 gap-2"
                                        onClick={() => onUpdateStage("REJECTED", "")}
                                    >
                                        <X className="h-4 w-4" />
                                        Reject
                                    </Button>
                                )}
                        </div>
                    )}

                    <div className="flex flex-col gap-3 mt-2">
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() => setShowCommentModal(true)}
                        >
                            <MessageSquare className="h-4 w-4" />
                            Add Comment
                        </Button>

                        { }
                        {(() => {
                            const currentStage = atsApplication?.stage as ATSStage;
                            if (!currentStage) return false;
                            return hasNextStages(currentStage);
                        })() && (
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
                </div>
            )}
        </div>
    );
};
