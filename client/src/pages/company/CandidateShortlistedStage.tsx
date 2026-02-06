import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight, MessageSquare, FileX } from "lucide-react";
import { companyApi } from "@/api/company.api";
import { toast } from "@/hooks/use-toast";
import { ATSStage, ATSStageDisplayNames } from "@/constants/ats-stages";
import type { ATSComment } from "@/types/ats";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import type { JobPostingResponse } from "@/interfaces/job/job-posting-response.interface";

interface CandidateShortlistedStageProps {
  atsApplication: CompanySideApplication | null;
  atsJob: JobPostingResponse | null;
  selectedStage: string;
  comments: ATSComment[];
  currentId?: string;
  onReload: () => Promise<void>;
  onSetShowCommentModal: (open: boolean) => void;
  onSetShowMoveToStageModal: (open: boolean) => void;
  onSetShowScheduleModal: (open: boolean) => void;
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

export function CandidateShortlistedStage({
  atsApplication,
  atsJob,
  selectedStage,
  comments,
  currentId,
  onReload,
  onSetShowCommentModal,
  onSetShowMoveToStageModal,
  onSetShowScheduleModal,
}: CandidateShortlistedStageProps) {
  const currentSubStage = atsApplication?.subStage || "READY_FOR_INTERVIEW";
  const showActions = isCurrentStage(selectedStage, atsApplication);

  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Shortlisted Stage
        </h3>
        {showActions && (
          <Badge className="bg-blue-100 text-blue-700 mb-4">
            Current Sub-stage:{" "}
            {currentSubStage === "READY_FOR_INTERVIEW"
              ? "Ready for Interview"
              : currentSubStage === "CONTACTED"
                ? "Contacted"
                : currentSubStage === "AWAITING_RESPONSE"
                  ? "Awaiting Response"
                  : currentSubStage}
          </Badge>
        )}
      </div>

      {showActions && (
        <div className="flex flex-col gap-3">
          <Button
            className="gap-2 bg-[#4640DE] hover:bg-[#3730A3] text-lg py-6"
            onClick={() => onSetShowScheduleModal(true)}
          >
            <Calendar className="h-5 w-5" />
            Schedule Interview
          </Button>

          <div className="flex gap-2">
            {currentSubStage === "READY_FOR_INTERVIEW" && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={async () => {
                  if (!currentId) return;
                  try {
                    await companyApi.updateApplicationSubStage(currentId, {
                      subStage: "CONTACTED",
                      comment: "Candidate contacted",
                    });
                    toast({
                      title: "Success",
                      description: "Marked as Contacted",
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
                Mark as Contacted
              </Button>
            )}
            {currentSubStage === "CONTACTED" && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={async () => {
                  if (!currentId) return;
                  try {
                    await companyApi.updateApplicationSubStage(currentId, {
                      subStage: "AWAITING_RESPONSE",
                      comment: "Awaiting candidate response",
                    });
                    toast({
                      title: "Success",
                      description: "Marked as Awaiting Response",
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
                Mark Awaiting Response
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-3">
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

      {comments.filter((c) => c.stage === ATSStage.SHORTLISTED).length > 0 && (
        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-medium text-gray-900">Comments</h4>
          {comments
            .filter((c) => c.stage === ATSStage.SHORTLISTED)
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
      {!showActions && comments.filter((c) => c.stage === ATSStage.SHORTLISTED).length === 0 && (
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

