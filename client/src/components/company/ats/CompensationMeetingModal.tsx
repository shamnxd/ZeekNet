import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Video, MapPin, Phone, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompensationMeeting {
    id?: string;
    type?: 'call' | 'online' | 'in-person';
    videoType?: 'in-app' | 'external';
    scheduledDate?: string;
    location?: string;
    meetingLink?: string;
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
    videoType?: 'in-app' | 'external';
    date: string;
    time: string;
    location?: string;
    meetingLink?: string;
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
        videoType: 'in-app',
        date: new Date().toISOString().split('T')[0],
        time: '',
        location: '',
        meetingLink: ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CompensationMeetingData, string>>>({});

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            if (meetingToEdit) {
                let scheduledDate: Date;
                if (meetingToEdit.scheduledDate) {
                    scheduledDate = new Date(meetingToEdit.scheduledDate);

                    const year = scheduledDate.getFullYear();
                    const month = String(scheduledDate.getMonth() + 1).padStart(2, '0');
                    const day = String(scheduledDate.getDate()).padStart(2, '0');
                    const hours = String(scheduledDate.getHours()).padStart(2, '0');
                    const minutes = String(scheduledDate.getMinutes()).padStart(2, '0');

                    setFormData({
                        type: (meetingToEdit.type || 'call') as 'call' | 'online' | 'in-person',
                        videoType: meetingToEdit.videoType || (meetingToEdit.meetingLink ? 'external' : 'in-app'),
                        date: `${year}-${month}-${day}`,
                        time: `${hours}:${minutes}`,
                        location: meetingToEdit.location || '',
                        meetingLink: meetingToEdit.meetingLink || ''
                    });
                } else {
                    setFormData({
                        type: (meetingToEdit.type || 'call') as 'call' | 'online' | 'in-person',
                        videoType: meetingToEdit.videoType || (meetingToEdit.meetingLink ? 'external' : 'in-app'),
                        date: new Date().toISOString().split('T')[0],
                        time: '',
                        location: meetingToEdit.location || '',
                        meetingLink: meetingToEdit.meetingLink || ''
                    });
                }
            } else {
                setFormData({
                    type: 'call',
                    videoType: 'in-app',
                    date: new Date().toISOString().split('T')[0],
                    time: '',
                    location: '',
                    meetingLink: ''
                });
            }
        }
    }, [isOpen, meetingToEdit]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof CompensationMeetingData, string>> = {};
        let isValid = true;

        if (!formData.date) {
            newErrors.date = 'Date is required';
            isValid = false;
        }

        if (!formData.time) {
            newErrors.time = 'Time is required';
            isValid = false;
        }

        if (formData.type === 'in-person' && !formData.location?.trim()) {
            newErrors.location = 'Location is required for in-person meetings';
            isValid = false;
        }

        if (formData.type === 'online' && formData.videoType === 'external' && !formData.meetingLink?.trim()) {
            newErrors.meetingLink = 'Meeting link is required';
            isValid = false;
        } else if (formData.type === 'online' && formData.videoType === 'external' && formData.meetingLink) {
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

    const handleInputChange = (field: keyof CompensationMeetingData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        onSchedule(formData);
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            type: 'call',
            videoType: 'in-app',
            date: new Date().toISOString().split('T')[0],
            time: '',
            location: '',
            meetingLink: ''
        });
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold">
                                {meetingToEdit ? 'Update Compensation Meeting' : 'Schedule Compensation Meeting'}
                            </DialogTitle>
                            <DialogDescription>
                                For <span className="font-medium text-foreground">{candidateName}</span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {/* Meeting Type */}
                    <div className="space-y-1.5">
                        <Label>Meeting Type <span className="text-destructive">*</span></Label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'call', label: 'Call', icon: Phone },
                                { id: 'online', label: 'Online', icon: Video },
                                { id: 'in-person', label: 'In-person', icon: MapPin }
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => handleInputChange('type', type.id as any)}
                                    className={cn(
                                        "flex items-center justify-center gap-2 p-2.5 rounded-lg border-2 transition-all",
                                        formData.type === type.id
                                            ? "border-[#4640DE] bg-[#4640DE]/5 text-[#4640DE]"
                                            : "border-border hover:border-muted-foreground/30 text-muted-foreground"
                                    )}
                                >
                                    <type.icon className="w-4 h-4" />
                                    <span className="text-xs font-semibold">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="date">Date <span className="text-destructive">*</span></Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                                className={cn(errors.date && "border-destructive focus-visible:ring-destructive")}
                                min={new Date().toISOString().split('T')[0]}
                            />
                            {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="time">Time <span className="text-destructive">*</span></Label>
                            <Input
                                id="time"
                                type="time"
                                value={formData.time}
                                onChange={(e) => handleInputChange('time', e.target.value)}
                                className={cn(errors.time && "border-destructive focus-visible:ring-destructive")}
                            />
                            {errors.time && <p className="text-xs text-destructive">{errors.time}</p>}
                        </div>
                    </div>

                    {/* Online Options */}
                    {formData.type === 'online' && (
                        <div className="space-y-3 p-3 bg-muted/40 rounded-lg border border-border/60">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Video Platform</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleInputChange('videoType', 'in-app');
                                            handleInputChange('meetingLink', '');
                                        }}
                                        className={cn(
                                            "flex items-center justify-center gap-2 p-2 rounded-md border transition-all text-xs",
                                            formData.videoType === 'in-app'
                                                ? "border-[#4640DE] bg-white text-[#4640DE] shadow-sm"
                                                : "bg-transparent border-transparent text-muted-foreground hover:bg-muted"
                                        )}
                                    >
                                        In-App Video
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleInputChange('videoType', 'external')}
                                        className={cn(
                                            "flex items-center justify-center gap-2 p-2 rounded-md border transition-all text-xs",
                                            formData.videoType === 'external'
                                                ? "border-[#4640DE] bg-white text-[#4640DE] shadow-sm"
                                                : "bg-transparent border-transparent text-muted-foreground hover:bg-muted"
                                        )}
                                    >
                                        External Link
                                    </button>
                                </div>
                            </div>

                            {formData.videoType === 'in-app' && (
                                <p className="text-[11px] text-muted-foreground">
                                    A secure meeting room will be automatically created using our in-app P2P video service.
                                </p>
                            )}

                            {formData.videoType === 'external' && (
                                <div className="space-y-1.5">
                                    <Label htmlFor="meetingLink" className="text-xs font-semibold">Meeting URL <span className="text-destructive">*</span></Label>
                                    <div className="relative">
                                        <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="meetingLink"
                                            placeholder="https://zoom.us/j/..."
                                            value={formData.meetingLink}
                                            onChange={(e) => handleInputChange('meetingLink', e.target.value)}
                                            className={cn("pl-9 h-9 text-sm", errors.meetingLink && "border-destructive focus-visible:ring-destructive")}
                                        />
                                    </div>
                                    {errors.meetingLink && <p className="text-xs text-destructive">{errors.meetingLink}</p>}
                                </div>
                            )}
                        </div>
                    )}

                    {/* In-Person Options */}
                    {formData.type === 'in-person' && (
                        <div className="space-y-1.5">
                            <Label htmlFor="location">Meeting Location <span className="text-destructive">*</span></Label>
                            <div className="relative">
                                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="location"
                                    placeholder="e.g. Conference Room B"
                                    value={formData.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    className={cn("pl-9", errors.location && "border-destructive focus-visible:ring-destructive")}
                                />
                            </div>
                            {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
                        </div>
                    )}

                    <DialogFooter className="pt-4 gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#4640DE] hover:bg-[#3730A3]"
                        >
                            {meetingToEdit ? 'Update Meeting' : 'Schedule Meeting'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
