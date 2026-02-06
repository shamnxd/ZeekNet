import { useMemo } from "react";
import { ATSStage, ATSStageDisplayNames } from "@/constants/ats-stages";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import type { JobPostingResponse } from "@/interfaces/job/job-posting-response.interface";

export const useHiringStages = (
    atsApplication: CompanySideApplication | null,
    atsJob: JobPostingResponse | null

) => {

    // Derived State for Hiring Stages
    const hiringStages = useMemo(() => {
        const allStages =
            (atsJob?.enabled_stages as string[]) || Object.values(ATSStage);

        // Always include APPLIED as the first stage
        const stagesWithApplied = ["APPLIED", ...allStages];

        // Determine current stage - applications start in IN_REVIEW, so APPLIED is always completed for active applications
        const currentStage = atsApplication?.stage || ATSStage.IN_REVIEW;

        // Find the index of current stage
        const currentStageIndex = stagesWithApplied.indexOf(currentStage);
        const finalCurrentStageIndex = currentStageIndex >= 0 ? currentStageIndex : 1;

        const isAppliedCompleted = currentStage !== undefined && currentStage !== "APPLIED";

        return stagesWithApplied.map((stage, index) => {
            const isApplied = stage === "APPLIED";
            const isCompleted = isApplied
                ? isAppliedCompleted
                : index < finalCurrentStageIndex;
            const isCurrent = index === finalCurrentStageIndex;
            const isDisabled = index > finalCurrentStageIndex;

            return {
                key: stage,
                label: isApplied ? "Applied" : ATSStageDisplayNames[stage] || stage,
                completed: isCompleted,
                current: isCurrent,
                disabled: isDisabled,
            };
        });
    }, [atsApplication, atsJob]);

    // Helper function to check if the selected stage is the current application stage
    const isCurrentStage = (checkStage: string): boolean => {
        const actualStage = atsApplication?.stage || ATSStage.IN_REVIEW;
        if (checkStage === "APPLIED" || checkStage === "Applied") {
            return actualStage === ATSStage.IN_REVIEW;
        }
        return checkStage === actualStage;
    };

    // Helper function to check if there are next stages available
    const hasNextStages = (currentStage: ATSStage | string): boolean => {
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

        if (!currentStage) return false;

        const currentIndex = allStages.indexOf(currentStage as ATSStage);
        return currentIndex >= 0 && currentIndex < allStages.length - 1;
    };

    // Helper function to get the next stage after current stage
    const getNextStage = (currentStage: ATSStage | string): ATSStage | null => {
        const enabledStagesRaw = atsJob?.enabled_stages || atsJob?.enabledStages || [];
        if (!Array.isArray(enabledStagesRaw) || enabledStagesRaw.length === 0) {
            return null;
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

        if (!currentStage || currentStage === "APPLIED" || currentStage === "Applied") {
            return allStages.length > 0 ? allStages[0] : null;
        }

        const currentIndex = allStages.indexOf(currentStage as ATSStage);
        if (currentIndex >= 0 && currentIndex < allStages.length - 1) {
            return allStages[currentIndex + 1];
        }
        return null;
    };

    return {
        hiringStages,
        isCurrentStage,
        hasNextStages,
        getNextStage
    };
};
