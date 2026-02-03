
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';
import type { ApplicationDetails as ApplicationDetailsData } from '@/interfaces/application/application-details.interface';
import { getInitials } from '@/utils/formatters';

interface ApplicationProgressTabProps {
    application: ApplicationDetailsData;
    onGiveRating: () => void;
    onAddSchedule: () => void;
    onMoveToNextStep: () => void;
}

export const ApplicationProgressTab: React.FC<ApplicationProgressTabProps> = ({
    application,
    onGiveRating,
    onAddSchedule,
    onMoveToNextStep,
}) => {
    return (
        <div className="space-y-6">
            { }
            <div>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-[#25324B]">Current Stage</h3>
                    {application.stage === 'interview' && (
                        <Button
                            variant="outline"
                            className="border-[#CCCCF5] text-[#4640DE]"
                            onClick={onGiveRating}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Give Rating
                        </Button>
                    )}
                </div>

                { }
                {(() => {
                    const stageOrder = ['in-review', 'shortlisted', 'interview', 'hired/declined'] as const;
                    const mapStageToIndex: Record<string, number> = {
                        'applied': 0,
                        'shortlisted': 1,
                        'interview': 2,
                        'hired': 3,
                        'rejected': 3,
                    };
                    const activeIndex = mapStageToIndex[application.stage] ?? 0;
                    return (
                        <div className="flex items-center gap-2 mb-6">
                            {stageOrder.map((label, idx) => (
                                <div
                                    key={label}
                                    className={`flex-1 rounded-lg px-4 py-3 text-center ${idx === activeIndex ? 'bg-[#4640DE] text-white' : idx < activeIndex ? 'bg-[#E9EBFD] text-[#4640DE]' : 'bg-[#F8F8FD] text-[#7C8493]'
                                        }`}
                                >
                                    <p className="text-sm font-semibold capitalize">{label}</p>
                                </div>
                            ))}
                        </div>
                    );
                })()}

                { }
                {application.stage !== 'hired' && application.stage !== 'rejected' && (
                    <div className="bg-white border border-[#D6DDEB] rounded-lg p-5">
                        <h4 className="text-base font-semibold text-[#25324B] mb-4">Stage Info</h4>
                        {application.stage === 'interview' ? (
                            <div className="space-y-4">
                                {application.interview_schedule && application.interview_schedule.length > 0 ? (
                                    <div className="space-y-3">
                                        {application.interview_schedule.map((interview) => (
                                            <div key={interview.id} className="border border-[#D6DDEB] rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <p className="text-sm font-semibold text-[#25324B] mb-1">
                                                            {interview.interview_type}
                                                        </p>
                                                        <p className="text-xs text-[#7C8493]">
                                                            {new Date(interview.date).toLocaleDateString()} • {interview.time}
                                                        </p>
                                                    </div>
                                                    {interview.status && (
                                                        <Badge
                                                            className={`border-0 px-3 py-1 rounded-full text-xs font-semibold ${interview.status === 'completed'
                                                                ? 'bg-[#56CDAD]/10 text-[#56CDAD]'
                                                                : interview.status === 'scheduled'
                                                                    ? 'bg-[#4640DE]/10 text-[#4640DE]'
                                                                    : interview.status === 'cancelled'
                                                                        ? 'bg-red-100 text-red-600'
                                                                        : 'bg-[#FFB836]/10 text-[#FFB836]'
                                                                }`}
                                                        >
                                                            {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                                                        </Badge>
                                                    )}
                                                </div>
                                                {interview.feedback && (
                                                    <div className="mt-2 pt-2 border-t border-[#D6DDEB]">
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
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-[#7C8493] text-center py-4">No interviews scheduled</p>
                                )}
                                <Button
                                    variant="outline"
                                    className="w-full border-[#CCCCF5] text-[#4640DE] bg-[#F8F8FD]"
                                    onClick={onMoveToNextStep}
                                >
                                    Move To Next Step
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {application.stage === 'shortlisted' ? (
                                    <Button
                                        variant="outline"
                                        className="w-full border-[#CCCCF5] text-[#4640DE] bg-[#F8F8FD]"
                                        onClick={onAddSchedule}
                                    >
                                        Schedule Interview
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="w-full border-[#CCCCF5] text-[#4640DE] bg-[#F8F8FD]"
                                        onClick={onMoveToNextStep}
                                    >
                                        Move To Next Step
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="h-px bg-[#D6DDEB]"></div>

            { }
            <div>
                <div className="space-y-4">
                    {application.hiring_progress?.notes && application.hiring_progress.notes.length > 0 ? (
                        application.hiring_progress.notes.map((note) => (
                            <div key={note.id} className="bg-white border border-[#D6DDEB] rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <Avatar className="w-10 h-10">
                                        {note.author_avatar ? (
                                            <AvatarImage src={note.author_avatar} />
                                        ) : null}
                                        <AvatarFallback className="bg-[#4640DE]/10 text-[#4640DE] text-xs">
                                            {getInitials(note.author)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-semibold text-[#25324B]">{note.author}</span>
                                            <span className="text-xs text-[#7C8493]">{note.date}</span>
                                            <div className="w-1 h-1 rounded-full bg-[#7C8493]"></div>
                                            <span className="text-xs text-[#7C8493]">{note.time}</span>
                                        </div>
                                        <p className="text-sm text-[#25324B] mb-2">{note.content}</p>
                                        {note.replies ? (
                                            <button className="text-sm font-semibold text-[#4640DE] hover:underline">
                                                {note.replies} Replies
                                            </button>
                                        ) : (
                                            <button className="text-sm font-semibold text-[#4640DE] hover:underline">
                                                Reply
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-[#7C8493] text-center py-4">No notes yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};
