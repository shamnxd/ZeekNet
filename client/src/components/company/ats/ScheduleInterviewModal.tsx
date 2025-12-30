import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Video, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Interview {
    id?: string;
    title?: string;
    type?: 'online' | 'offline';
    scheduledDate?: string;
    location?: string;
    meetingLink?: string;
    status?: 'scheduled' | 'completed' | 'cancelled';
    rating?: number;
    feedback?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface ScheduleInterviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidateName: string;
    onSchedule: (data: InterviewFormData, interviewId?: string) => void;
    interviewToReschedule?: Interview;
}

interface InterviewFormData {
    title: string;
    type: 'online' | 'offline';
    date: string;
    time: string;
    location?: string;
    meetingLink?: string;
    notes?: string;
}

export const ScheduleInterviewModal = ({
    isOpen,
    onClose,
    candidateName,
    onSchedule,
    interviewToReschedule
}: ScheduleInterviewModalProps) => {
    const [formData, setFormData] = useState<InterviewFormData>({
        title: '',
        type: 'online',
        date: '',
        time: '',
        location: '',
        meetingLink: '',
        notes: ''
    });

    // Pre-fill form when rescheduling
    React.useEffect(() => {
        if (interviewToReschedule && isOpen && interviewToReschedule.scheduledDate) {
            const scheduledDate = new Date(interviewToReschedule.scheduledDate);
            setFormData({
                title: interviewToReschedule.title || '',
                type: interviewToReschedule.type || 'online',
                date: scheduledDate.toISOString().split('T')[0] || '',
                time: scheduledDate.toTimeString().slice(0, 5) || '',
                location: interviewToReschedule.location || '',
                meetingLink: interviewToReschedule.meetingLink || '',
                notes: ''
            });
        } else if (!interviewToReschedule && isOpen) {
            // Reset form for new interview
            setFormData({
                title: '',
                type: 'online',
                date: '',
                time: '',
                location: '',
                meetingLink: '',
                notes: ''
            });
        }
    }, [interviewToReschedule, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSchedule(formData, interviewToReschedule?.id);
        onClose();
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
                    className="relative bg-card rounded-2xl border border-border shadow-elevated w-full max-w-lg max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-stage-interview/20 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-stage-interview" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">
                                    {interviewToReschedule ? 'Reschedule Interview' : 'Schedule Interview'}
                                </h2>
                                <p className="text-sm text-muted-foreground">For {candidateName}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Interview Title
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Technical Interview - Round 1"
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                required
                            />
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Interview Type
                            </label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'online' })}
                                    className={cn(
                                        "flex-1 px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2",
                                        formData.type === 'online'
                                            ? "border-primary bg-accent text-primary"
                                            : "border-border hover:border-primary/50"
                                    )}
                                >
                                    <Video className="w-4 h-4" />
                                    <span className="font-medium">Online</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'offline' })}
                                    className={cn(
                                        "flex-1 px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2",
                                        formData.type === 'offline'
                                            ? "border-primary bg-accent text-primary"
                                            : "border-border hover:border-primary/50"
                                    )}
                                >
                                    <MapPin className="w-4 h-4" />
                                    <span className="font-medium">In-Person</span>
                                </button>
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Time
                                </label>
                                <input
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Location or Meeting Link */}
                        {formData.type === 'online' ? (
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Meeting Link
                                </label>
                                <input
                                    type="url"
                                    value={formData.meetingLink}
                                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                                    placeholder="https://meet.google.com/..."
                                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g., 123 Main St, Conference Room A"
                                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        )}

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Notes (Optional)
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Any additional notes for the interview..."
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1 gradient-primary text-primary-foreground hover:opacity-90">
                                {interviewToReschedule ? 'Reschedule Interview' : 'Schedule Interview'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
