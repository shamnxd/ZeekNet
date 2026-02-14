import { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

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

            setRating(0);
            setFeedback('');
            onClose();
        } catch (error) {
            console.error('Error submitting feedback:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const displayRating = hoveredRating || rating;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        Add Interview Feedback
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        For <span className="font-medium">{interviewTitle}</span>
                    </p>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    {/* Rating Section */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">
                            Rating <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg border border-border/50">
                            <div className="flex items-center gap-2 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-8 h-8 transition-colors ${star <= displayRating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-muted-foreground/30'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className={`text-sm font-medium transition-all ${displayRating > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                                {displayRating > 0 ? ratingLabels[displayRating] : 'Select a rating'}
                            </p>
                        </div>
                    </div>

                    {/* Feedback Section */}
                    <div className="space-y-2">
                        <Label htmlFor="feedback" className="text-sm font-medium">
                            Feedback Notes
                        </Label>
                        <Textarea
                            id="feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Share your thoughts about the candidate's performance, strengths, and areas for improvement..."
                            rows={5}
                            className="resize-none focus-visible:ring-primary"
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!rating || isSubmitting}
                        className="bg-[#4640DE] hover:bg-[#3730A3]"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Feedback'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};



