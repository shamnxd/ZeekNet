
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import type { ATSComment } from "@/types/ats";
import { ATSStage } from "@/constants/ats-stages";
import { formatDateTime } from "@/utils/formatters";
import type { CompensationNote } from "./compensation-stage.types";



interface CompensationNotesProps {
    compensationNotes: CompensationNote[];
    comments: ATSComment[];
    showActions: boolean;
    setShowCommentModal: (show: boolean) => void;
}

export const CompensationNotes: React.FC<CompensationNotesProps> = ({
    compensationNotes,
    comments,
    showActions,
    setShowCommentModal,
}) => {
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
                        Add Note
                    </Button>
                )}
            </div>
            {compensationNotes.length > 0 ||
                comments.filter((c) => c.stage === ATSStage.COMPENSATION).length >
                0 ? (
                <div className="space-y-3">
                    {compensationNotes.map(
                        (
                            note,
                            idx: number
                        ) => (
                            <div key={idx} className="border rounded-lg p-4">
                                <p className="text-sm text-gray-700">
                                    {note.comment || note.note || ""}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    by {note.recruiterName || "Recruiter"} •{" "}
                                    {formatDateTime(note.createdAt || "")}
                                </p>
                            </div>
                        )
                    )}
                    {comments
                        .filter((c) => c.stage === ATSStage.COMPENSATION)
                        .map((comment, idx) => (
                            <div key={idx} className="border rounded-lg p-4">
                                <p className="text-sm text-gray-700">{comment.comment}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                    by{" "}
                                    {comment.recruiterName ||
                                        comment.addedByName ||
                                        comment.addedBy ||
                                        "Recruiter"}{" "}
                                    •{" "}
                                    {formatDateTime(
                                        comment.createdAt || comment.timestamp || ""
                                    )}
                                </p>
                            </div>
                        ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500 italic">
                    No notes or comments yet
                </p>
            )}
        </div>
    );
};
