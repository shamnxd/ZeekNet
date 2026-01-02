
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Plus } from "lucide-react";
import type { ATSCompensation } from "@/types/ats";
import { CompensationSubStage } from "@/constants/ats-stages";
import { formatDateTime } from "@/utils/formatters";

interface CompensationSummaryProps {
    currentSubStage: string;
    jobSalaryRange: string;
    compensationData: ATSCompensation | null;
    showActions: boolean;
    setShowCompensationInitModal: (show: boolean) => void;
}

export const CompensationSummary: React.FC<CompensationSummaryProps> = ({
    currentSubStage,
    jobSalaryRange,
    compensationData,
    showActions,
    setShowCompensationInitModal,
}) => {
    const candidateExpected = compensationData?.candidateExpected || "";
    const companyProposed = compensationData?.companyProposed || "";
    const finalAgreed = compensationData?.finalAgreed || "";
    const benefits = compensationData?.benefits || [];
    const expectedJoining = compensationData?.expectedJoining || "";
    const approvedAt = compensationData?.approvedAt || "";

    return (
        <>
            {}
            <div className="bg-white rounded-lg p-6 border">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-amber-600" />
                    Compensation Summary
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Stage</p>
                        <p className="text-sm font-medium text-gray-900">Compensation</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="text-sm font-medium text-gray-900">
                            {currentSubStage === CompensationSubStage.NOT_INITIATED
                                ? "Not Initiated"
                                : currentSubStage === CompensationSubStage.INITIATED
                                    ? "Initiated"
                                    : currentSubStage === CompensationSubStage.NEGOTIATION_ONGOING
                                        ? "Negotiation Ongoing"
                                        : "Approved"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Company Budget Range</p>
                        <p className="text-sm font-medium text-gray-900">
                            {jobSalaryRange}
                        </p>
                    </div>
                    {currentSubStage !== CompensationSubStage.NOT_INITIATED && (
                        <>
                            {finalAgreed ? (
                                <div>
                                    <p className="text-sm text-gray-600">Final Agreed Range</p>
                                    <p className="text-sm font-medium text-green-700">
                                        {finalAgreed}
                                    </p>
                                </div>
                            ) : companyProposed ? (
                                <div>
                                    <p className="text-sm text-gray-600">Proposed Range</p>
                                    <p className="text-sm font-medium text-amber-700">
                                        {companyProposed}
                                    </p>
                                </div>
                            ) : null}
                            {expectedJoining && (
                                <div>
                                    <p className="text-sm text-gray-600">Expected Joining</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(expectedJoining).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                    {currentSubStage === CompensationSubStage.APPROVED && approvedAt && (
                        <div>
                            <p className="text-sm text-gray-600">Approved On</p>
                            <p className="text-sm font-medium text-gray-900">
                                {formatDateTime(approvedAt)}
                            </p>
                        </div>
                    )}
                </div>
                {benefits.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-600 mb-2">Benefits</p>
                        <div className="flex flex-wrap gap-2">
                            {benefits.map((benefit: string, idx: number) => (
                                <Badge
                                    key={idx}
                                    variant="outline"
                                    className="bg-amber-50 text-amber-700 border-amber-200"
                                >
                                    {benefit}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {}
            <div className="bg-white rounded-lg p-4 border mt-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <p className="text-sm text-gray-600">
                            Candidate Expected Salary:
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                            {candidateExpected || "—"}
                        </p>
                        {currentSubStage === CompensationSubStage.NEGOTIATION_ONGOING && (
                            <Badge
                                variant="outline"
                                className="bg-amber-50 text-amber-700 border-amber-200"
                            >
                                <TrendingUp className="h-3 w-3 mr-1" />
                                negotiation in Progress
                            </Badge>
                        )}
                    </div>
                    {showActions &&
                        currentSubStage === CompensationSubStage.NOT_INITIATED && (
                            <Button
                                size="sm"
                                variant="default"
                                onClick={() => setShowCompensationInitModal(true)}
                                className="bg-[#4640DE] hover:bg-[#3730A3]"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Compensation
                            </Button>
                        )}
                </div>
            </div>
        </>
    );
};
