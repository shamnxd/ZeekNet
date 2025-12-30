import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Video, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface CompensationMeeting {
    id?: string;
    type?: 'call' | 'online' | 'in-person';
    scheduledDate?: string;
    location?: string;
    meetingLink?: string;
    notes?: string;
    status?: 'scheduled' | 'completed' | 'cancelled';
    completedAt?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface CompensationMeetingModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidateName: string;
    onSchedule: (data: CompensationMeetingData) => void;
    meetingToEdit?: CompensationMeeting;
}

interface CompensationMeetingData {
    type: 'call' | 'online' | 'in-person';
    date: string;
    time: string;
    location?: string;
    meetingLink?: string;
    notes?: string;
}

export const CompensationMeetingModal = ({
    isOpen,
    onClose,
    candidateName,
    onSchedule,
    meetingToEdit
}: CompensationMeetingModalProps) => {
    const [formData, setFormData] = useState<CompensationMeetingData>({
        type: 'call',
        date: '',
        time: '',
        location: '',
        meetingLink: '',
        notes: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (meetingToEdit) {
                // Edit mode - populate form with existing meeting data
                let scheduledDate: Date
                if (meetingToEdit.scheduledDate) {
                    scheduledDate = new Date(meetingToEdit.scheduledDate)
                    // Handle timezone issues - use local time
                    const year = scheduledDate.getFullYear()
                    const month = String(scheduledDate.getMonth() + 1).padStart(2, '0')
                    const day = String(scheduledDate.getDate()).padStart(2, '0')
                    const hours = String(scheduledDate.getHours()).padStart(2, '0')
                    const minutes = String(scheduledDate.getMinutes()).padStart(2, '0')
                    
                    const dateStr = `${year}-${month}-${day}`
                    const timeStr = `${hours}:${minutes}`
                    
                    setFormData({
                        type: (meetingToEdit.type || 'call') as 'call' | 'online' | 'in-person',
                        date: dateStr,
                        time: timeStr,
                        location: meetingToEdit.location || '',
                        meetingLink: meetingToEdit.meetingLink || '',
                        notes: meetingToEdit.notes || ''
                    })
                } else {
                    // Fallback if no scheduledDate
                    const today = new Date().toISOString().split('T')[0]
                    setFormData({
                        type: (meetingToEdit.type || 'call') as 'call' | 'online' | 'in-person',
                        date: today,
                        time: '',
                        location: meetingToEdit.location || '',
                        meetingLink: meetingToEdit.meetingLink || '',
                        notes: meetingToEdit.notes || ''
                    })
                }
            } else {
                // New meeting - Set default date to today
                const today = new Date().toISOString().split('T')[0];
                setFormData({
                    type: 'call',
                    date: today,
                    time: '',
                    location: '',
                    meetingLink: '',
                    notes: ''
                });
            }
        }
    }, [isOpen, meetingToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.date || !formData.time) {
            return;
        }
        onSchedule(formData);
        onClose();
    };

    const handleClose = () => {
        setFormData({
            type: 'call',
            date: '',
            time: '',
            location: '',
            meetingLink: '',
            notes: ''
        });
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
                <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={handleClose} />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-card rounded-2xl border border-border shadow-elevated w-full max-w-lg max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">{meetingToEdit ? 'Update Compensation Meeting' : 'Compensation Meeting'}</h2>
                                <p className="text-sm text-muted-foreground">For {candidateName}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                        <div className="space-y-2">
                            <Label className="text-foreground">Meeting Type <span className="text-destructive">*</span></Label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'call' })}
                                    className={cn(
                                        "flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors",
                                        formData.type === 'call'
                                            ? "border-amber-600 bg-amber-50 text-amber-700"
                                            : "border-border hover:border-amber-200"
                                    )}
                                >
                                    <Phone className="w-4 h-4" />
                                    <span className="text-sm font-medium">Call</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'online' })}
                                    className={cn(
                                        "flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors",
                                        formData.type === 'online'
                                            ? "border-amber-600 bg-amber-50 text-amber-700"
                                            : "border-border hover:border-amber-200"
                                    )}
                                >
                                    <Video className="w-4 h-4" />
                                    <span className="text-sm font-medium">Online</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'in-person' })}
                                    className={cn(
                                        "flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors",
                                        formData.type === 'in-person'
                                            ? "border-amber-600 bg-amber-50 text-amber-700"
                                            : "border-border hover:border-amber-200"
                                    )}
                                >
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm font-medium">In-person</span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date" className="text-foreground">
                                    Date <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time" className="text-foreground">
                                    Time <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    className="w-full"
                                    required
                                />
                            </div>
                        </div>

                        {formData.type === 'online' && (
                            <div className="space-y-2">
                                <Label htmlFor="meetingLink" className="text-foreground">
                                    Meeting Link
                                </Label>
                                <Input
                                    id="meetingLink"
                                    type="url"
                                    placeholder="https://meet.google.com/..."
                                    value={formData.meetingLink}
                                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                                    className="w-full"
                                />
                            </div>
                        )}

                        {formData.type === 'in-person' && (
                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-foreground">
                                    Location
                                </Label>
                                <Input
                                    id="location"
                                    type="text"
                                    placeholder="Office address or meeting room"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-foreground">Notes / Outcome (Optional)</Label>
                            <Textarea
                                id="notes"
                                placeholder="Add notes about the meeting or expected discussion points..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={4}
                                className="w-full resize-none"
                            />
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-border">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="gradient-primary text-primary-foreground hover:opacity-90"
                                disabled={!formData.date || !formData.time}
                            >
                                {meetingToEdit ? 'Update Meeting' : 'Schedule Meeting'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

