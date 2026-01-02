
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScoreBadge } from '@/components/ui/score-badge';
import { Mail, Phone, Instagram, Twitter, Globe, MessageCircle } from 'lucide-react';
import { ApplicationStage } from '@/constants/enums';
import type { ApplicationDetails as ApplicationDetailsData } from '@/interfaces/application/application-details.interface';
import { getInitials, getTimeAgo } from '@/utils/formatters';

interface ApplicationSidebarProps {
    application: ApplicationDetailsData;
    onScheduleInterview: () => void;
    onMoveToNextStep: () => void;
    onChat: () => void;
}

export const ApplicationSidebar: React.FC<ApplicationSidebarProps> = ({
    application,
    onScheduleInterview,
    onMoveToNextStep,
    onChat
}) => {
    const getStageBadge = (stage: string) => {
        const stageMap: Record<string, { label: string; className: string }> = {
            [ApplicationStage.APPLIED]: { label: 'Applied', className: 'border-[#4640DE] text-[#4640DE]' },
            [ApplicationStage.SHORTLISTED]: { label: 'Shortlisted', className: 'border-[#4640DE] text-[#4640DE]' },
            [ApplicationStage.INTERVIEW]: { label: 'Interview', className: 'border-[#4640DE] text-[#4640DE]' },
            [ApplicationStage.REJECTED]: { label: 'Rejected', className: 'border-red-500 text-red-500' },
            [ApplicationStage.HIRED]: { label: 'Hired', className: 'border-[#56CDAD] text-[#56CDAD]' },
        };
        const stageInfo = stageMap[stage] || stageMap[ApplicationStage.APPLIED];
        return (
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#4640DE]"></div>
                <span className={`text-sm font-medium ${stageInfo.className}`}>{stageInfo.label}</span>
            </div>
        );
    };

    return (
        <Card className="border border-[#D6DDEB] rounded-lg">
            <CardContent className="p-5">
                <div className="flex items-start gap-4 mb-5">
                    <Avatar className="w-16 h-16">
                        {application.seeker_avatar ? (
                            <AvatarImage src={application.seeker_avatar} alt={application.seeker_name} />
                        ) : null}
                        <AvatarFallback className="bg-[#4640DE]/10 text-[#4640DE] text-lg font-semibold">
                            {getInitials(application.seeker_name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-[#25324B] mb-1">{application.seeker_name}</h2>
                        <p className="text-sm text-[#7C8493] mb-3">{application.seeker_headline || application.job_title}</p>

                        {}
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600">ATS Match Score</span>
                            <ScoreBadge score={application.score} />
                        </div>
                        <div className="flex items-center gap-3">
                            {application.score === -1 ? (
                                <>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                        <div className="h-full rounded-full bg-blue-400 animate-pulse" style={{ width: '50%' }} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 min-w-[4rem] text-right">
                                        Calculating...
                                    </span>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="bg-[#F8F8FD] rounded-lg p-4 mb-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-[#25324B]">Applied Jobs</span>
                        <span className="text-sm text-[#7C8493]">{getTimeAgo(application.applied_date)}</span>
                    </div>
                    <div className="h-px bg-[#D6DDEB] mb-3"></div>
                    <div>
                        <p className="text-sm font-semibold text-[#25324B] mb-1">{application.job_title}</p>
                        <div className="flex items-center gap-2 text-xs text-[#7C8493]">
                            <span>{application.job_company}</span>
                            <span>•</span>
                            <span>{application.job_type}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#F8F8FD] rounded-lg p-4 mb-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-[#25324B]">Stage</span>
                    </div>
                    <div className="h-px bg-[#D6DDEB] mb-3"></div>
                    {getStageBadge(application.stage)}
                </div>

                <div className="flex items-center gap-2 mb-5">
                    {application.stage === ApplicationStage.SHORTLISTED ? (
                        <Button
                            variant="outline"
                            className="flex-1 border-[#CCCCF5] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
                            onClick={onScheduleInterview}
                        >
                            Schedule Interview
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            className="flex-1 border-[#CCCCF5] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
                            onClick={onMoveToNextStep}
                            disabled={application.stage === ApplicationStage.REJECTED || application.stage === ApplicationStage.HIRED}
                        >
                            Move To Next Stage
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        className="border-[#CCCCF5] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
                        onClick={onChat}
                        title="Chat with applicant"
                    >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat
                    </Button>
                </div>

                <div className="h-px bg-[#D6DDEB] mb-5"></div>

                <div>
                    <h3 className="text-lg font-semibold text-[#25324B] mb-4">Contact</h3>
                    <div className="space-y-4">
                        {application.email && (
                            <div className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-[#7C8493] mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-[#7C8493] mb-0.5">Email</p>
                                    <p className="text-sm font-medium text-[#25324B]">{application.email}</p>
                                </div>
                            </div>
                        )}
                        {application.phone && (
                            <div className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-[#7C8493] mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-[#7C8493] mb-0.5">Phone</p>
                                    <p className="text-sm font-medium text-[#25324B]">{application.phone}</p>
                                </div>
                            </div>
                        )}
                        {application.instagram && (
                            <div className="flex items-start gap-3">
                                <Instagram className="w-5 h-5 text-[#7C8493] mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-[#7C8493] mb-0.5">Instagram</p>
                                    <a href={`https://${application.instagram}`} target="_blank" rel="noopener noreferrer"
                                        className="text-sm font-medium text-[#4640DE] hover:underline">
                                        {application.instagram}
                                    </a>
                                </div>
                            </div>
                        )}
                        {application.twitter && (
                            <div className="flex items-start gap-3">
                                <Twitter className="w-5 h-5 text-[#7C8493] mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-[#7C8493] mb-0.5">Twitter</p>
                                    <a href={`https://${application.twitter}`} target="_blank" rel="noopener noreferrer"
                                        className="text-sm font-medium text-[#4640DE] hover:underline">
                                        {application.twitter}
                                    </a>
                                </div>
                            </div>
                        )}
                        {application.website && (
                            <div className="flex items-start gap-3">
                                <Globe className="w-5 h-5 text-[#7C8493] mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-[#7C8493] mb-0.5">Website</p>
                                    <a href={`https://${application.website}`} target="_blank" rel="noopener noreferrer"
                                        className="text-sm font-medium text-[#4640DE] hover:underline">
                                        {application.website}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
