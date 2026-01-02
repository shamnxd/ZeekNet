
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ApplicationDetails as ApplicationDetailsData, InterviewScheduleItem } from '@/interfaces/application/application-details.interface';
import { ApplicationProfileTab } from './tabs/ApplicationProfileTab';
import { ApplicationResumeTab } from './tabs/ApplicationResumeTab';
import { ApplicationProgressTab } from './tabs/ApplicationProgressTab';
import { ApplicationScheduleTab } from './tabs/ApplicationScheduleTab';

interface ApplicationTabsProps {
    application: ApplicationDetailsData;
    onGiveRating: () => void;
    onAddSchedule: () => void;
    onMoveToNextStep: () => void;
    onAddFeedback: (interviewId: string) => void;
    onEditSchedule: (interview: InterviewScheduleItem) => void;
    onCancelInterview: (id: string) => void;
    onMarkAsCompleted: (id: string) => void;
}

export const ApplicationTabs: React.FC<ApplicationTabsProps> = ({
    application,
    onGiveRating,
    onAddSchedule,
    onMoveToNextStep,
    onAddFeedback,
    onEditSchedule,
    onCancelInterview,
    onMarkAsCompleted,
}) => {
    return (
        <Card className="border border-[#D6DDEB] rounded-lg">
            <Tabs defaultValue="profile" className="w-full">
                <div className="border-b border-[#D6DDEB] px-5">
                    <TabsList className="bg-transparent h-auto p-0">
                        <TabsTrigger value="profile" className="data-[state=active]:border-b-2 data-[state=active]:border-[#4640DE] data-[state=active]:text-[#25324B] !shadow-none rounded-none">
                            Applicant Profile
                        </TabsTrigger>
                        <TabsTrigger value="resume" className="data-[state=active]:border-b-2 data-[state=active]:border-[#4640DE] data-[state=active]:text-[#25324B] !shadow-none rounded-none">
                            Resume
                        </TabsTrigger>
                        <TabsTrigger value="progress" className="data-[state=active]:border-b-2 data-[state=active]:border-[#4640DE] data-[state=active]:text-[#25324B] !shadow-none rounded-none">
                            Hiring Progress
                        </TabsTrigger>
                        <TabsTrigger value="schedule" className="data-[state=active]:border-b-2 data-[state=active]:border-[#4640DE] data-[state=active]:text-[#25324B] !shadow-none rounded-none">
                            Interview Schedules
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="profile" className="p-7 m-0">
                    <ApplicationProfileTab application={application} />
                </TabsContent>

                <TabsContent value="resume" className="p-7 m-0">
                    <ApplicationResumeTab application={application} />
                </TabsContent>

                <TabsContent value="progress" className="p-7 m-0">
                    <ApplicationProgressTab
                        application={application}
                        onGiveRating={onGiveRating}
                        onAddSchedule={onAddSchedule}
                        onMoveToNextStep={onMoveToNextStep}
                    />
                </TabsContent>

                <TabsContent value="schedule" className="p-7 m-0">
                    <ApplicationScheduleTab
                        application={application}
                        onAddSchedule={onAddSchedule}
                        onAddFeedback={onAddFeedback}
                        onEditSchedule={onEditSchedule}
                        onCancelInterview={onCancelInterview}
                        onMarkAsCompleted={onMarkAsCompleted}
                    />
                </TabsContent>
            </Tabs>
        </Card>
    );
};
