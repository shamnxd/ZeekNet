import { Button } from "@/components/ui/button";
import { ChevronRight, X, FileX, Loader2, Zap } from "lucide-react";
import {
  ATSStage,
  ATSStageDisplayNames,
  InReviewSubStage,
  STAGE_SUB_STAGES,
} from "@/constants/ats-stages";
import type { ATSComment } from "@/types/ats";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import { formatDateTime, formatATSStage, formatATSSubStage } from "@/utils/formatters";

interface CandidateInReviewStageProps {
  atsApplication: CompanySideApplication | null;
  selectedStage: string;
  comments: ATSComment[];
  onMoveToStage: (targetStage: ATSStage, reason?: string) => Promise<void>;
  getNextStage: (currentStage: string) => ATSStage | null;
  onUpdateStage: (stage: string, subStage?: string) => Promise<void>;
  onSetShowCommentModal: (show: boolean) => void;
  onSetShowMoveToStageModal: (show: boolean) => void;
  onSetShowRejectConfirmDialog: (show: boolean) => void;
  isUpdating?: boolean;
}


const isCurrentStage = (
  selectedStage: string,
  atsApplication: CompanySideApplication | null
): boolean => {
  const actualStage = atsApplication?.stage || ATSStage.IN_REVIEW;
  if (selectedStage === "APPLIED" || selectedStage === "applied") {
    return actualStage === ATSStage.IN_REVIEW;
  }
  return selectedStage === actualStage;
};

export function CandidateInReviewStage({
  atsApplication,
  selectedStage,
  comments,
  onMoveToStage,
  getNextStage,
  onUpdateStage,
  onSetShowCommentModal,
  onSetShowMoveToStageModal,
  onSetShowRejectConfirmDialog,
  isUpdating = false,
}: CandidateInReviewStageProps) {
  const showActions = isCurrentStage(selectedStage, atsApplication);
  const currentStage = (atsApplication?.stage || ATSStage.IN_REVIEW);

  // Client-side derived sub-stage if not provided by backend
  // But preferably use atsApplication.subStage if available
  const currentSubStage = atsApplication?.subStage || atsApplication?.sub_stage || InReviewSubStage.PROFILE_REVIEW;

  const subStages = STAGE_SUB_STAGES[ATSStage.IN_REVIEW] || [];
  const nextStage = getNextStage(currentStage);

  // Filter comments (case-insensitive) - showing both Applied and In Review comments here
  const stageComments = comments.filter((c) => {
    const s = String(c.stage).toUpperCase();
    return s === ATSStage.IN_REVIEW || s === "APPLIED";
  });

  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            In Review Stage
          </h3>
          <p className="text-sm text-gray-600">
            {currentSubStage === InReviewSubStage.PROFILE_REVIEW
              ? "Initial profile review in progress."
              : "Feedback received, awaiting decision."}
          </p>
        </div>
        <div className="flex items-center gap-3">

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
      </div>

      {stageComments.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Comments</h4>
          {stageComments.map((comment, idx) => (
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

      {showActions && (
        <div className="flex flex-col gap-3">
          {/* Sub-stage navigation buttons */}
          <div className="flex gap-3 pt-2">
            {subStages.map((subStage) => {
              if (subStage.key === currentSubStage) return null;

              // Don't show "Move to Profile Review" if we are already in "PENDING_DECISION"
              if (currentSubStage === InReviewSubStage.PENDING_DECISION && subStage.key === InReviewSubStage.PROFILE_REVIEW) {
                return null;
              }

              return (
                <Button
                  key={subStage.key}
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => onUpdateStage(ATSStage.IN_REVIEW, subStage.key)}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  Move to {subStage.label}
                </Button>
              );
            })}
          </div>

          <div className="flex gap-3 pt-2">
            {nextStage && (
              <Button
                className="flex-1 gap-2 bg-[#4640DE] hover:bg-[#3730A3]"
                onClick={() => onMoveToStage(nextStage as ATSStage)}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Move to {ATSStageDisplayNames[nextStage] || nextStage}
              </Button>
            )}
            <Button
              variant="destructive"
              className="flex-1 gap-2"
              onClick={() => onSetShowRejectConfirmDialog(true)}
              disabled={isUpdating}
            >
              <X className="h-4 w-4" />
              Reject
            </Button>
          </div>

          <div className="flex justify-start pt-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => onSetShowCommentModal(true)}
              disabled={isUpdating}
            >
              Add Comment
            </Button>
          </div>
        </div>
      )}

      {!showActions && stageComments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 bg-white/50 rounded-lg border border-dashed border-gray-200">
          <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
            <FileX className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900">No activity yet</p>
          <p className="text-xs text-gray-500 mt-1">
            No actions or comments recorded for this stage
          </p>
        </div>
      )}
    </div>
  );
}
