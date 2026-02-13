import React from "react";
import { Button } from "@/components/ui/button";
import { ATSStage, STAGE_DESCRIPTIONS, ATSStageDisplayNames } from "@/constants/ats-stages";
import type { JobPostingStepProps } from "@/interfaces/job/job-posting-step-props.interface";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface HiringPipelineStepProps extends JobPostingStepProps {
    readOnly?: boolean;
}

const HiringPipelineStep: React.FC<HiringPipelineStepProps> = ({
    data,
    onDataChange,
    onNext,
    onPrevious,
    isLastStep,
    onSubmit,
    readOnly = false,
}) => {
    const allStages = Object.values(ATSStage);
    type NonHiredStage = Exclude<ATSStage, typeof ATSStage.HIRED | typeof ATSStage.REJECTED>;
    const availableStages: NonHiredStage[] = allStages.filter(
        (stage): stage is NonHiredStage => stage !== ATSStage.HIRED && stage !== ATSStage.REJECTED
    );
    const requiredStages: NonHiredStage[] = [ATSStage.IN_REVIEW, ATSStage.SHORTLISTED, ATSStage.OFFER];


    const selectedStages = data.enabledStages && data.enabledStages.length > 0
        ? data.enabledStages.filter((stage): stage is NonHiredStage => stage !== ATSStage.HIRED && stage !== ATSStage.REJECTED)
        : availableStages;

    const handleStageToggle = (stage: NonHiredStage) => {
        if (requiredStages.includes(stage)) {
            return;
        }




        let newStages: NonHiredStage[];

        if (selectedStages.includes(stage)) {
            newStages = selectedStages.filter(s => s !== stage);
        } else {
            newStages = [...selectedStages, stage];
        }


        newStages.sort((a, b) => {
            return availableStages.indexOf(a) - availableStages.indexOf(b);
        });

        onDataChange({ enabledStages: newStages });
    };

    const handleNextAction = () => {
        if (selectedStages.length === 0) {

            return;
        }

        if (!data.enabledStages || data.enabledStages.length === 0) {
            onDataChange({ enabledStages: selectedStages });
        }

        const hasRequired = requiredStages.every(stage => selectedStages.includes(stage));
        if (!hasRequired) {
            onDataChange({ enabledStages: Array.from(new Set([...selectedStages, ...requiredStages])) });
            return;
        }

        if (isLastStep) {
            onSubmit();
        } else {
            onNext();
        }
    };

    return (
        <div className="flex flex-col items-end gap-5 px-4 py-6">
            <div className="flex flex-col gap-1 w-full">
                <h2 className="text-base font-semibold text-[#25324B]">Hiring Pipeline</h2>
                <p className="text-sm text-[#7C8493]">
                    {readOnly
                        ? "View the hiring stages for this job position. Stages are automatically configured and cannot be modified."
                        : "Customize the hiring stages for this job position."}
                </p>
            </div>

            <div className="w-full h-px bg-[#D6DDEB]"></div>

            <div className="w-full grid gap-4">
                {availableStages.map((stage) => {
                    const isSelected = selectedStages.includes(stage);
                    const description = STAGE_DESCRIPTIONS[stage];
                    const isRequired = requiredStages.includes(stage);

                    return (
                        <div
                            key={stage}
                            onClick={readOnly ? undefined : () => handleStageToggle(stage)}
                            className={cn(
                                "group relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all",
                                readOnly
                                    ? "cursor-default bg-gray-50"
                                    : "cursor-pointer hover:shadow-md",
                                isSelected
                                    ? "border-[#4640DE] bg-[#4640DE]/5"
                                    : "border-[#D6DDEB] bg-white",
                                !readOnly && !isSelected && "hover:border-[#4640DE]/50"
                            )}
                        >
                            <div
                                className={cn(
                                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                                    isSelected
                                        ? "border-[#4640DE] bg-[#4640DE] text-white"
                                        : readOnly || isRequired
                                            ? "border-[#D6DDEB] bg-transparent"
                                            : "border-[#D6DDEB] bg-transparent group-hover:border-[#4640DE]/50"
                                )}
                            >
                                {isSelected && <Check className="h-4 w-4" />}
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className={cn(
                                    "text-sm font-semibold transition-colors",
                                    isSelected ? "text-[#4640DE]" : "text-[#25324B]"
                                )}>
                                    {ATSStageDisplayNames[stage] || stage}
                                </span>
                                {isRequired && (
                                    <span className="text-xs font-medium text-[#4640DE]">Required</span>
                                )}
                                <span className="text-sm text-[#7C8493]">
                                    {description}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="w-full h-px bg-[#D6DDEB]"></div>

            <div className="flex justify-between w-full">
                <Button
                    onClick={onPrevious}
                    variant="outline"
                    className="w-[150px] h-10 border-[#D6DDEB] text-[#25324B] font-bold rounded-lg hover:bg-gray-50"
                >
                    Previous
                </Button>
                <Button
                    onClick={handleNextAction}
                    disabled={selectedStages.length === 0}
                    variant="company"
                    className="w-[150px] h-10 bg-[#4640de] hover:bg-[#4640DE]/90 text-white text-sm font-bold rounded-lg disabled:opacity-50"
                >
                    {isLastStep ? "Finish" : "Next Step"}
                </Button>
            </div>
        </div>
    );
};

export default HiringPipelineStep;
