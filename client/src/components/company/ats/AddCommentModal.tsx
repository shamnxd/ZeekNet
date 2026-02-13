import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ATSStage } from '@/constants/ats-stages';

interface AddCommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidateName: string;
    currentStage: ATSStage;
    onAdd: (comment: string) => void;
    isLoading?: boolean;
}

export const AddCommentModal = ({
    isOpen,
    onClose,
    candidateName,
    currentStage,
    onAdd,
    isLoading = false
}: AddCommentModalProps) => {
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim()) {
            onAdd(comment);
            setComment('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
                <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-card rounded-2xl border border-border shadow-elevated w-full max-w-lg"
                >
                    { }
                    <div className="flex items-center justify-between p-5 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">Add Comment</h2>
                                <p className="text-sm text-muted-foreground">For {candidateName} • {currentStage}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    { }
                    <form onSubmit={handleSubmit} className="p-5 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Your Comment
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add your notes about this candidate..."
                                rows={5}
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                required
                                autoFocus
                                disabled={isLoading}
                            />
                        </div>

                        { }
                        <div className="flex gap-3">
                            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 gradient-primary text-primary-foreground hover:opacity-90 gap-2"
                                disabled={isLoading || !comment.trim()}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    'Add Comment'
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
