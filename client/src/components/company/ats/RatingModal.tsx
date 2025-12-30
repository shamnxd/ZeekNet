import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    itemName: string;
    onSubmit: (rating: number, feedback: string) => void;
}

export const RatingModal = ({
    isOpen,
    onClose,
    title,
    itemName,
    onSubmit
}: RatingModalProps) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = () => {
        if (rating === 0) return;
        onSubmit(rating, feedback);
        setRating(0);
        setHoveredRating(0);
        setFeedback('');
        onClose();
    };

    const handleClose = () => {
        setRating(0);
        setHoveredRating(0);
        setFeedback('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-foreground">{title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-5 py-4">
                    <div className="text-sm text-muted-foreground">
                        Rate: <span className="font-medium text-foreground">{itemName}</span>
                    </div>

                    {/* Star Rating */}
                    <div className="space-y-2">
                        <Label>Rating <span className="text-destructive">*</span></Label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <Star
                                        className={cn(
                                            "w-8 h-8 transition-colors",
                                            (hoveredRating || rating) >= star
                                                ? "text-warning fill-warning"
                                                : "text-muted-foreground/30"
                                        )}
                                    />
                                </button>
                            ))}
                            <span className="ml-2 text-sm text-muted-foreground">
                                {rating > 0 ? `${rating}/5` : 'Select rating'}
                            </span>
                        </div>
                    </div>

                    {/* Feedback */}
                    <div className="space-y-2">
                        <Label htmlFor="feedback">Feedback / Notes (optional)</Label>
                        <Textarea
                            id="feedback"
                            placeholder="Add your feedback or notes about this evaluation..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={rating === 0}
                        className="gradient-primary text-primary-foreground"
                    >
                        Submit Rating
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
