
import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { ATSInterview } from '@/types/ats';

interface SeekerInterviewListProps {
    interviews: ATSInterview[];
    formatDateTime: (date: string) => string;
}

export const SeekerInterviewList: React.FC<SeekerInterviewListProps> = ({ interviews, formatDateTime }) => {
    if (interviews.length === 0) return null;

    return (
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6">
            <h2 className="text-[20px] font-bold text-[#1f2937] mb-6">Interviews</h2>
            <div className="space-y-4">
                {interviews.map((interview) => (
                    <div key={interview.id} className="border border-[#e5e7eb] rounded-lg p-5">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-[16px] font-semibold !text-[#1f2937] mb-2">{interview.title || 'Interview'}</h3>
                                <div className="flex items-center gap-4 text-[13px] text-[#6b7280]">
                                    <span>{formatDateTime(interview.scheduledDate)}</span>
                                    <Badge className={
                                        interview.status === 'scheduled' ? '!bg-blue-100 !text-blue-700' :
                                            interview.status === 'completed' ? '!bg-green-100 !text-green-700' :
                                                '!bg-gray-100 !text-gray-700'
                                    }>
                                        {interview.status || 'Scheduled'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        {interview.location && (
                            <div className="mb-2">
                                <p className="text-[14px] !text-[#374151]">Location: {interview.location}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
