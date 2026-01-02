
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { File as FileIcon, ExternalLink, Upload } from 'lucide-react';
import type { ExtendedATSTechnicalTask } from '@/interfaces/seeker/application-details.types';

interface SeekerTaskListProps {
    technicalTasks: ExtendedATSTechnicalTask[];
    onTaskSubmit: (task: ExtendedATSTechnicalTask) => void;
    formatDate: (date: string) => string;
    formatDateTime: (date: string) => string;
}

export const SeekerTaskList: React.FC<SeekerTaskListProps> = ({
    technicalTasks,
    onTaskSubmit,
    formatDate,
    formatDateTime
}) => {
    if (technicalTasks.length === 0) return null;

    return (
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6">
            <h2 className="text-[20px] font-bold text-[#1f2937] mb-6">Technical Tasks</h2>
            <div className="space-y-4">
                {technicalTasks.map((task) => {
                    const taskStatus = task.status || 'assigned';
                    const isAssigned = taskStatus === 'assigned';
                    const isSubmitted = taskStatus === 'submitted';
                    const isUnderReview = taskStatus === 'under_review';

                    return (
                        <div key={task.id} className="border border-[#e5e7eb] rounded-lg p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-[16px] font-semibold text-[#1f2937] mb-2">{task.title}</h3>
                                    <div className="flex items-center gap-4 text-[13px] text-[#6b7280]">
                                        <span>Due: {task.deadline ? formatDate(task.deadline) : 'No deadline'}</span>
                                        <Badge className={
                                            isAssigned ? 'bg-blue-100 text-blue-700' :
                                                isSubmitted ? 'bg-yellow-100 text-yellow-700' :
                                                    isUnderReview ? 'bg-purple-100 text-purple-700' :
                                                        'bg-green-100 text-green-700'
                                        }>
                                            {isAssigned ? 'Assigned' :
                                                isSubmitted ? 'Submitted' :
                                                    isUnderReview ? 'Under Review' :
                                                        'Completed'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {task.description && (
                                <div className="mb-4">
                                    <p className="text-[14px] text-[#374151] whitespace-pre-wrap">{task.description}</p>
                                </div>
                            )}

                            {task.documentUrl && task.documentFilename && (
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 text-[14px] text-[#6b7280]">
                                        <FileIcon className="h-4 w-4" />
                                        <a
                                            href={task.documentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#4640de] hover:underline flex items-center gap-1"
                                        >
                                            {task.documentFilename}
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                </div>
                            )}

                            {isAssigned && (
                                <div className="mt-4 pt-4 border-t border-[#e5e7eb]">
                                    <Button
                                        onClick={() => onTaskSubmit(task)}
                                        className="bg-[#4640DE] hover:bg-[#3730A3] gap-2"
                                    >
                                        <Upload className="h-4 w-4" />
                                        Submit Task
                                    </Button>
                                </div>
                            )}

                            {isSubmitted && (task.submissionUrl || task.submissionLink) && (
                                <div className="mb-4 p-3 bg-[#f9fafb] rounded border border-[#e5e7eb]">
                                    <p className="text-[13px] font-medium text-[#1f2937] mb-2">Your Submission</p>

                                    {task.submissionUrl && (
                                        <div className="mb-2 flex items-center gap-2 text-[13px] text-[#6b7280]">
                                            <FileIcon className="h-4 w-4" />
                                            <a
                                                href={task.submissionUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#4640de] hover:underline flex items-center gap-1"
                                            >
                                                {task.submissionFilename || 'Submission File'}
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                    )}

                                    {task.submissionLink && (
                                        <div className="mb-2 flex items-center gap-2 text-[13px] text-[#6b7280]">
                                            <ExternalLink className="h-4 w-4" />
                                            <a
                                                href={task.submissionLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#4640de] hover:underline flex items-center gap-1"
                                            >
                                                View Submission Link
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                    )}

                                    {task.submissionNote && (
                                        <div className="mt-3 pt-3 border-t border-[#e5e7eb]">
                                            <p className="text-[12px] font-medium text-[#1f2937] mb-1">Notes:</p>
                                            <p className="text-[13px] text-[#374151] whitespace-pre-wrap">{task.submissionNote}</p>
                                        </div>
                                    )}

                                    {task.submittedAt && (
                                        <p className="text-[12px] text-[#9ca3af] mt-2">
                                            Submitted: {formatDateTime(task.submittedAt)}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
