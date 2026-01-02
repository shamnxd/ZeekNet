
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, X, Upload } from 'lucide-react';
import type { ExtendedATSOfferDocument } from '@/interfaces/seeker/application-details.types';

interface SeekerOfferListProps {
    offers: ExtendedATSOfferDocument[];
    onAccept: (offer: ExtendedATSOfferDocument) => void;
    onDecline: (offerId: string) => void;
    onUploadSigned: (offer: ExtendedATSOfferDocument) => void;
    formatDateTime: (date: string) => string;
}

export const SeekerOfferList: React.FC<SeekerOfferListProps> = ({
    offers,
    onAccept,
    onDecline,
    onUploadSigned,
    formatDateTime
}) => {
    return (
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6">
            <h2 className="text-[20px] font-bold text-[#1f2937] mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Offer Details
            </h2>
            {offers.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-[14px] text-[#6b7280]">No offers available yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {offers.map((offer) => {
                        const getStatusDisplay = (status: string, hasWithdrawalReason?: boolean) => {
                            if (status === 'declined' || status === 'OFFER_DECLINED') {
                                return hasWithdrawalReason
                                    ? { label: 'Offer Withdrawn', color: 'bg-orange-100 text-orange-700' }
                                    : { label: 'Offer Declined', color: 'bg-red-100 text-red-700' };
                            }
                            const statusMap: Record<string, { label: string; color: string }> = {
                                'sent': { label: 'Offer Sent', color: 'bg-blue-100 text-blue-700' },
                                'OFFER_SENT': { label: 'Offer Sent', color: 'bg-blue-100 text-blue-700' },
                                'signed': { label: 'Offer Accepted', color: 'bg-green-100 text-green-700' },
                                'OFFER_ACCEPTED': { label: 'Offer Accepted', color: 'bg-green-100 text-green-700' },
                                'accepted': { label: 'Offer Accepted', color: 'bg-green-100 text-green-700' },
                                'NOT_SENT': { label: 'Not Sent', color: 'bg-gray-100 text-gray-700' },
                            };
                            return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
                        };

                        const offerStatus = offer.status || 'draft';
                        const statusInfo = getStatusDisplay(offerStatus, !!offer.withdrawalReason);
                        const canAcceptDecline = offerStatus === 'sent';
                        const isSigned = offerStatus === 'signed';
                        const isDeclined = offerStatus === 'declined';

                        return (
                            <div key={offer.id} className="border border-[#e5e7eb] rounded-lg p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-[16px] font-semibold text-[#1f2937]">Job Offer</h3>
                                            <Badge className={statusInfo.color}>
                                                {statusInfo.label}
                                            </Badge>
                                        </div>

                                        {offer.offerAmount && (
                                            <div className="mb-3">
                                                <p className="text-[13px] text-[#6b7280] mb-1">Offer Amount</p>
                                                <p className="text-[18px] font-bold text-[#1f2937]">
                                                    ₹{offer.offerAmount} LPA
                                                </p>
                                            </div>
                                        )}

                                        {offer.sentAt && (
                                            <div className="mb-3">
                                                <p className="text-[13px] text-[#6b7280] mb-1">Sent Date</p>
                                                <p className="text-[14px] font-medium text-[#1f2937]">
                                                    {formatDateTime(offer.sentAt)}
                                                </p>
                                            </div>
                                        )}

                                        {offer.documentUrl && (
                                            <div className="mb-3">
                                                <p className="text-[13px] text-[#6b7280] mb-2">Offer Document</p>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        if (offer.documentUrl) {
                                                            window.open(offer.documentUrl, '_blank');
                                                        }
                                                    }}
                                                    className="gap-2"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    {offer.documentFilename || 'View Offer Letter'}
                                                </Button>
                                            </div>
                                        )}

                                        {isSigned && offer.signedDocumentUrl && (
                                            <div className="mb-3">
                                                <p className="text-[13px] text-[#6b7280] mb-2">Signed Document</p>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        if (offer.signedDocumentUrl) {
                                                            window.open(offer.signedDocumentUrl, '_blank');
                                                        }
                                                    }}
                                                    className="gap-2"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    {offer.signedDocumentFilename || 'View Signed Document'}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {canAcceptDecline && (
                                    <div className="mt-4 pt-4 border-t border-[#e5e7eb] space-y-3">
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => onAccept(offer)}
                                                className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                                Accept Offer
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => offer.id && onDecline(offer.id)}
                                                className="gap-2 text-red-600 hover:text-red-700 border-red-300 flex-1"
                                            >
                                                <X className="h-4 w-4" />
                                                Decline Offer
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {isSigned && !offer.signedDocumentUrl && (
                                    <div className="mt-4 pt-4 border-t border-[#e5e7eb]">
                                        <p className="text-[13px] text-[#6b7280] mb-3">Upload your signed offer document</p>
                                        <Button
                                            variant="outline"
                                            onClick={() => onUploadSigned(offer)}
                                            className="gap-2"
                                        >
                                            <Upload className="h-4 w-4" />
                                            Upload Signed Document
                                        </Button>
                                    </div>
                                )}

                                {isSigned && (
                                    <div className="mt-4 pt-4 border-t border-[#e5e7eb]">
                                        <div className="flex items-center gap-2 text-green-700">
                                            <CheckCircle className="h-5 w-5" />
                                            <p className="text-sm font-semibold">Offer Accepted</p>
                                        </div>
                                        {offer.signedAt && (
                                            <p className="text-xs text-[#6b7280] mt-1">
                                                Accepted on {formatDateTime(offer.signedAt)}
                                            </p>
                                        )}
                                    </div>
                                )}
                                {isDeclined && (
                                    <div className="mt-4 pt-4 border-t border-[#e5e7eb]">
                                        <div className="flex items-center gap-2 text-red-700">
                                            <X className="h-5 w-5" />
                                            <p className="text-sm font-semibold">
                                                {offer.withdrawalReason ? 'Offer Withdrawn' : 'Offer Declined'}
                                            </p>
                                        </div>
                                        {offer.withdrawalReason && (
                                            <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
                                                <p className="text-xs font-medium text-red-900 mb-1">Withdrawal Reason:</p>
                                                <p className="text-sm text-red-800">{offer.withdrawalReason}</p>
                                            </div>
                                        )}
                                        {offer.declinedAt && (
                                            <p className="text-xs text-[#6b7280] mt-1">
                                                {offer.withdrawalReason ? 'Withdrawn' : 'Declined'} on {formatDateTime(offer.declinedAt)}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
