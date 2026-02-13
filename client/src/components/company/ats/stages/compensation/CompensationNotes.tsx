
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import type { ATSComment } from "@/types/ats";
import { ATSStage } from "@/constants/ats-stages";
import { formatDateTime, formatATSStage, formatATSSubStage } from "@/utils/formatters";

interface CompensationNotesProps {
    comments: ATSComment[];
    showActions: boolean;
    setShowCommentModal: (show: boolean) => void;
}

export const CompensationNotes: React.FC<CompensationNotesProps> = ({
    comments,
    showActions,
    setShowCommentModal,
}) => {
    const compensationComments = comments.filter((c) => c.stage === ATSStage.COMPENSATION);

    return (
        <div className="bg-white rounded-lg p-6 border mt-6">
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-amber-600" />
                    Notes & Comments
                </h4>
                {showActions && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowCommentModal(true)}
                        className="gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Comment
                    </Button>
                )}
            </div>
            {compensationComments.length > 0 ? (
                <div className="space-y-3">
                    {compensationComments.map((comment, idx) => (
                        <div key={idx} className="border rounded-lg p-4">
                            <p className="text-sm text-gray-700">{comment.comment}</p>
                            <p className="text-xs text-blue-600 font-medium mt-1">
                                {formatATSStage(comment.stage)} {comment.subStage ? `• ${formatATSSubStage(comment.subStage)}` : ''}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {formatDateTime(
                                    comment.createdAt || comment.timestamp || ""
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500 italic">
                    No comments yet
                </p>
            )}
        </div>
    );
};
