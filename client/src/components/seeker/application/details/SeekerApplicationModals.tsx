
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import { TaskSubmissionModal } from '@/components/seeker/TaskSubmissionModal';
import type { ExtendedATSOfferDocument, ExtendedATSTechnicalTask } from '@/interfaces/seeker/application-details.types';

interface SeekerApplicationModalsProps {

    selectedTask: ExtendedATSTechnicalTask | null;
    showSubmissionModal: boolean;
    setShowSubmissionModal: (show: boolean) => void;
    setSelectedTask: (task: ExtendedATSTechnicalTask | null) => void;
    onSubmitTask: (data: Record<string, unknown>) => Promise<void>;

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
    onDeclineConfirm: (reason: string) => Promise<void>;
}

export const SeekerApplicationModals: React.FC<SeekerApplicationModalsProps> = ({
    selectedTask,
    showSubmissionModal,
    setShowSubmissionModal,
    setSelectedTask,
    onSubmitTask,

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
    const [declineReason, setDeclineReason] = React.useState('');
    const [otherDeclineReason, setOtherDeclineReason] = React.useState('');

    return (
        <>
            { }
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

            { }
            {showDeclineConfirmDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold text-[#1f2937] mb-2">Decline Offer</h3>
                        <p className="text-[14px] text-[#6b7280] mb-4">
                            Are you sure you want to decline this offer? Please provide a reason below.
                        </p>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Reason for Declining <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4640de]"
                                    value={declineReason}
                                    onChange={(e) => setDeclineReason(e.target.value)}
                                >
                                    <option value="">Select a reason</option>
                                    <option value="Better offer from another company">Better offer from another company</option>
                                    <option value="Salary not meeting expectations">Salary not meeting expectations</option>
                                    <option value="Role responsibilities different than expected">Role responsibilities different than expected</option>
                                    <option value="Personal / Family reasons">Personal / Family reasons</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {declineReason === 'Other' && (
                                <div>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4640de]"
                                        placeholder="Please specify your reason..."
                                        rows={3}
                                        value={otherDeclineReason}
                                        onChange={(e) => setOtherDeclineReason(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowDeclineConfirmDialog(false);
                                    setOfferToDecline(null);
                                    setDeclineReason('');
                                    setOtherDeclineReason('');
                                }}
                                disabled={declining}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    const finalReason = declineReason === 'Other' ? otherDeclineReason : declineReason;
                                    if (!finalReason) {
                                        toast.error('Please provide a reason');
                                        return;
                                    }
                                    onDeclineConfirm(finalReason);
                                }}
                                disabled={declining || !declineReason || (declineReason === 'Other' && !otherDeclineReason)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {declining ? 'Declining...' : 'Decline Offer'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
