import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    CheckCircle,
    X,
    Bell,
    UserCheck,
    File as FileIcon,
    Download,
    MessageSquare,
    Plus,
    AlertTriangle,
    XCircle,
} from "lucide-react";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import type { JobPostingResponse } from "@/interfaces/job/job-posting-response.interface";
import type { ATSComment } from "@/types/ats";
import {
    ATSStage,
    OfferSubStage,
    SubStageDisplayNames,
} from "@/constants/ats-stages";
import type { ExtendedATSOfferDocument } from "./CandidateProfileTypes";

interface CandidateOfferStageProps {
    atsApplication: CompanySideApplication | null;
    atsJob: JobPostingResponse | null;
    selectedStage: string;
    currentOffer: ExtendedATSOfferDocument | null;
    offerDocuments: ExtendedATSOfferDocument[];
    comments: ATSComment[];
    onSetShowCreateOfferModal: (show: boolean) => void;
    onSetShowCommentModal: (show: boolean) => void;
    onSetShowWithdrawOfferModal: (show: boolean) => void;
    onSendReminder: () => Promise<void>;
    onMarkAsHired: () => Promise<void>;
    formatDateTime: (dateString: string) => string;
    isCurrentStage: (stage: string) => boolean;
}

export const CandidateOfferStage = ({
    atsApplication,
    atsJob,
    selectedStage,
    currentOffer,
    offerDocuments,
    comments,
    onSetShowCreateOfferModal,
    onSetShowCommentModal,
    onSetShowWithdrawOfferModal,
    onSendReminder,
    onMarkAsHired,
    formatDateTime,
    isCurrentStage,
}: CandidateOfferStageProps) => {
    const showActions = isCurrentStage(selectedStage);
    const currentSubStage = atsApplication?.subStage || OfferSubStage.NOT_SENT;
    const currentSubStageDisplayName =
        SubStageDisplayNames[currentSubStage] || currentSubStage;

    const offer = currentOffer || offerDocuments[0] || null;
    const offerAmount = (offer as ExtendedATSOfferDocument)?.offerAmount || "";
    const sentAt =
        (offer as ExtendedATSOfferDocument)?.sentAt ||
        (offer as ExtendedATSOfferDocument)?.createdAt;
    const acceptedAt = (offer as ExtendedATSOfferDocument)?.signedAt;
    const declinedAt = (offer as ExtendedATSOfferDocument)?.declinedAt;
    const declineReason =
        (offer as ExtendedATSOfferDocument)?.declineReason || "";

    const jobTitle = atsJob?.title || "N/A";
    const employmentType =
        (offer as ExtendedATSOfferDocument)?.employmentType || "full-time";

    return (
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Offer Stage
                </h3>
                {showActions && (
                    <Badge className="bg-green-100 text-green-700 mb-4">
                        Current Sub-stage: {currentSubStageDisplayName}
                    </Badge>
                )}
            </div>

            {/* Offer Summary Section */}
            <div className="bg-white rounded-lg p-6 border">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Offer Summary
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Stage</p>
                        <p className="text-sm font-medium text-gray-900">Offer</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="text-sm font-medium text-gray-900">
                            {currentSubStage === OfferSubStage.NOT_SENT
                                ? "Not Sent"
                                : currentSubStage === OfferSubStage.OFFER_SENT
                                    ? "Offer Sent"
                                    : currentSubStage === OfferSubStage.OFFER_ACCEPTED
                                        ? "Offer Accepted"
                                        : "Offer Declined"}
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
                    <p className="text-gray-600 mb-4">Offer not released yet</p>
                    {showActions && (
                        <Button
                            onClick={() => onSetShowCreateOfferModal(true)}
                            className="bg-[#4640DE] hover:bg-[#3730A3]"
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Create Offer
                        </Button>
                    )}
                </div>
            )}

            {/* OFFER_SENT State */}
            {currentSubStage === OfferSubStage.OFFER_SENT && offer && (
                <div className="bg-white rounded-lg p-6 border space-y-4">
                    <h4 className="font-semibold text-gray-900">Offer Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Job Title</p>
                            <p className="text-sm font-medium text-gray-900">{jobTitle}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Offer Amount</p>
                            <p className="text-sm font-medium text-green-700">
                                {offerAmount}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Employment Type</p>
                            <p className="text-sm font-medium text-gray-900">
                                {employmentType}
                            </p>
                        </div>
                        {sentAt && (
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Sent On</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {formatDateTime(sentAt)}
                                </p>
                            </div>
                        )}
                    </div>
                    {showActions && (
                        <div className="flex gap-2 pt-4 border-t">
                            <Button
                                variant="outline"
                                onClick={onSendReminder}
                                className="gap-2"
                            >
                                <Bell className="h-4 w-4" />
                                Send Reminder
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
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-green-900">
                                Offer Accepted by Candidate
                            </span>
                        </div>
                        {acceptedAt && (
                            <p className="text-xs text-green-700">
                                Accepted on {formatDateTime(acceptedAt)}
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Accepted Offer</p>
                            <p className="text-sm font-medium text-green-700">
                                {offerAmount}
                            </p>
                        </div>
                        {acceptedAt && (
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Accepted Date</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {formatDateTime(acceptedAt)}
                                </p>
                            </div>
                        )}
                    </div>
                    {showActions && (
                        <div className="pt-4 border-t">
                            <Button
                                onClick={onMarkAsHired}
                                className="bg-green-600 hover:bg-green-700 text-white gap-2"
                            >
                                <UserCheck className="h-4 w-4" />
                                Mark as Hired
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* OFFER_DECLINED State */}
            {currentSubStage === OfferSubStage.OFFER_DECLINED && offer && (
                <div className="bg-white rounded-lg p-6 border space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <X className="h-5 w-5 text-red-600" />
                        Offer Declined
                    </h4>
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2 mb-2">
                            <X className="h-5 w-5 text-red-600" />
                            <span className="text-sm font-medium text-red-900">
                                Offer Declined by Candidate
                            </span>
                        </div>
                        {declinedAt && (
                            <p className="text-xs text-red-700">
                                Declined on {formatDateTime(declinedAt)}
                            </p>
                        )}
                        {declineReason && (
                            <p className="text-sm text-red-800 mt-2">{declineReason}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Offer Details Section */}
            {currentSubStage !== OfferSubStage.NOT_SENT && offer && (
                <div className="bg-white rounded-lg p-6 border">
                    <h4 className="font-semibold text-gray-900 mb-4">Offer Details</h4>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Job Title</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {jobTitle}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Employment Type</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {employmentType}
                                </p>
                            </div>
                        </div>
                        {offerAmount && (
                            <div>
                                <p className="text-sm text-gray-600">Offer Amount</p>
                                <p className="text-sm font-medium text-green-700">
                                    {offerAmount}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Offer Documents Section */}
            {currentSubStage !== OfferSubStage.NOT_SENT && offer && (
                <div className="bg-white rounded-lg p-6 border">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FileIcon className="h-5 w-5 text-green-600" />
                        Offer Documents
                    </h4>
                    <div className="space-y-4">
                        {/* Original Offer Document */}
                        {(offer as ExtendedATSOfferDocument).documentUrl &&
                            (offer as ExtendedATSOfferDocument).documentFilename ? (
                            <div className="border rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileIcon className="h-5 w-5 text-[#4640DE]" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {(offer as ExtendedATSOfferDocument).documentFilename}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Original Offer Letter
                                        </p>
                                        {sentAt && (
                                            <p className="text-xs text-gray-500">
                                                Sent on {formatDateTime(sentAt)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        window.open(
                                            (offer as ExtendedATSOfferDocument).documentUrl,
                                            "_blank"
                                        )
                                    }
                                    className="gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Download
                                </Button>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">
                                No offer document uploaded
                            </p>
                        )}

                        {/* Signed Document */}
                        {currentSubStage === OfferSubStage.OFFER_ACCEPTED &&
                            (offer as ExtendedATSOfferDocument).signedDocumentUrl &&
                            (offer as ExtendedATSOfferDocument).signedDocumentFilename && (
                                <div className="border-2 border-green-200 rounded-lg p-4 flex items-center justify-between bg-green-50">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {
                                                    (offer as ExtendedATSOfferDocument)
                                                        .signedDocumentFilename
                                                }
                                            </p>
                                            <p className="text-xs text-green-700 font-medium">
                                                Signed Offer Document
                                            </p>
                                            {acceptedAt && (
                                                <p className="text-xs text-gray-500">
                                                    Signed on {formatDateTime(acceptedAt)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            window.open(
                                                (offer as ExtendedATSOfferDocument).signedDocumentUrl,
                                                "_blank"
                                            )
                                        }
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

            {/* Candidate Response Section */}
            {currentSubStage === OfferSubStage.OFFER_SENT && (
                <div className="bg-white rounded-lg p-6 border">
                    <h4 className="font-semibold text-gray-900 mb-4">
                        Candidate Response
                    </h4>
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-900">
                                Waiting for candidate response
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Activity & Notes Section */}
            <div className="bg-white rounded-lg p-6 border">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-green-600" />
                        Activity & Notes
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
                                    <p className="text-xs text-gray-500 mt-2">
                                        by{" "}
                                        {comment.recruiterName ||
                                            comment.addedByName ||
                                            comment.addedBy ||
                                            "Recruiter"}{" "}
                                        •{" "}
                                        {formatDateTime(
                                            comment.createdAt || comment.timestamp || ""
                                        )}
                                    </p>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 italic">
                        No notes or comments yet
                    </p>
                )}
            </div>

            {/* Actions Section */}
            {showActions && (
                <div className="flex flex-col gap-3">
                    {currentSubStage !== OfferSubStage.OFFER_ACCEPTED &&
                        currentSubStage !== OfferSubStage.OFFER_DECLINED && (
                            <Button
                                variant="outline"
                                className="gap-2"
                                onClick={() => onSetShowCommentModal(true)}
                            >
                                <MessageSquare className="h-4 w-4" />
                                Add Comment
                            </Button>
                        )}
                </div>
            )}

            {/* Danger Zone */}
            {(currentSubStage === OfferSubStage.OFFER_SENT ||
                currentSubStage === OfferSubStage.OFFER_ACCEPTED) && (
                    <div className="bg-white rounded-lg p-6 border-2 border-red-200">
                        <div className="flex items-start gap-3 mb-4">
                            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="font-semibold text-red-900 mb-1">Danger Zone</h4>
                                <p className="text-sm text-red-700 mb-4">
                                    This action should only be used in exceptional cases.
                                </p>
                                <Button
                                    variant="destructive"
                                    onClick={() => onSetShowWithdrawOfferModal(true)}
                                    className="gap-2"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Withdraw Offer
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};
