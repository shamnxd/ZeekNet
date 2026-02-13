import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Loader2 } from 'lucide-react';
import { ATSStage, ATSStageDisplayNames } from '@/constants/ats-stages';

interface AddCommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidateName: string;
    currentStage: ATSStage;
    onAdd: (comment: string) => Promise<void>;
    isLoading?: boolean;
}

export const AddCommentModal = ({
    isOpen,
    onClose,
    candidateName,
    currentStage,
    onAdd,
    isLoading: externalIsLoading = false
}: AddCommentModalProps) => {
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const isLoading = externalIsLoading || isSubmitting;

    useEffect(() => {
        if (!isOpen) {
            setComment('');
            setError('');
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!comment.trim()) {
            setError('Please enter a comment');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');
            await onAdd(comment.trim());
            onClose();
        } catch (err) {
            console.error('Error adding comment:', err);
            setError('Failed to add comment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-gray-500" />
                        Add Comment
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="text-sm text-gray-500">
                        Adding comment for <span className="font-medium text-gray-900">{candidateName}</span> in <span className="font-medium text-gray-900">{ATSStageDisplayNames[currentStage] || currentStage}</span> stage.
                    </div>

                    <div className="space-y-2">
                        <Textarea
                            placeholder="Enter your comment here..."
                            value={comment}
                            onChange={(e) => {
                                setComment(e.target.value);
                                setError('');
                            }}
                            rows={4}
                            className="resize-none"
                        />
                        {error && (
                            <p className="text-sm text-red-500">
                                {error}
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !comment.trim()}
                        className="bg-[#4640DE] hover:bg-[#3730A3]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            'Add Comment'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
