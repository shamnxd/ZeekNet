
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { JobPostingResponse } from "@/interfaces/job/job-posting-response.interface";

interface JobStatusAlertProps {
    jobData: JobPostingResponse;
}

export const JobStatusAlert: React.FC<JobStatusAlertProps> = ({ jobData }) => {
    if (jobData.status === 'blocked') {
        return (
            <div className="px-7 py-4 bg-red-50 border-b border-red-200">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="text-sm font-semibold text-red-800 mb-1">
                            This job has been blocked by admin
                        </h3>
                        {(jobData.unpublishReason || jobData.unpublish_reason) && (
                            <p className="text-sm text-red-700">
                                Reason: {jobData.unpublishReason || jobData.unpublish_reason}
                            </p>
                        )}
                        <p className="text-xs text-red-600 mt-1">
                            The job is not visible to job seekers. Please review and update the job details or contact admin for more information.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (jobData.status === 'expired') {
        return (
            <div className="px-7 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 mb-1">
                            This job has expired
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                            This job posting has expired and is no longer visible to job seekers.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
