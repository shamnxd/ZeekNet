
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, Edit, X, ChevronRight } from "lucide-react";
import type { ATSCompensation } from "@/types/ats";
import { ATSStage, CompensationSubStage, ATSStageDisplayNames } from "@/constants/ats-stages";
import { formatDateTime } from "@/utils/formatters";

interface CompensationDetailsProps {
    currentSubStage: string;
    jobSalaryRange: string;
    compensationData: ATSCompensation | null;
    showActions: boolean;
    canApprove: boolean;
    approvedBy?: string;
    setShowCompensationUpdateModal: (show: boolean) => void;
    handleApproveCompensation: () => void;
    handleRejectCandidate: () => void;
    getNextStage: (currentStage: ATSStage | string) => ATSStage | null;
    handleMoveToStage: (stage: ATSStage) => void;
}

export const CompensationDetails: React.FC<CompensationDetailsProps> = ({
    currentSubStage,
    jobSalaryRange,
    compensationData,
    showActions,
    canApprove,
    setShowCompensationUpdateModal,
    handleApproveCompensation,
    handleRejectCandidate,
    getNextStage,
    handleMoveToStage,
}) => {
    const candidateExpected = compensationData?.candidateExpected || "";
    const companyProposed = compensationData?.companyProposed || "";
    const finalAgreed = compensationData?.finalAgreed || "";
    const benefits = compensationData?.benefits || [];
    const expectedJoining = compensationData?.expectedJoining || "";
    const approvedAt = compensationData?.approvedAt || "";
    const approvedBy = compensationData?.approvedBy || "";

    if (currentSubStage === CompensationSubStage.INITIATED) {
        return (
            <div className="bg-white rounded-lg p-6 border space-y-4 mt-6">
                <h4 className="font-semibold text-gray-900">
                    Compensation Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">
                            Candidate Expected Salary
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                            {candidateExpected || "Not specified"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">
                            Company Budget Range
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                            {jobSalaryRange}
                        </p>
                    </div>
                </div>
                {showActions && (
                    <div className="flex gap-2 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => setShowCompensationUpdateModal(true)}
                            className="gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            Update Compensation
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    if (currentSubStage === CompensationSubStage.NEGOTIATION_ONGOING) {
        return (
            <div className="bg-white rounded-lg p-6 border space-y-4 mt-6">
                <h4 className="font-semibold text-gray-900">Negotiation Details</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Current Proposal</p>
                        <p className="text-sm font-medium text-gray-900">
                            {companyProposed || "Not set"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Candidate Expected</p>
                        <p className="text-sm font-medium text-gray-900">
                            {candidateExpected || "Not specified"}
                        </p>
                    </div>
                </div>
                {showActions && (
                    <div className="flex gap-2 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => setShowCompensationUpdateModal(true)}
                            className="gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            Update Compensation
                        </Button>
                        {}
                        {canApprove && (
                            <Button
                                onClick={handleApproveCompensation}
                                className="bg-green-600 hover:bg-green-700 text-white gap-2"
                            >
                                <CheckCircle className="h-4 w-4" />
                                Approve Compensation
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={handleRejectCandidate}
                            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <X className="h-4 w-4" />
                            Reject Candidate
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    if (currentSubStage === CompensationSubStage.APPROVED) {
        return (
            <div className="bg-white rounded-lg p-6 border space-y-4 mt-6">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Compensation Approved
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">
                            Final Agreed Salary
                        </p>
                        <p className="text-sm font-medium text-green-700">
                            {finalAgreed || companyProposed || "Not set"}
                        </p>
                    </div>
                    {expectedJoining && (
                        <div>
                            <p className="text-sm text-gray-600 mb-1">
                                Expected Joining Date
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                                {new Date(expectedJoining).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    )}
                </div>
                {benefits.length > 0 && (
                    <div>
                        <p className="text-sm text-gray-600 mb-2">Benefits Summary</p>
                        <ul className="list-disc list-inside space-y-1">
                            {benefits.map((benefit: string, idx: number) => (
                                <li key={idx} className="text-sm text-gray-700">
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {approvedAt && (
                    <div className="pt-4 border-t">
                        <p className="text-xs text-gray-500">
                            Approved on {formatDateTime(approvedAt)} by{" "}
                            {approvedBy || "Recruiter"}
                        </p>
                    </div>
                )}
                {showActions && (
                    <div className="pt-4 border-t">
                        <Button
                            onClick={() => {
                                const nextStage = getNextStage(ATSStage.COMPENSATION);
                                if (nextStage) {
                                    handleMoveToStage(nextStage);
                                }
                            }}
                            className="bg-[#4640DE] hover:bg-[#3730A3] gap-2"
                        >
                            <ChevronRight className="h-4 w-4" />
                            Proceed to Offer
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    
    if (showActions && currentSubStage !== CompensationSubStage.NOT_INITIATED) {
        const nextStage = getNextStage(ATSStage.COMPENSATION);
        if (nextStage) {
            const nextStageDisplayName = ATSStageDisplayNames[nextStage] || nextStage;
            return (
                <div className="flex flex-col gap-3 mt-6">
                    <Button
                        variant="outline"
                        className="gap-2 border-[#4640DE] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
                        onClick={() => handleMoveToStage(nextStage)}
                    >
                        <ChevronRight className="h-4 w-4" />
                        Move to {nextStageDisplayName}
                    </Button>
                </div>
            );
        }
    }

    return null;
};
