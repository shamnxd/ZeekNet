import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, CheckCircle2, Loader2, Zap } from "lucide-react";
import {
  ATSStage,
  ATSStageDisplayNames,
  ShortlistedSubStage,
  STAGE_SUB_STAGES,
} from "@/constants/ats-stages";
import type { ATSComment } from "@/types/ats";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import { formatDateTime, formatATSStage, formatATSSubStage } from "@/utils/formatters";

interface CandidateShortlistedStageProps {
  atsApplication: CompanySideApplication | null;
  selectedStage: string;
  comments: ATSComment[];
  onSetShowCommentModal: (show: boolean) => void;
  onSetShowMoveToStageModal: (show: boolean) => void;
  onSetShowScheduleModal: (show: boolean) => void;
  onSetShowRejectConfirmDialog: (show: boolean) => void;
  onMoveToStage: (targetStage: ATSStage, reason?: string) => Promise<void>;
  onUpdateStage: (stage: string, subStage?: string) => Promise<void>;
  getNextStage: (currentStage: string) => ATSStage | null;
  isUpdating?: boolean;
}


const isCurrentStage = (
  selectedStage: string,
  atsApplication: CompanySideApplication | null
): boolean => {
  const actualStage = atsApplication?.stage || ATSStage.IN_REVIEW;
  return selectedStage === actualStage;
};


export function CandidateShortlistedStage({
  atsApplication,
  selectedStage,
  comments,
  onSetShowCommentModal,
  onSetShowMoveToStageModal,
  onMoveToStage,
  onUpdateStage,
  getNextStage,
  isUpdating = false,
}: CandidateShortlistedStageProps) {
  const showActions = isCurrentStage(selectedStage, atsApplication);
  const currentStage = atsApplication?.stage || ATSStage.SHORTLISTED;

  let currentSubStage = (atsApplication?.sub_stage || atsApplication?.subStage || ShortlistedSubStage.READY_FOR_INTERVIEW) as ShortlistedSubStage;

  if (!atsApplication?.sub_stage && !atsApplication?.subStage) {
    const contactComments = comments.filter(c => String(c.stage).toUpperCase() === ATSStage.SHORTLISTED);
    if (contactComments.length > 1) {
      currentSubStage = ShortlistedSubStage.AWAITING_RESPONSE;
    } else if (contactComments.length === 1) {
      currentSubStage = ShortlistedSubStage.CONTACTED;
    }
  }

  const subStages = STAGE_SUB_STAGES[ATSStage.SHORTLISTED] || [];
  const nextStage = getNextStage(currentStage);

  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Shortlisted Stage
          </h3>
          <p className="text-sm text-gray-600">
            {currentSubStage === ShortlistedSubStage.READY_FOR_INTERVIEW
              ? "Candidate is ready for the interview process."
              : currentSubStage === ShortlistedSubStage.CONTACTED
                ? "Candidate has been contacted."
                : "Awaiting response from candidate."}
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

      <div className="bg-white rounded-lg p-6 border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Shortlisted</p>
            <p className="text-sm font-medium text-gray-900">
              Verified and added to the shortlist
            </p>
          </div>
        </div>
      </div>

      {comments.filter((c) => String(c.stage).toUpperCase() === ATSStage.SHORTLISTED).length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Communication History</h4>
          {comments
            .filter((c) => String(c.stage).toUpperCase() === ATSStage.SHORTLISTED)
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

      {showActions && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 pt-2">
            {subStages.map((subStage, index) => {
              const currentIndex = subStages.findIndex(s => s.key === currentSubStage);

              if (index <= currentIndex) return null;

              if (subStage.key === ShortlistedSubStage.READY_FOR_INTERVIEW) return null;
              if (subStage.key === ShortlistedSubStage.AWAITING_RESPONSE && currentSubStage === ShortlistedSubStage.READY_FOR_INTERVIEW) return null;

              return (
                <Button
                  key={subStage.key}
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => onUpdateStage(ATSStage.SHORTLISTED, subStage.key)}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  Mark as {subStage.label}
                </Button>
              );
            })}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="w-full gap-2 border-gray-300"
              onClick={() => onSetShowCommentModal(true)}
              disabled={isUpdating}
            >
              <Plus className="h-4 w-4" />
              Add Comments
            </Button>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t mt-2">
            {nextStage && (
              <Button
                variant="outline"
                className="gap-2 border-[#4640DE] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
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
          </div>
        </div>
      )}
    </div>
  );
}
