
import React from 'react';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import type { ApplicationDetails as ApplicationDetailsData } from '@/interfaces/application/application-details.interface';

export interface ScheduleForm {
    date: string;
    time: string;
    location: string;
    interviewType: string;
    notes: string;
}

export interface RatingForm {
    rating: number;
}

export interface FeedbackForm {
    feedback: string;
}

export interface MessageForm {
    subject: string;
    message: string;
}

interface ApplicationModalsProps {
    application: ApplicationDetailsData | null;

    
    scheduleInterviewOpen: boolean; setScheduleInterviewOpen: (open: boolean) => void;
    giveRatingOpen: boolean; setGiveRatingOpen: (open: boolean) => void;
    addScheduleOpen: boolean; setAddScheduleOpen: (open: boolean) => void;
    editScheduleOpen: boolean; setEditScheduleOpen: (open: boolean) => void;
    addFeedbackOpen: boolean; setAddFeedbackOpen: (open: boolean) => void;
    moveToNextStepOpen: boolean; setMoveToNextStepOpen: (open: boolean) => void;
    hireRejectDialogOpen: boolean; setHireRejectDialogOpen: (open: boolean) => void;
    rejectApplicationOpen: boolean; setRejectApplicationOpen: (open: boolean) => void;
    sendMessageOpen: boolean; setSendMessageOpen: (open: boolean) => void;

    
    scheduleForm: ScheduleForm; setScheduleForm: (form: ScheduleForm) => void;
    ratingForm: RatingForm; setRatingForm: (form: RatingForm) => void;
    feedbackForm: FeedbackForm; setFeedbackForm: (form: FeedbackForm) => void;
    rejectReason: string; setRejectReason: (reason: string) => void;
    messageForm: MessageForm; setMessageForm: (form: MessageForm) => void;

    
    handleScheduleInterview: () => void;
    handleGiveRating: () => void;
    handleAddSchedule: (moveToInterview?: boolean) => void;
    handleUpdateSchedule: () => void;
    handleAddFeedback: () => void;
    handleMoveToNextStepConfirm: () => void;
    handleHire: () => void;
    handleRejectApplication: () => void;
    handleSendMessage: () => void;
}

export const ApplicationModals: React.FC<ApplicationModalsProps> = ({
    application,
    scheduleInterviewOpen, setScheduleInterviewOpen,
    giveRatingOpen, setGiveRatingOpen,
    addScheduleOpen, setAddScheduleOpen,
    editScheduleOpen, setEditScheduleOpen,
    addFeedbackOpen, setAddFeedbackOpen,
    moveToNextStepOpen, setMoveToNextStepOpen,
    hireRejectDialogOpen, setHireRejectDialogOpen,
    rejectApplicationOpen, setRejectApplicationOpen,
    sendMessageOpen, setSendMessageOpen,
    scheduleForm, setScheduleForm,
    ratingForm, setRatingForm,
    feedbackForm, setFeedbackForm,
    rejectReason, setRejectReason,
    messageForm, setMessageForm,
    handleScheduleInterview,
    handleGiveRating,
    handleAddSchedule,
    handleUpdateSchedule,
    handleAddFeedback,
    handleMoveToNextStepConfirm,
    handleHire,
    handleRejectApplication,
    handleSendMessage,
}) => {
    return (
        <>
            {}
            <Dialog open={scheduleInterviewOpen} onOpenChange={setScheduleInterviewOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Schedule Interview</DialogTitle>
                        <DialogDescription>
                            Schedule an interview for {application?.seeker_name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Interview Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={scheduleForm.date}
                                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time</Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={scheduleForm.time}
                                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={scheduleForm.location}
                                onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                                placeholder="Enter interview location"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="interviewType">Interview Type</Label>
                                <Select value={scheduleForm.interviewType} onValueChange={(value) => setScheduleForm({ ...scheduleForm, interviewType: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="phone">Phone Interview</SelectItem>
                                        <SelectItem value="video">Video Interview</SelectItem>
                                        <SelectItem value="onsite">On-site Interview</SelectItem>
                                        <SelectItem value="written">Written Test</SelectItem>
                                        <SelectItem value="skill">Skill Test</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={scheduleForm.notes}
                                onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                                placeholder="Additional notes (optional)"
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setScheduleInterviewOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleScheduleInterview} className="bg-[#4640DE] hover:bg-[#4640DE]/90">
                            Schedule Interview
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {}
            <Dialog open={giveRatingOpen} onOpenChange={setGiveRatingOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Give Rating</DialogTitle>
                        <DialogDescription>
                            Rate the applicant's performance
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="rating" className="text-center block">Rating</Label>
                            <div className="flex items-center justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRatingForm({ rating: star })}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-10 h-10 ${star <= ratingForm.rating
                                                ? 'text-[#FFB836] fill-[#FFB836]'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {ratingForm.rating > 0 && (
                                <p className="text-center text-sm text-[#7C8493] mt-2">
                                    {ratingForm.rating} out of 5 stars
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setGiveRatingOpen(false)
                            setRatingForm({ rating: 0 })
                        }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleGiveRating}
                            className="bg-[#4640DE] hover:bg-[#4640DE]/90"
                            disabled={ratingForm.rating === 0}
                        >
                            Submit Rating
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Schedule Interview Modal */}
            <Dialog open={addScheduleOpen} onOpenChange={setAddScheduleOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add Schedule Interview</DialogTitle>
                        <DialogDescription>
                            Schedule a new interview for {application?.seeker_name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="scheduleDate">Interview Date</Label>
                                <Input
                                    id="scheduleDate"
                                    type="date"
                                    value={scheduleForm.date}
                                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="scheduleTime">Time</Label>
                                <Input
                                    id="scheduleTime"
                                    type="time"
                                    value={scheduleForm.time}
                                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="scheduleLocation">Location</Label>
                            <Input
                                id="scheduleLocation"
                                value={scheduleForm.location}
                                onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                                placeholder="Enter interview location"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="scheduleType">Interview Type</Label>
                                <Select value={scheduleForm.interviewType} onValueChange={(value) => setScheduleForm({ ...scheduleForm, interviewType: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="phone">Phone Interview</SelectItem>
                                        <SelectItem value="video">Video Interview</SelectItem>
                                        <SelectItem value="onsite">On-site Interview</SelectItem>
                                        <SelectItem value="written">Written Test</SelectItem>
                                        <SelectItem value="skill">Skill Test</SelectItem>
                                        <SelectItem value="final">Final Test</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="scheduleNotes">Notes</Label>
                            <Textarea
                                id="scheduleNotes"
                                value={scheduleForm.notes}
                                onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                                placeholder="Additional notes (optional)"
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddScheduleOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => handleAddSchedule(application?.stage === 'shortlisted')}
                            className="bg-[#4640DE] hover:bg-[#4640DE]/90"
                        >
                            {application?.stage === 'shortlisted' ? 'Schedule & Move to Interview' : 'Add Schedule'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {}
            <Dialog open={editScheduleOpen} onOpenChange={setEditScheduleOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Interview Schedule</DialogTitle>
                        <DialogDescription>
                            Update interview details
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="editDate">Interview Date</Label>
                                <Input
                                    id="editDate"
                                    type="date"
                                    value={scheduleForm.date}
                                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="editTime">Time</Label>
                                <Input
                                    id="editTime"
                                    type="time"
                                    value={scheduleForm.time}
                                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editLocation">Location</Label>
                            <Input
                                id="editLocation"
                                value={scheduleForm.location}
                                onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                                placeholder="Enter interview location"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="editType">Interview Type</Label>
                                <Select value={scheduleForm.interviewType} onValueChange={(value) => setScheduleForm({ ...scheduleForm, interviewType: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="phone">Phone Interview</SelectItem>
                                        <SelectItem value="video">Video Interview</SelectItem>
                                        <SelectItem value="onsite">On-site Interview</SelectItem>
                                        <SelectItem value="written">Written Test</SelectItem>
                                        <SelectItem value="skill">Skill Test</SelectItem>
                                        <SelectItem value="final">Final Test</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditScheduleOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateSchedule} className="bg-[#4640DE] hover:bg-[#4640DE]/90">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {}
            <Dialog open={addFeedbackOpen} onOpenChange={setAddFeedbackOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Feedback</DialogTitle>
                        <DialogDescription>
                            Add feedback for this interview
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="feedback">Feedback</Label>
                            <Textarea
                                id="feedback"
                                value={feedbackForm.feedback}
                                onChange={(e) => setFeedbackForm({ feedback: e.target.value })}
                                placeholder="Enter your feedback..."
                                rows={5}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddFeedbackOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddFeedback} className="bg-[#4640DE] hover:bg-[#4640DE]/90">
                            Add Feedback
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {}
            <ConfirmationDialog
                isOpen={moveToNextStepOpen}
                onClose={() => setMoveToNextStepOpen(false)}
                onConfirm={handleMoveToNextStepConfirm}
                title="Move To Next Step"
                description="Are you sure you want to move this application to the next stage?"
                confirmText="Move"
                cancelText="Cancel"
            />

            {}
            <Dialog open={hireRejectDialogOpen} onOpenChange={setHireRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Final Decision</DialogTitle>
                        <DialogDescription>
                            Make your final decision for this application
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-[#7C8493]">
                            Would you like to hire this candidate or reject the application?
                        </p>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setRejectApplicationOpen(true)
                                setHireRejectDialogOpen(false)
                            }}
                        >
                            Reject
                        </Button>
                        <Button
                            onClick={handleHire}
                            className="bg-[#56CDAD] hover:bg-[#56CDAD]/90 text-white"
                        >
                            Hire
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {}
            <Dialog open={rejectApplicationOpen} onOpenChange={setRejectApplicationOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Application</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this application
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="rejectReason">Reason</Label>
                            <Textarea
                                id="rejectReason"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Enter rejection reason..."
                                rows={4}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectApplicationOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRejectApplication}
                            variant="destructive"
                            disabled={!rejectReason.trim()}
                        >
                            Reject Application
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {}
            <Dialog open={sendMessageOpen} onOpenChange={setSendMessageOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Message</DialogTitle>
                        <DialogDescription>
                            Send a message to {application?.seeker_name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                value={messageForm.subject}
                                onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                                placeholder="Message subject"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                value={messageForm.message}
                                onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                                placeholder="Enter your message..."
                                rows={5}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSendMessageOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSendMessage} className="bg-[#4640DE] hover:bg-[#4640DE]/90">
                            Send Message
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
