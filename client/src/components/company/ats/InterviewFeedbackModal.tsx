import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface InterviewFeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    interviewTitle: string;
    onSubmit: (rating: number, feedback: string) => Promise<void>;
}

const ratingLabels: Record<number, string> = {
    1: 'Very Poor',
    2: 'Poor',
    3: 'Average',
    4: 'Good',
    5: 'Excellent'
};

export const InterviewFeedbackModal = ({
    isOpen,
    onClose,
    interviewTitle,
    onSubmit
}: InterviewFeedbackModalProps) => {
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating) {
            return;
        }
        try {
            setIsSubmitting(true);
            await onSubmit(rating, feedback);
            // Reset form
            setRating(0);
            setFeedback('');
            onClose();
        } catch (error) {
            console.error('Error submitting feedback:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const displayRating = hoveredRating || rating;

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
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-border">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Add Interview Feedback</h2>
                            <p className="text-sm text-muted-foreground mt-1">{interviewTitle}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-5 space-y-6">
                        {/* Rating */}
                        <div>
                            <Label className="text-sm font-medium text-foreground mb-3 block">
                                Rating <span className="text-destructive">*</span>
                            </Label>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            className={`w-10 h-10 transition-colors ${
                                                star <= displayRating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {displayRating > 0 && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    {ratingLabels[displayRating]}
                                </p>
                            )}
                        </div>

                        {/* Feedback */}
                        <div>
                            <Label htmlFor="feedback" className="text-sm font-medium text-foreground mb-2 block">
                                Feedback Notes
                            </Label>
                            <Textarea
                                id="feedback"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Share your thoughts about the interview..."
                                rows={6}
                                className="resize-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-[#4640DE] hover:bg-[#3730A3]"
                                disabled={!rating || isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};



