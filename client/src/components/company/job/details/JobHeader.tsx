
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { JobPostingResponse } from "@/interfaces/job/job-posting-response.interface";

interface JobHeaderProps {
    jobData: JobPostingResponse;
    onBack: () => void;
    employmentType: string;
}

export const JobHeader: React.FC<JobHeaderProps> = ({ jobData, onBack, employmentType }) => {
    return (
        <div className="border-b border-[#D6DDEB]">
            <div className="px-2 py-2 ">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-1.5"
                            onClick={onBack}
                        >
                            <ArrowLeft className="w-4 h-4 text-[#25324B]" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-semibold text-[#25324B] mb-1.5">{jobData.title}</h1>
                            <div className="flex items-center gap-1.5 text-base text-[#25324B]">
                                <span>{jobData.location || 'Location not specified'}</span>
                                <div className="w-0.5 h-0.5 bg-[#25324B] rounded-full"></div>
                                <span>{employmentType}</span>
                                <div className="w-0.5 h-0.5 bg-[#25324B] rounded-full"></div>
                                <span>{jobData.applicationCount || jobData.application_count || 0} applied</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
