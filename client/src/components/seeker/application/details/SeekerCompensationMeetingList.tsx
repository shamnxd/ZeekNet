
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';
import type { CompensationMeeting } from '@/interfaces/seeker/application-details.types';

interface SeekerCompensationMeetingListProps {
    compensationMeetings: CompensationMeeting[];
    formatDateTime: (date: string) => string;
}

export const SeekerCompensationMeetingList: React.FC<SeekerCompensationMeetingListProps> = ({
    compensationMeetings,
    formatDateTime
}) => {
    if (compensationMeetings.length === 0) return null;

    return (
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6">
            <h2 className="text-[20px] font-bold text-[#1f2937] mb-6 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-amber-600" />
                Compensation Meetings
            </h2>
            <div className="space-y-3">
                {compensationMeetings.filter((m) => m != null).map((meeting, idx: number) => {
                    const meetingType = meeting.type || 'call';
                    const meetingStatus = (meeting.status || 'scheduled').toLowerCase();
                    const isCompleted = meetingStatus === 'completed';
                    const isCancelled = meetingStatus === 'cancelled';
                    const isScheduled = meetingStatus === 'scheduled';

                    let bgColor = '';
                    if (isCancelled) {
                        bgColor = 'bg-gray-50 border-gray-200';
                    } else if (isCompleted) {
                        bgColor = 'bg-green-50 border-green-200';
                    } else {
                        
                        bgColor = 'bg-white border-gray-200'; 
                    }

                    return (
                        <div key={idx} className={`border rounded-lg p-4 ${bgColor}`}>
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-medium text-gray-900 capitalize">{meetingType}</p>
                                        <Badge variant="outline" className="text-xs">{meetingType}</Badge>
                                        {isCompleted && !isCancelled && (
                                            <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                                                Completed
                                            </Badge>
                                        )}
                                        {isCancelled && (
                                            <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700 border-gray-300">
                                                Cancelled
                                            </Badge>
                                        )}
                                        {isScheduled && !isCompleted && !isCancelled && (
                                            <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                                                Scheduled
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {formatDateTime(meeting.scheduledDate || meeting.createdAt)}
                                    </p>
                                </div>
                            </div>
                            {meeting.location && (
                                <p className="text-xs text-gray-500 mt-1">Location: {meeting.location}</p>
                            )}
                            {meeting.meetingLink && (
                                <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" className="text-xs text-[#4640DE] hover:underline mt-1 block">
                                    Meeting Link: {meeting.meetingLink}
                                </a>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
