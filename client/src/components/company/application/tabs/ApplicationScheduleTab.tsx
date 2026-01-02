
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, MapPin, MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ApplicationDetails as ApplicationDetailsData, InterviewScheduleItem } from '@/interfaces/application/application-details.interface';

interface ApplicationScheduleTabProps {
    application: ApplicationDetailsData;
    onAddSchedule: () => void;
    onAddFeedback: (interviewId: string) => void;
    onEditSchedule: (interview: InterviewScheduleItem) => void;
    onCancelInterview: (id: string) => void;
    onMarkAsCompleted: (id: string) => void;
}

export const ApplicationScheduleTab: React.FC<ApplicationScheduleTabProps> = ({
    application,
    onAddSchedule,
    onAddFeedback,
    onEditSchedule,
    onCancelInterview,
    onMarkAsCompleted,
}) => {
    return (
        <div className="space-y-6">
            { }
            <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[#25324B]">Interview List</h3>
                {application.interview_schedule && application.interview_schedule.length > 0 && (
                    <Button
                        variant="ghost"
                        className="text-[#4640DE] hover:text-[#4640DE] hover:bg-[#F8F8FD]"
                        onClick={onAddSchedule}
                        disabled={application.stage === 'rejected' || application.stage === 'hired'}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Schedule Interview
                    </Button>
                )}
            </div>

            { }
            <div className="space-y-6">
                {application.interview_schedule && application.interview_schedule.length > 0 ? (
                    (() => {
                        const grouped = application.interview_schedule.reduce((acc, interview) => {
                            const interviewDate = new Date(interview.date);
                            interviewDate.setHours(0, 0, 0, 0);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const tomorrow = new Date(today);
                            tomorrow.setDate(tomorrow.getDate() + 1);

                            let dateLabel: string;
                            if (interviewDate.getTime() === tomorrow.getTime()) {
                                dateLabel = `Tomorrow - ${interviewDate.toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}`;
                            } else {
                                dateLabel = interviewDate.toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                });
                            }

                            if (!acc[dateLabel]) {
                                acc[dateLabel] = [];
                            }
                            acc[dateLabel].push(interview);
                            return acc;
                        }, {} as Record<string, typeof application.interview_schedule>);

                        return Object.entries(grouped).map(([date, interviews]) => (
                            <div key={date} className="space-y-3">
                                <p className="text-sm text-[#7C8493]">{date}</p>
                                {interviews.map((interview) => (
                                    <div
                                        key={interview.id}
                                        className="bg-white border border-[#D6DDEB] rounded-lg p-4 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="flex-1">
                                                <h4 className="text-base font-semibold text-[#25324B] mb-1">
                                                    {interview.interview_type}
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm text-[#7C8493]">{new Date(interview.date).toLocaleDateString()}</p>
                                                    {interview.status && (
                                                        <Badge className="bg-[#F8F8FD] text-[#4640DE] border-0 px-2 py-0.5 rounded-full text-xs">
                                                            {interview.status}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Clock className="w-4 h-4 text-[#7C8493]" />
                                                    <p className="text-sm font-medium text-[#25324B]">{interview.time}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-[#7C8493]" />
                                                    <p className="text-sm text-[#7C8493]">{interview.location}</p>
                                                </div>
                                                {interview.feedback && (
                                                    <div className="mt-2 rounded-md bg-[#F8F8FD] border border-[#E6EAF5] p-3">
                                                        <p className="text-xs text-[#7C8493] mb-1">Feedback</p>
                                                        <p className="text-sm text-[#25324B]">
                                                            <span className="font-semibold">{interview.feedback.reviewer_name}:</span>{' '}
                                                            {interview.feedback.comment}
                                                            {typeof interview.feedback.rating === 'number' && (
                                                                <span className="ml-2 text-[#FFB836]">({interview.feedback.rating}/5)</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!interview.feedback && interview.status === 'completed' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-[#CCCCF5] text-[#4640DE]"
                                                    onClick={() => onAddFeedback(interview.id)}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add Feedback
                                                </Button>
                                            )}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" size="sm" className="border-[#CCCCF5] text-[#4640DE]">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {interview.status !== 'completed' && interview.status !== 'cancelled' ? (
                                                        <>
                                                            <DropdownMenuItem onClick={() => onEditSchedule(interview)}>Edit Schedule</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => onCancelInterview(interview.id)}>Cancel Interview</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => onMarkAsCompleted(interview.id)}>Mark as Completed</DropdownMenuItem>
                                                        </>
                                                    ) : (
                                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ));
                    })()
                ) : (
                    <div className="text-center py-10">
                        <p className="text-sm text-[#7C8493] mb-4">No interview schedules yet</p>
                        <Button
                            variant="outline"
                            className="border-[#CCCCF5] text-[#4640DE]"
                            onClick={onAddSchedule}
                            disabled={application.stage === 'rejected' || application.stage === 'hired'}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Schedule Interview
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
