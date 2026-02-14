
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
                                        <Badge variant="outline" className="text-xs capitalize">{meetingType}</Badge>
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
                                {isScheduled && ((meeting.videoType === 'in-app' && meeting.webrtcRoomId) || meeting.meetingLink) && (
                                    <button
                                        onClick={() => {
                                            if (meeting.videoType === 'in-app' && meeting.webrtcRoomId) {
                                                window.open(`/video-call/${meeting.webrtcRoomId}`, '_blank');
                                            } else if (meeting.meetingLink) {
                                                window.open(meeting.meetingLink, '_blank');
                                            }
                                        }}
                                        className="text-xs bg-[#4640DE] hover:bg-[#3730A3] text-white px-3 py-1.5 rounded-md font-medium transition-colors"
                                    >
                                        {meeting.videoType === 'in-app' ? 'Join Call' : 'Join Meeting'}
                                    </button>
                                )}
                            </div>
                            {meeting.location && (
                                <p className="text-xs text-gray-500 mt-1">Location: {meeting.location}</p>
                            )}
                            {meeting.notes && (
                                <p className="text-xs text-gray-500 mt-2 italic">Note: {meeting.notes}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
