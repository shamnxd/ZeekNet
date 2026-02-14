import { Button } from "@/components/ui/button";
import {
    FileText,
    CheckCircle,
    UserCheck,
    File as FileIcon,
    Download,
    MessageSquare,
    Plus,
    AlertTriangle,
    XCircle,
    Loader2,
} from "lucide-react";
import type { JobPostingResponse } from "@/interfaces/job/job-posting-response.interface";
import type { ATSComment } from "@/types/ats";
import { formatATSStage, formatATSSubStage } from "@/utils/formatters";
import {
    ATSStage,
    OfferSubStage,
    STAGE_SUB_STAGES,
} from "@/constants/ats-stages";
import type { ExtendedATSOfferDocument } from "./CandidateProfileTypes";

interface CandidateOfferStageProps {
    atsJob: JobPostingResponse | null;
    selectedStage: string;
    currentOffer: ExtendedATSOfferDocument | null;
    offerDocuments: ExtendedATSOfferDocument[];
    comments: ATSComment[];
    onSetShowCreateOfferModal: (show: boolean) => void;
    onSetShowCommentModal: (show: boolean) => void;
    onSetShowWithdrawOfferModal: (show: boolean) => void;
    onSetShowRejectConfirmDialog?: (show: boolean) => void;

    onMarkAsHired: () => Promise<void>;
    formatDateTime: (dateString: string) => string;
    isCurrentStage: (stage: string) => boolean;
    isUpdating?: boolean;
}

export const CandidateOfferStage = ({
    atsJob,
    selectedStage,
    currentOffer,
    offerDocuments,
    comments,
    onSetShowCreateOfferModal,
    onSetShowCommentModal,
    onSetShowWithdrawOfferModal,
    onSetShowRejectConfirmDialog,

    onMarkAsHired,
    formatDateTime,
    isCurrentStage,
    isUpdating = false,
}: CandidateOfferStageProps) => {
    const showActions = isCurrentStage(selectedStage);


    // Derive sub-stage from offer data with explicit typing
    const offer = currentOffer || offerDocuments[0] || null;
    let currentSubStage: OfferSubStage = OfferSubStage.NOT_SENT;
    if (offer) {
        if (offer.status === 'signed') {
            currentSubStage = OfferSubStage.OFFER_ACCEPTED;
        } else if (offer.status === 'declined') {
            currentSubStage = OfferSubStage.OFFER_DECLINED;
        } else if (offer.status === 'sent') {
            currentSubStage = OfferSubStage.OFFER_SENT;
        }
    }

    const subStages = STAGE_SUB_STAGES[ATSStage.OFFER] || [];
    const offerAmount = offer?.offerAmount || "";
    const sentAt = offer?.sentAt || offer?.createdAt;
    const acceptedAt = offer?.signedAt;
    const declinedAt = offer?.declinedAt;
    const declineReason = offer?.withdrawalReason || offer?.declineReason || "";

    const jobTitle = atsJob?.title || "N/A";

    return (
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Offer Stage
                    </h3>
                    <div className="flex gap-1 mt-2">
                    </div>
                </div>

            </div>

            {/* Offer Summary Section */}
            <div className="bg-white rounded-lg p-6 border">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Offer Summary
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="text-sm font-medium text-gray-900">
                            {subStages.find(s => s.key === currentSubStage)?.label || (currentSubStage as string)}
                        </p>
                    </div>
                    {currentSubStage !== OfferSubStage.NOT_SENT && offerAmount && (
                        <div>
                            <p className="text-sm text-gray-600">Offer Value</p>
                            <p className="text-sm font-medium text-green-700">
                                {offerAmount}
                            </p>
                        </div>
                    )}
                    {currentSubStage === OfferSubStage.OFFER_ACCEPTED && acceptedAt && (
                        <div>
                            <p className="text-sm text-gray-600">Accepted On</p>
                            <p className="text-sm font-medium text-gray-900">
                                {formatDateTime(acceptedAt)}
                            </p>
                        </div>
                    )}
                    {currentSubStage === OfferSubStage.OFFER_DECLINED && declinedAt && (
                        <div>
                            <p className="text-sm text-gray-600">Declined On</p>
                            <p className="text-sm font-medium text-gray-900">
                                {formatDateTime(declinedAt)}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* NOT_SENT State */}
            {currentSubStage === OfferSubStage.NOT_SENT && (
                <div className="bg-white rounded-lg p-6 border text-center">
                    <p className="text-gray-600 mb-4">Offer letter has not been prepared yet.</p>
                    {showActions && (
                        <div className="flex justify-center gap-3">
                            <Button
                                onClick={() => onSetShowCreateOfferModal(true)}
                                className="bg-[#4640DE] hover:bg-[#3730A3]"
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Create & Prepare Offer
                            </Button>
                            <Button
                                onClick={onMarkAsHired}
                                className="bg-green-600 hover:bg-green-700 text-white gap-2"
                                disabled={isUpdating}
                            >
                                <UserCheck className="h-4 w-4" />
                                Mark as Hired
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* OFFER_SENT State */}
            {currentSubStage === OfferSubStage.OFFER_SENT && offer && (
                <div className="bg-white rounded-lg p-6 border space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Job Title</p>
                            <p className="text-sm font-medium text-gray-900">{jobTitle}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Sent On</p>
                            <p className="text-sm font-medium text-gray-900">
                                {sentAt ? formatDateTime(sentAt) : "Recently"}
                            </p>
                        </div>
                    </div>
                    {showActions && (
                        <div className="flex gap-2 pt-4 border-t">
                            <Button
                                onClick={onMarkAsHired}
                                className="bg-green-600 hover:bg-green-700 text-white gap-2"
                                disabled={isUpdating}
                            >
                                <UserCheck className="h-4 w-4" />
                                Mark as Hired
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => onSetShowRejectConfirmDialog?.(true)}
                                className="text-red-600 hover:text-red-700 border-red-200 gap-2"
                            >
                                <XCircle className="h-4 w-4" />
                                Reject candidate
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* OFFER_ACCEPTED State */}
            {currentSubStage === OfferSubStage.OFFER_ACCEPTED && offer && (
                <div className="bg-white rounded-lg p-6 border space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Offer Accepted
                    </h4>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm font-medium text-green-900 mb-1">
                            Candidate has signed and accepted the offer.
                        </p>
                        {acceptedAt && (
                            <p className="text-xs text-green-700">
                                Confirmed on {formatDateTime(acceptedAt)}
                            </p>
                        )}
                    </div>
                    {showActions && (
                        <div className="pt-4 border-t">
                            <Button
                                onClick={onMarkAsHired}
                                className="bg-green-600 hover:bg-green-700 text-white gap-2"
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <UserCheck className="h-4 w-4" />
                                )}
                                Mark as Hired
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* OFFER_DECLINED State */}
            {currentSubStage === OfferSubStage.OFFER_DECLINED && offer && (
                <div className="bg-white rounded-lg p-6 border border-red-200 space-y-4">
                    <h4 className="font-semibold text-red-900 flex items-center gap-2">
                        <XCircle className="h-5 w-5" />
                        Offer Declined
                    </h4>
                    <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                        <p className="text-sm text-red-800 font-medium">Decline / Withdrawal Reason:</p>
                        <p className="text-sm text-red-700 mt-1">{declineReason || "No reason provided"}</p>
                    </div>
                    {showActions && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t">
                            <Button
                                onClick={() => onSetShowCreateOfferModal(true)}
                                className="bg-[#4640DE] hover:bg-[#3730A3] gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Create New Offer
                            </Button>
                            <Button
                                onClick={onMarkAsHired}
                                className="bg-green-600 hover:bg-green-700 text-white gap-2"
                                disabled={isUpdating}
                            >
                                <UserCheck className="h-4 w-4" />
                                Mark as Hired
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => onSetShowRejectConfirmDialog?.(true)}
                                className="text-red-600 hover:text-red-700 border-red-200 gap-2"
                            >
                                <XCircle className="h-4 w-4" />
                                Reject Candidate
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Offer Documents Section */}
            {currentSubStage !== OfferSubStage.NOT_SENT && offer && (
                <div className="bg-white rounded-lg p-6 border">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FileIcon className="h-5 w-5 text-green-600" />
                        Documents
                    </h4>
                    <div className="space-y-4">
                        {offer.documentUrl && (
                            <div className="border rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileIcon className="h-5 w-5 text-[#4640DE]" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {offer.documentFilename || "Offer Letter"}
                                        </p>
                                        <p className="text-xs text-gray-500">Sent Document</p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(offer.documentUrl as string, "_blank")}
                                    className="gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Download
                                </Button>
                            </div>
                        )}

                        {offer.signedDocumentUrl && (
                            <div className="border-2 border-green-200 rounded-lg p-4 flex items-center justify-between bg-green-50">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {offer.signedDocumentFilename || "Signed Offer"}
                                        </p>
                                        <p className="text-xs text-green-700">Signed Document</p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(offer.signedDocumentUrl as string, "_blank")}
                                    className="gap-2 border-green-300 text-green-700 hover:bg-green-100"
                                >
                                    <Download className="h-4 w-4" />
                                    Download
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Activity & Notes Section */}
            <div className="bg-white rounded-lg p-6 border">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-green-600" />
                        Internal Notes
                    </h4>
                    {showActions && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onSetShowCommentModal(true)}
                            className="gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Note
                        </Button>
                    )}
                </div>
                {comments.filter((c) => c.stage === ATSStage.OFFER).length > 0 ? (
                    <div className="space-y-3">
                        {comments
                            .filter((c) => c.stage === ATSStage.OFFER)
                            .map((comment, idx) => (
                                <div key={idx} className="border rounded-lg p-4">
                                    <p className="text-sm text-gray-700">{comment.comment}</p>
                                    <p className="text-xs text-blue-600 font-medium mt-1">
                                        {formatATSStage(comment.stage)} {comment.subStage ? `• ${formatATSSubStage(comment.subStage)}` : ''}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {formatDateTime(comment.createdAt || "")}
                                    </p>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 italic">No notes yet</p>
                )}
            </div>

            {/* Danger Zone */}
            {showActions && (currentSubStage === OfferSubStage.OFFER_SENT || currentSubStage === OfferSubStage.OFFER_ACCEPTED) && (
                <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Withdraw Offer
                    </h4>
                    <p className="text-sm text-red-700 mb-4">
                        Withdrawing the offer will notify the candidate and reset this stage.
                    </p>
                    <Button
                        variant="destructive"
                        onClick={() => onSetShowWithdrawOfferModal(true)}
                    >
                        Withdraw Offer
                    </Button>
                </div>
            )}
        </div>
    );
};
