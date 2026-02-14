import React from 'react';
import type { ATSComment } from '@/types/ats';
import { ATSStage } from '@/constants/ats-stages';
import { formatATSStage, formatATSSubStage } from '@/utils/formatters';

interface SeekerCompensationCommentsProps {
    comments: ATSComment[];
    formatDateTime: (date: string) => string;
}

export const SeekerCompensationComments: React.FC<SeekerCompensationCommentsProps> = ({
    comments,
    formatDateTime,
}) => {
    const compensationComments = comments.filter(
        (c) => String(c.stage).toUpperCase() === ATSStage.COMPENSATION
    );

    if (compensationComments.length === 0) return null;

    return (
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6">
            <h2 className="text-[20px] font-bold text-[#1f2937] mb-6">Comments</h2>
            <div className="space-y-4">
                {compensationComments.map((comment, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <p className="text-sm text-gray-700">{comment.comment}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs font-medium text-blue-600">
                                {formatATSStage(comment.stage)}
                                {comment.subStage ? ` • ${formatATSSubStage(comment.subStage)}` : ''}
                            </span>
                            <span className="text-xs text-gray-400">
                                {formatDateTime(comment.createdAt || comment.timestamp || '')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
