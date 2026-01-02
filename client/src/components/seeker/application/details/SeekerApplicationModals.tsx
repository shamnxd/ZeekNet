
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import { TaskSubmissionModal } from '@/components/seeker/TaskSubmissionModal';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import type { ExtendedATSOfferDocument, ExtendedATSTechnicalTask } from '@/interfaces/seeker/application-details.types';

interface SeekerApplicationModalsProps {
    
    selectedTask: ExtendedATSTechnicalTask | null;
    showSubmissionModal: boolean;
    setShowSubmissionModal: (show: boolean) => void;
    setSelectedTask: (task: ExtendedATSTechnicalTask | null) => void;
    onSubmitTask: (data: Record<string, unknown>) => Promise<void>;

    
    showRescheduleInterviewModal: boolean;
    setShowRescheduleInterviewModal: (show: boolean) => void;

    
    showRescheduleMeetingModal: boolean;
    setShowRescheduleMeetingModal: (show: boolean) => void;

    
    showSignedDocumentModal: boolean;
    setShowSignedDocumentModal: (show: boolean) => void;
    selectedOffer: ExtendedATSOfferDocument | null;
    setSelectedOffer: (offer: ExtendedATSOfferDocument | null) => void;
    selectedFile: File | null;
    setSelectedFile: (file: File | null) => void;
    uploading: boolean;
    onUploadSigned: () => Promise<void>;

    
    showDeclineConfirmDialog: boolean;
    setShowDeclineConfirmDialog: (show: boolean) => void;
    setOfferToDecline: (offer: { applicationId: string; offerId: string } | null) => void;
    declining: boolean;
    onDeclineConfirm: () => Promise<void>;
}

export const SeekerApplicationModals: React.FC<SeekerApplicationModalsProps> = ({
    selectedTask,
    showSubmissionModal,
    setShowSubmissionModal,
    setSelectedTask,
    onSubmitTask,

    showRescheduleInterviewModal,
    setShowRescheduleInterviewModal,

    showRescheduleMeetingModal,
    setShowRescheduleMeetingModal,

    showSignedDocumentModal,
    setShowSignedDocumentModal,
    selectedOffer,
    setSelectedOffer,
    selectedFile,
    setSelectedFile,
    uploading,
    onUploadSigned,

    showDeclineConfirmDialog,
    setShowDeclineConfirmDialog,
    setOfferToDecline,
    declining,
    onDeclineConfirm,
}) => {
    return (
        <>
            {}
            {selectedTask && (
                <TaskSubmissionModal
                    open={showSubmissionModal}
                    onClose={() => {
                        setShowSubmissionModal(false);
                        setSelectedTask(null);
                    }}
                    onSubmit={onSubmitTask}
                    taskTitle={selectedTask.title || 'Technical Task'}
                />
            )}

            {}
            {showRescheduleInterviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold text-[#1f2937] mb-4">Request to Reschedule Interview</h3>
                        <p className="text-[14px] text-[#6b7280] mb-6">
                            This feature will be available soon. You can contact the recruiter directly to request a reschedule.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowRescheduleInterviewModal(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {}
            {showRescheduleMeetingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold text-[#1f2937] mb-4">Reschedule Meeting</h3>
                        <p className="text-[14px] text-[#6b7280] mb-6">
                            This feature will be available soon. You can contact the recruiter directly to reschedule the meeting.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowRescheduleMeetingModal(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {}
            {showSignedDocumentModal && selectedOffer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold text-[#1f2937] mb-2">Accept Offer - Upload Signed Document</h3>
                        <p className="text-[14px] text-[#6b7280] mb-1">
                            To accept this offer, you must upload the signed offer letter document.
                        </p>
                        <p className="text-[13px] text-red-600 mb-6 font-medium">
                            * Signed document is required
                        </p>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            id="signed-document-upload"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const allowedExtensions = ['.pdf', '.doc', '.docx'];
                                const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
                                if (!allowedExtensions.includes(fileExtension)) {
                                    toast.error('Please upload a PDF, DOC, or DOCX file');
                                    return;
                                }

                                if (file.size > 10 * 1024 * 1024) {
                                    toast.error('File size must be less than 10MB');
                                    return;
                                }

                                setSelectedFile(file);
                            }}
                        />
                        <div className="space-y-4">
                            {!selectedFile ? (
                                <label
                                    htmlFor="signed-document-upload"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#e5e7eb] rounded-lg cursor-pointer hover:border-[#4640de] transition-colors"
                                >
                                    <Upload className="h-8 w-8 text-[#6b7280] mb-2" />
                                    <p className="text-sm text-[#6b7280]">Click to upload or drag and drop</p>
                                    <p className="text-xs text-[#9ca3af] mt-1">PDF, DOC, DOCX (Max 10MB)</p>
                                </label>
                            ) : (
                                <div className="border border-[#e5e7eb] rounded-lg p-4 flex items-center justify-between bg-[#f9fafb]">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-[#4640de]" />
                                        <div>
                                            <p className="text-sm font-medium text-[#1f2937]">{selectedFile.name}</p>
                                            <p className="text-xs text-[#6b7280]">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedFile(null);
                                            const input = document.getElementById('signed-document-upload') as HTMLInputElement;
                                            if (input) input.value = '';
                                        }}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            <div className="flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowSignedDocumentModal(false);
                                        setSelectedOffer(null);
                                        setSelectedFile(null);
                                        const input = document.getElementById('signed-document-upload') as HTMLInputElement;
                                        if (input) input.value = '';
                                    }}
                                    disabled={uploading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={onUploadSigned}
                                    disabled={!selectedFile || uploading}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    {uploading ? 'Uploading...' : 'Accept Offer & Upload'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {}
            <ConfirmationDialog
                isOpen={showDeclineConfirmDialog}
                onClose={() => {
                    setShowDeclineConfirmDialog(false);
                    setOfferToDecline(null);
                }}
                onConfirm={onDeclineConfirm}
                title="Decline Offer"
                description="Are you sure you want to decline this offer? This action cannot be undone."
                confirmText="Decline Offer"
                cancelText="Cancel"
                variant="danger"
                isLoading={declining}
            />
        </>
    );
};
