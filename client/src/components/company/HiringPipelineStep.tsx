import React from "react";
import { Button } from "@/components/ui/button";
import { ATSStage, STAGE_DESCRIPTIONS } from "@/constants/ats-stages";
import type { JobPostingStepProps } from "@/interfaces/job/job-posting-step-props.interface";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const HiringPipelineStep: React.FC<JobPostingStepProps> = ({
    data,
    onDataChange,
    onNext,
    onPrevious,
    isLastStep,
    onSubmit,
}) => {
    const allStages = Object.values(ATSStage);

    // Initialize with all stages if empty (first load behavior default)
    const selectedStages = data.enabledStages && data.enabledStages.length > 0
        ? data.enabledStages
        : allStages;

    const handleStageToggle = (stage: string) => {
        // Prevent deselecting mandatory stages if we want to enforce some like IN_REVIEW or OFFER
        // For now, let's assume at least one stage is required

        let newStages: string[];

        if (selectedStages.includes(stage)) {
            newStages = selectedStages.filter(s => s !== stage);
        } else {
            newStages = [...selectedStages, stage];
        }

        // Sort stages based on the original order
        newStages.sort((a, b) => {
            return allStages.indexOf(a as ATSStage) - allStages.indexOf(b as ATSStage);
        });

        onDataChange({ enabledStages: newStages });
    };

    const handleNextAction = () => {
        if (selectedStages.length === 0) {
            // Force at least one stage
            return;
        }
        // ensure the updated state is saved if it was empty initially
        if (!data.enabledStages || data.enabledStages.length === 0) {
            onDataChange({ enabledStages: selectedStages });
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
                    Customize the hiring stages for this job position.
                </p>
            </div>

            <div className="w-full h-px bg-[#D6DDEB]"></div>

            <div className="w-full grid gap-4">
                {allStages.map((stage) => {
                    const isSelected = selectedStages.includes(stage);
                    const description = STAGE_DESCRIPTIONS[stage as ATSStage];

                    return (
                        <div
                            key={stage}
                            onClick={() => handleStageToggle(stage)}
                            className={cn(
                                "group relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md",
                                isSelected
                                    ? "border-[#4640DE] bg-[#4640DE]/5"
                                    : "border-[#D6DDEB] hover:border-[#4640DE]/50 bg-white"
                            )}
                        >
                            <div
                                className={cn(
                                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                                    isSelected
                                        ? "border-[#4640DE] bg-[#4640DE] text-white"
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
                                    {stage}
                                </span>
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
