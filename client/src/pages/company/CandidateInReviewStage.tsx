
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronRight, X, FileX } from "lucide-react";
import { companyApi } from "@/api/company.api";
import { toast } from "@/hooks/use-toast";
import {
  ATSStage,
  STAGE_SUB_STAGES,
  OfferSubStage,
  ATSStageDisplayNames,
} from "@/constants/ats-stages";
import type { ATSComment } from "@/types/ats";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import type { JobPostingResponse } from "@/interfaces/job/job-posting-response.interface";

interface CandidateInReviewStageProps {
  atsApplication: CompanySideApplication | null;
  atsJob: JobPostingResponse | null;
  selectedStage: string;
  comments: ATSComment[];
  currentId?: string;
  onReload: () => Promise<void>;
  onSetShowCommentModal: (open: boolean) => void;
  onSetShowMoveToStageModal: (open: boolean) => void;
  onSetShowRejectConfirmDialog: (open: boolean) => void;
  onUpdateStage: (stage: string, subStage?: string) => Promise<void>;
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isCurrentStage = (
  selectedStage: string,
  atsApplication: CompanySideApplication | null
): boolean => {
  const actualStage = atsApplication?.stage || ATSStage.IN_REVIEW;
  if (selectedStage === "APPLIED" || selectedStage === "Applied") {
    return actualStage === ATSStage.IN_REVIEW;
  }
  return selectedStage === actualStage;
};

const hasNextStages = (
  currentStage: ATSStage | string,
  atsJob: JobPostingResponse | null
): boolean => {
  const enabledStagesRaw = atsJob?.enabled_stages || atsJob?.enabledStages || [];
  if (!Array.isArray(enabledStagesRaw) || enabledStagesRaw.length === 0) {
    return false;
  }

  const displayNameToEnum = Object.entries(ATSStageDisplayNames).reduce(
    (acc, [enumValue, displayName]) => {
      acc[displayName] = enumValue;
      return acc;
    },
    {} as Record<string, string>
  );

  const allStages = enabledStagesRaw.map((stage: string) => {
    if (Object.values(ATSStage).includes(stage as ATSStage)) {
      return stage;
    }
    return displayNameToEnum[stage] || stage;
  }) as ATSStage[];

  if (currentStage === "APPLIED" || currentStage === "Applied") {
    return allStages.length > 0;
  }

  if (!currentStage) {
    return false;
  }
  const currentIndex = allStages.indexOf(currentStage as ATSStage);
  return currentIndex >= 0 && currentIndex < allStages.length - 1;
};

export function CandidateInReviewStage({
  atsApplication,
  atsJob,
  selectedStage,
  comments,
  currentId,
  onReload,
  onSetShowCommentModal,
  onSetShowMoveToStageModal,
  onSetShowRejectConfirmDialog,
  onUpdateStage,
}: CandidateInReviewStageProps) {
  const currentSubStage = atsApplication?.subStage || "PROFILE_REVIEW";
  const subStages = STAGE_SUB_STAGES[ATSStage.IN_REVIEW] || [];
  const showActions = isCurrentStage(selectedStage, atsApplication);

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

      {comments.filter((c) => c.stage === ATSStage.IN_REVIEW).length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Comments</h4>
          {comments
            .filter((c) => c.stage === ATSStage.IN_REVIEW)
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

      {showActions && (
        <div className="flex flex-col gap-3">
          {subStages.map((subStage, idx) => {
            if (subStage.key === currentSubStage) return null;

            if (
              currentSubStage === "PENDING_DECISION" &&
              subStage.key === "PROFILE_REVIEW"
            )
              return null;

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
                  try {
                    await companyApi.updateApplicationSubStage(currentId, {
                      subStage: subStage.key,
                      comment: `Moved to ${subStage.label}`,
                    });
                    toast({
                      title: "Success",
                      description: `Moved to ${subStage.label}`,
                    });
                    await onReload();
                  } catch (error: unknown) {
                    console.error("Failed to update sub-stage:", error);
                    toast({
                      title: "Error",
                      description:
                        (
                          error as {
                            response?: { data?: { message?: string } };
                          }
                        )?.response?.data?.message ||
                        "Failed to update sub-stage.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <ChevronRight className="h-4 w-4" />
                Move to {subStage.label}
              </Button>
            );
          })}

          {currentSubStage === "PENDING_DECISION" && (
            <div className="flex gap-3 pt-2 border-t">
              <Button
                className="flex-1 gap-2 bg-[#4640DE] hover:bg-[#3730A3]"
                onClick={() =>
                  onUpdateStage(ATSStage.SHORTLISTED, "READY_FOR_INTERVIEW")
                }
              >
                <ChevronRight className="h-4 w-4" />
                Move to Shortlisted
              </Button>
              {!(
                selectedStage === ATSStage.OFFER &&
                String(currentSubStage) === String(OfferSubStage.OFFER_SENT)
              ) && (
                  <Button
                    variant="destructive"
                    className="flex-1 gap-2"
                    onClick={() => onSetShowRejectConfirmDialog(true)}
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
              onClick={() => onSetShowCommentModal(true)}
            >
              <MessageSquare className="h-4 w-4" />
              Add Comment
            </Button>

            {(() => {
              const currentStage = atsApplication?.stage as ATSStage;
              if (!currentStage) return false;
              return hasNextStages(currentStage, atsJob);
            })() && (
                <Button
                  variant="outline"
                  className="gap-2 border-[#4640DE] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
                  onClick={() => onSetShowMoveToStageModal(true)}
                >
                  <ChevronRight className="h-4 w-4" />
                  Move to Another Stage
                </Button>
              )}
          </div>
        </div>
      )}
      {!showActions && comments.filter((c) => c.stage === ATSStage.IN_REVIEW).length === 0 && (
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

