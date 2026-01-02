import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageSquare, ChevronRight } from "lucide-react";
import { ATSStage } from "@/constants/ats-stages";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import type { ATSComment } from "@/types/ats";
import { formatDateTime } from "@/utils/formatters";
import { companyApi } from "@/api/company.api";
import { toast } from "@/hooks/use-toast";

interface ShortlistedStageProps {
    atsApplication: CompanySideApplication | null;
    selectedStage: string;
    isCurrentStage: (stage: string) => boolean;
    setShowScheduleModal: (show: boolean) => void;
    currentId: string | undefined;
    reloadData: () => Promise<void>;
    setShowCommentModal: (show: boolean) => void;
    setShowMoveToStageModal: (show: boolean) => void;
    hasNextStages: (currentStage: ATSStage | string) => boolean;
    comments: ATSComment[];
}

export const ShortlistedStage = ({
    atsApplication,
    selectedStage,
    isCurrentStage,
    setShowScheduleModal,
    currentId,
    reloadData,
    setShowCommentModal,
    setShowMoveToStageModal,
    hasNextStages,
    comments,
}: ShortlistedStageProps) => {
    const currentSubStage = atsApplication?.subStage || "READY_FOR_INTERVIEW";
    const showActions = isCurrentStage(selectedStage);

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

            {}
            {showActions && (
                <div className="flex flex-col gap-3">
                    <Button
                        className="gap-2 bg-[#4640DE] hover:bg-[#3730A3] text-lg py-6"
                        onClick={() => setShowScheduleModal(true)}
                    >
                        <Calendar className="h-5 w-5" />
                        Schedule Interview
                    </Button>

                    {}
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
                                        await reloadData();
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
                                        await reloadData();
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
                            onClick={() => setShowCommentModal(true)}
                        >
                            <MessageSquare className="h-4 w-4" />
                            Add Comment
                        </Button>

                        {}
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

            {}
            {comments.filter((c) => c.stage === ATSStage.SHORTLISTED).length >
                0 && (
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
        </div>
    );
};
