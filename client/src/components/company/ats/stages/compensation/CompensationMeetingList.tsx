
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, CheckCircle, X, Edit, Phone } from "lucide-react";
import type { CompensationMeeting } from "@/types/ats-profile";
import { formatDateTime } from "@/utils/formatters";
import { CompensationSubStage } from "@/constants/ats-stages";

interface CompensationMeetingListProps {
    currentSubStage: string;
    showActions: boolean;
    compensationMeetings: CompensationMeeting[];
    candidatePhone: string;
    onAddMeeting: () => void;
    onEditMeeting: (meeting: CompensationMeeting) => void;
    onCompleteMeeting: (meetingId: string) => void;
    onCancelMeeting: (meetingId: string) => void;
}

export const CompensationMeetingList: React.FC<CompensationMeetingListProps> = ({
    currentSubStage,
    showActions,
    compensationMeetings,
    candidatePhone,
    onAddMeeting,
    onEditMeeting,
    onCompleteMeeting,
    onCancelMeeting,
}) => {
    if (currentSubStage === CompensationSubStage.NOT_INITIATED) return null;

    return (
        <div className="bg-white rounded-lg p-6 border mt-6">
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-amber-600" />
                    Discussion / Meeting History
                </h4>
                {showActions && currentSubStage !== CompensationSubStage.APPROVED && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onAddMeeting}
                        className="gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Meeting
                    </Button>
                )}
            </div>

            {compensationMeetings.length > 0 ? (
                <div className="space-y-3">
                    {compensationMeetings
                        .filter((meeting) => meeting != null)
                        .map((meeting: CompensationMeeting, idx: number) => {
                            const meetingType = meeting?.type || "call";
                            const isCall = meetingType === "call";
                            const isCompleted = meeting.status === "completed";
                            const isCancelled = meeting.status === "cancelled";
                            return (
                                <div
                                    key={idx}
                                    className={`border rounded-lg p-4 ${isCompleted
                                        ? "bg-green-50 border-green-200"
                                        : isCancelled
                                            ? "bg-gray-50 border-gray-200"
                                            : ""
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-sm font-medium text-gray-900 capitalize">
                                                    {meetingType}
                                                </p>
                                                <Badge variant="outline" className="text-xs">
                                                    {meetingType}
                                                </Badge>
                                                {isCompleted && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs bg-green-100 text-green-700 border-green-300"
                                                    >
                                                        Completed
                                                    </Badge>
                                                )}
                                                {isCancelled && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs bg-gray-100 text-gray-700 border-gray-300"
                                                    >
                                                        Cancelled
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {formatDateTime(
                                                    meeting.scheduledDate || meeting.createdAt || ""
                                                )}
                                            </p>
                                            {isCompleted && meeting.completedAt && (
                                                <p className="text-xs text-green-600 mt-1">
                                                    Completed on{" "}
                                                    {formatDateTime(meeting.completedAt)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {meeting.location && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Location: {meeting.location}
                                        </p>
                                    )}
                                    {meeting.meetingLink && (
                                        <a
                                            href={meeting.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-[#4640DE] hover:underline mt-1 block"
                                        >
                                            Meeting Link: {meeting.meetingLink}
                                        </a>
                                    )}
                                    {meeting.notes && (
                                        <div className="mt-3 pt-3 border-t">
                                            <p className="text-xs font-medium text-gray-600 mb-1">
                                                Notes / Outcome:
                                            </p>
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                {meeting.notes}
                                            </p>
                                        </div>
                                    )}
                                    {showActions &&
                                        currentSubStage !== CompensationSubStage.APPROVED &&
                                        !isCompleted &&
                                        !isCancelled && (
                                            <div className="flex gap-2 mt-3 pt-3 border-t">
                                                {isCall &&
                                                    candidatePhone &&
                                                    candidatePhone !== "-" && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                (window.location.href = `tel:${candidatePhone}`)
                                                            }
                                                            className="gap-2"
                                                        >
                                                            <Phone className="h-3 w-3" />
                                                            Call {candidatePhone}
                                                        </Button>
                                                    )}
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onEditMeeting(meeting)}
                                                    className="gap-2"
                                                >
                                                    <Edit className="h-3 w-3" />
                                                    Update
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => meeting.id && onCompleteMeeting(meeting.id)}
                                                    className="gap-2 text-green-600 hover:text-green-700"
                                                >
                                                    <CheckCircle className="h-3 w-3" />
                                                    Mark as Completed
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => meeting.id && onCancelMeeting(meeting.id)}
                                                    className="gap-2 text-red-600 hover:text-red-700"
                                                >
                                                    <X className="h-3 w-3" />
                                                    Cancel
                                                </Button>
                                            </div>
                                        )}
                                </div>
                            );
                        })}
                </div>
            ) : (
                <p className="text-sm text-gray-500 italic">
                    No meetings scheduled yet
                </p>
            )}
        </div>
    );
};
