
import React from 'react';

interface SeekerApplicationSidebarProps {
    application: Record<string, unknown> | null;
}

export const SeekerApplicationSidebar: React.FC<SeekerApplicationSidebarProps> = ({ application }) => {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6">
                <h3 className="text-[18px] font-bold text-[#1f2937] mb-4">Job Information</h3>
                <div className="space-y-3">
                    <div>
                        <p className="text-[13px] text-[#6b7280] mb-1">Position</p>
                        <p className="text-[15px] font-semibold text-[#1f2937]">
                            {String(application?.job_title || application?.jobTitle || '')}
                        </p>
                    </div>
                    {application?.job_company ? (
                        <div>
                            <p className="text-[13px] text-[#6b7280] mb-1">Company</p>
                            <p className="text-[15px] font-medium text-[#1f2937]">{String(application.job_company)}</p>
                        </div>
                    ) : null}
                    {application?.job_location ? (
                        <div>
                            <p className="text-[13px] text-[#6b7280] mb-1">Location</p>
                            <p className="text-[15px] font-medium text-[#1f2937]">{String(application.job_location)}</p>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};
