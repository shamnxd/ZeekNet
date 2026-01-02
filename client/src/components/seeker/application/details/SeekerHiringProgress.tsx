
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Video } from 'lucide-react';
import { ATSStage, ATSStageDisplayNames, SubStageDisplayNames } from '@/constants/ats-stages';
import { ATSStage as ATSStageType } from '@/constants/ats-stages';
import type { ATSInterview } from '@/types/ats';
import { useNavigate } from 'react-router-dom';

interface SeekerHiringProgressProps {
    application: Record<string, unknown>;
    interviews: ATSInterview[];
    setShowRescheduleInterviewModal: (show: boolean) => void;
    setShowRescheduleMeetingModal: (show: boolean) => void;
    formatDate: (date: string) => string;
}

export const SeekerHiringProgress: React.FC<SeekerHiringProgressProps> = ({
    application,
    interviews,
    setShowRescheduleInterviewModal,
    setShowRescheduleMeetingModal,
    formatDate,
}) => {
    const navigate = useNavigate();
    const stageValue = typeof application?.stage === 'string' ? application.stage : 'APPLIED';
    const currentStage = stageValue as ATSStageType;
    const currentSubStage = (typeof application?.sub_stage === 'string' ? application.sub_stage : typeof application?.subStage === 'string' ? application.subStage : undefined) as string | undefined;

    const renderInterviewActions = () => {
        const stageStr: string = String(currentStage);
        const isInterview: boolean = stageStr === 'INTERVIEW';
        const hasInterviews: boolean = interviews.length > 0;

        if (!isInterview || !hasInterviews) {
            return null;
        }
        return (
            <div className="mt-6 pt-6 border-t border-[#e5e7eb]">
                <h3 className="text-[16px] font-semibold text-[#1f2937] mb-4">Actions</h3>
                <div className="flex flex-wrap gap-3">
                    {interviews.some((i: ATSInterview) =>
                        (i.videoType === 'in-app' && i.webrtcRoomId && i.status === 'scheduled') ||
                        (i.meetingLink && i.status === 'scheduled')
                    ) ? (
                        <Button
                            onClick={() => {
                                const scheduledInterview = interviews.find((i: ATSInterview) =>
                                    (i.videoType === 'in-app' && i.webrtcRoomId && i.status === 'scheduled') ||
                                    (i.meetingLink && i.status === 'scheduled')
                                );
                                if (scheduledInterview) {
                                    if (scheduledInterview.videoType === 'in-app' && scheduledInterview.webrtcRoomId) {
                                        navigate(`/video-call/${scheduledInterview.webrtcRoomId}`);
                                    } else if (scheduledInterview.meetingLink) {
                                        window.open(scheduledInterview.meetingLink, '_blank');
                                    }
                                }
                            }}
                            className="bg-[#4640DE] hover:bg-[#3730A3] gap-2"
                        >
                            <Video className="h-4 w-4" />
                            {interviews.some((i: ATSInterview) => i.videoType === 'in-app' && i.webrtcRoomId && i.status === 'scheduled')
                                ? 'Join In-App Video'
                                : 'Join Interview'}
                        </Button>
                    ) : null}
                    <Button
                        variant="outline"
                        onClick={() => setShowRescheduleInterviewModal(true)}
                        className="gap-2"
                    >
                        <Calendar className="h-4 w-4" />
                        Request to Reschedule
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6">
            <h2 className="text-[20px] font-bold text-[#1f2937] mb-6">Hiring Progress</h2>

            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-[14px] text-[#6b7280] mb-1">Current Stage</p>
                        <p className="text-[18px] font-semibold text-[#1f2937]">
                            {ATSStageDisplayNames[currentStage] || currentStage}
                        </p>
                    </div>
                    <Badge className="px-4 py-2 text-[14px] font-semibold bg-[#eef2ff] text-[#4640de] border-[#4640de]">
                        {ATSStageDisplayNames[currentStage] || currentStage}
                    </Badge>
                </div>

                {currentSubStage && (
                    <div className="mt-4 pt-4 border-t border-[#e5e7eb]">
                        <p className="text-[14px] text-[#6b7280] mb-1">Sub-stage</p>
                        <p className="text-[16px] font-medium text-[#1f2937]">
                            {SubStageDisplayNames[currentSubStage as keyof typeof SubStageDisplayNames] || (typeof currentSubStage === 'string' ? currentSubStage.replace(/_/g, ' ') : '')}
                        </p>
                    </div>
                )}
            </div>

            {renderInterviewActions()}

            {currentStage === ATSStage.COMPENSATION && (
                <div className="mt-6 pt-6 border-t border-[#e5e7eb]">
                    <h3 className="text-[16px] font-semibold text-[#1f2937] mb-4">Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowRescheduleMeetingModal(true)}
                            className="gap-2"
                        >
                            <Calendar className="h-4 w-4" />
                            Reschedule Meeting
                        </Button>
                    </div>
                </div>
            )}

            {!!application.applied_date && (
                <div className="pt-4 border-t border-[#e5e7eb]">
                    <div className="flex items-center gap-2 text-[14px] text-[#6b7280]">
                        <Calendar className="h-4 w-4" />
                        <span>Applied on {formatDate(String(application?.applied_date || application?.appliedAt || ''))}</span>
                    </div>
                </div>
            )}
        </div>
    );
};
