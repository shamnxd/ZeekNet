import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { ATSStage } from "@/constants/ats-stages";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import { formatDateTime } from "@/utils/formatters";

interface AppliedStageProps {
    atsApplication: CompanySideApplication | null;
    selectedStage: string;
    handleUpdateStage: (stage: string, subStage?: string) => Promise<void>;
    hasNextStages: (currentStage: ATSStage | string) => boolean;
    setShowMoveToStageModal: (show: boolean) => void;
}

export const AppliedStage = ({
    atsApplication,
    selectedStage,
    handleUpdateStage,
    hasNextStages,
    setShowMoveToStageModal,
}: AppliedStageProps) => {
    
    
    const actualStage = atsApplication?.stage;
    const isViewingApplied =
        selectedStage === "APPLIED" || selectedStage === "Applied";
    
    const isInAppliedStage = actualStage === "APPLIED" || !actualStage;
    const showActions = isViewingApplied && isInAppliedStage;

    return (
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
            <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Application Received
                </h3>
                <p className="text-sm text-gray-600">
                    Applied on{" "}
                    {atsApplication?.applied_date
                        ? formatDateTime(atsApplication.applied_date)
                        : "Recently"}
                </p>
            </div>

            {}
            {showActions && (
                <div className="flex flex-col gap-3">
                    <Button
                        type="button"
                        className="gap-2 bg-[#4640DE] hover:bg-[#3730A3]"
                        onClick={() => {

                            handleUpdateStage(ATSStage.IN_REVIEW, "PROFILE_REVIEW");
                        }}
                    >
                        <ChevronRight className="h-4 w-4" />
                        Move to In Review
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
            )}
        </div>
    );
};
