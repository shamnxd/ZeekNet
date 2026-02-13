import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Loader2, Video, MapPin, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define interfaces locally to match previous file structure
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
    onSchedule: (data: InterviewFormData, interviewId?: string) => Promise<void>;
    interviewToReschedule?: Interview;
    isLoading?: boolean;
}

export interface InterviewFormData {
    title: string;
    type: 'online' | 'offline';
    videoType?: 'in-app' | 'external';
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
    interviewToReschedule,
    isLoading: externalIsLoading = false
}: ScheduleInterviewModalProps) => {
    const [formData, setFormData] = useState<InterviewFormData>({
        title: '',
        type: 'online',
        videoType: 'in-app',
        date: '',
        time: '',
        location: '',
        meetingLink: '',
        notes: ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof InterviewFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isLoading = externalIsLoading || isSubmitting;

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            setIsSubmitting(false);

            if (interviewToReschedule && interviewToReschedule.scheduledDate) {
                const scheduledDate = new Date(interviewToReschedule.scheduledDate);
                setFormData({
                    title: interviewToReschedule.title || '',
                    type: interviewToReschedule.type || 'online',
                    videoType: (interviewToReschedule as { videoType?: 'in-app' | 'external' }).videoType || (interviewToReschedule.meetingLink ? 'external' : 'in-app'),
                    date: scheduledDate.toISOString().split('T')[0] || '',
                    time: scheduledDate.toTimeString().slice(0, 5) || '',
                    location: interviewToReschedule.location || '',
                    meetingLink: interviewToReschedule.meetingLink || '',
                    notes: ''
                });
            } else {
                setFormData({
                    title: '',
                    type: 'online',
                    videoType: 'in-app',
                    date: '',
                    time: '',
                    location: '',
                    meetingLink: '',
                    notes: ''
                });
            }
        }
    }, [interviewToReschedule, isOpen]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof InterviewFormData, string>> = {};
        let isValid = true;

        if (!formData.title.trim()) {
            newErrors.title = 'Interview title is required';
            isValid = false;
        }

        if (!formData.date) {
            newErrors.date = 'Date is required';
            isValid = false;
        }

        if (!formData.time) {
            newErrors.time = 'Time is required';
            isValid = false;
        }

        if (formData.type === 'offline' && !formData.location?.trim()) {
            newErrors.location = 'Location is required for in-person interviews';
            isValid = false;
        }

        if (formData.type === 'online' && formData.videoType === 'external' && !formData.meetingLink?.trim()) {
            newErrors.meetingLink = 'Meeting link is required';
            isValid = false;
        } else if (formData.type === 'online' && formData.videoType === 'external' && formData.meetingLink) {
            // Simple URL validation
            try {
                new URL(formData.meetingLink);
            } catch (e) {
                newErrors.meetingLink = 'Please enter a valid URL';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setIsSubmitting(true);
            await onSchedule(formData, interviewToReschedule?.id);
            onClose();
        } catch (error) {
            console.error('Failed to schedule interview:', error);
            // Optionally handle submission errors here
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof InterviewFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <Calendar className="w-5 h-5 text-primary" />
                        {interviewToReschedule ? 'Reschedule Interview' : 'Schedule Interview'}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        For <span className="font-medium">{candidateName}</span>
                    </p>
                </DialogHeader>

                <div className="py-2 space-y-4">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <Label htmlFor="title" className="text-sm">
                            Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="e.g., Technical Round 1"
                            className={cn("h-9", errors.title && "border-red-500 focus-visible:ring-red-500")}
                        />
                        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                    </div>

                    {/* Interview Type */}
                    <div className="space-y-1.5">
                        <Label className="text-sm">Type</Label>
                        <Select
                            value={formData.type}
                            onValueChange={(val: 'online' | 'offline') => setFormData(prev => ({ ...prev, type: val }))}
                        >
                            <SelectTrigger className="w-full h-9">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="online">
                                    <div className="flex items-center gap-2">
                                        <Video className="h-4 w-4" />
                                        <span>Online</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="offline">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>In-Person</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Online Specific Options */}
                    {formData.type === 'online' && (
                        <div className="space-y-3 p-3 bg-muted/40 rounded-md border border-border/40">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-muted-foreground">Platform</Label>
                                <Select
                                    value={formData.videoType}
                                    onValueChange={(val: 'in-app' | 'external') => {
                                        setFormData(prev => ({ ...prev, videoType: val, meetingLink: '' }));
                                        setErrors(prev => ({ ...prev, meetingLink: undefined }));
                                    }}
                                >
                                    <SelectTrigger className="w-full h-8 text-sm">
                                        <SelectValue placeholder="Select platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="in-app">In-App Video (Recommended)</SelectItem>
                                        <SelectItem value="external">External Link (Zoom, etc.)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.videoType === 'external' && (
                                <div className="space-y-1.5">
                                    <Label htmlFor="meetingLink" className="text-xs font-medium text-muted-foreground">
                                        Meeting URL <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Globe className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                                        <Input
                                            id="meetingLink"
                                            value={formData.meetingLink}
                                            onChange={(e) => handleInputChange('meetingLink', e.target.value)}
                                            placeholder="https://..."
                                            className={cn("pl-8 h-8 text-sm", errors.meetingLink && "border-red-500 focus-visible:ring-red-500")}
                                        />
                                    </div>
                                    {errors.meetingLink && <p className="text-xs text-red-500">{errors.meetingLink}</p>}
                                </div>
                            )}

                            {formData.videoType === 'in-app' && (
                                <p className="text-xs text-muted-foreground px-1">
                                    Secure P2P video room will be created automatically.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Offline Specific Options */}
                    {formData.type === 'offline' && (
                        <div className="space-y-1.5">
                            <Label htmlFor="location" className="text-sm">
                                Address <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    placeholder="Conference Room A"
                                    className={cn("pl-9 h-9", errors.location && "border-red-500 focus-visible:ring-red-500")}
                                />
                            </div>
                            {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
                        </div>
                    )}

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="date" className="text-sm">
                                Date <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className={cn("h-9", errors.date && "border-red-500 focus-visible:ring-red-500")}
                            />
                            {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="time" className="text-sm">
                                Time <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="time"
                                type="time"
                                value={formData.time}
                                onChange={(e) => handleInputChange('time', e.target.value)}
                                className={cn("h-9", errors.time && "border-red-500 focus-visible:ring-red-500")}
                            />
                            {errors.time && <p className="text-xs text-red-500">{errors.time}</p>}
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-2">
                    <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-[#4640DE] hover:bg-[#3730A3]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                {interviewToReschedule ? 'Saving...' : 'Scheduling...'}
                            </>
                        ) : (
                            interviewToReschedule ? 'Reschedule' : 'Schedule'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
