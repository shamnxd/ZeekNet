import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, TrendingDown, X, Star, Users } from "lucide-react";
import type { PreviewPlanChangeResponse } from "@/interfaces/company/subscription/preview-plan-change.interface";

interface DowngradeWarningDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    previewData: PreviewPlanChangeResponse | null;
    onConfirm: () => void;
    loading?: boolean;
}

export function DowngradeWarningDialog({
    open,
    onOpenChange,
    previewData,
    onConfirm,
    loading = false,
}: DowngradeWarningDialogProps) {
    const [understood, setUnderstood] = useState(false);

    if (!previewData) return null;

    const { impact, currentPlan, newPlan } = previewData;
    const hasJobsToUnlist = impact.jobsToUnlist > 0;

    // Reset checkbox when dialog opens/closes
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setUnderstood(false);
        }
        onOpenChange(open);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Downgrade Plan</DialogTitle>
                            <DialogDescription>
                                Please review the impact of this change
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Plan Comparison */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Current Plan</p>
                            <p className="font-semibold">{currentPlan.name}</p>
                            <p className="text-sm text-gray-600">
                                ${currentPlan.price}/{currentPlan.billingCycle === 'yearly' ? 'year' : 'month'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">New Plan</p>
                            <p className="font-semibold text-orange-600">{newPlan.name}</p>
                            <p className="text-sm text-orange-600">
                                ${newPlan.price}/{newPlan.billingCycle === 'yearly' ? 'year' : 'month'}
                            </p>
                        </div>
                    </div>

                    {/* Warning Box */}
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-orange-600" />
                            <p className="font-medium text-orange-900">What will change:</p>
                        </div>

                        <div className="space-y-2">
                            {impact.jobPostLimitChange < 0 && (
                                <div className="flex items-start gap-2">
                                    <X className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-sm text-orange-900">
                                            Job posting limit reduced by <span className="font-medium">{Math.abs(impact.jobPostLimitChange)}</span>
                                        </p>
                                        <p className="text-xs text-orange-700">
                                            New limit: {impact.newJobPostLimit === -1 ? 'Unlimited' : impact.newJobPostLimit} job posts
                                        </p>
                                    </div>
                                </div>
                            )}

                            {impact.featuredJobLimitChange < 0 && (
                                <div className="flex items-start gap-2">
                                    <X className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-sm text-orange-900">
                                            Featured job slots reduced by <span className="font-medium">{Math.abs(impact.featuredJobLimitChange)}</span>
                                        </p>
                                        <p className="text-xs text-orange-700">
                                            New limit: {impact.newFeaturedJobLimit === -1 ? 'Unlimited' : impact.newFeaturedJobLimit} featured slots
                                        </p>
                                    </div>
                                </div>
                            )}

                            {impact.candidateViewsChange < 0 && (
                                <div className="flex items-start gap-2">
                                    <X className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-sm text-orange-900">
                                            Candidate views reduced by <span className="font-medium">{Math.abs(impact.candidateViewsChange)}</span>
                                        </p>
                                        <p className="text-xs text-orange-700">
                                            New limit: {impact.newCandidateViewLimit === -1 ? 'Unlimited' : impact.newCandidateViewLimit} views/month
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Jobs to Unlist */}
                    {hasJobsToUnlist && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                <p className="font-medium text-red-900">
                                    {impact.jobsToUnlist} job{impact.jobsToUnlist > 1 ? 's' : ''} will be unlisted
                                </p>
                            </div>

                            <p className="text-sm text-red-800">
                                Your oldest jobs will be automatically unlisted to fit within the new limit. You can re-activate them later if you upgrade again.
                            </p>

                            {impact.jobsToUnlistDetails.length > 0 && (
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {impact.jobsToUnlistDetails.map((job) => (
                                        <div
                                            key={job.id}
                                            className="flex items-center justify-between p-2 bg-white rounded border border-red-100"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {job.title}
                                                    </p>
                                                    {job.isFeatured && (
                                                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Users className="h-3 w-3" />
                                                        {job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Confirmation Checkbox */}
                    <div className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                        <Checkbox
                            id="understand"
                            checked={understood}
                            onCheckedChange={(checked) => setUnderstood(checked as boolean)}
                        />
                        <label
                            htmlFor="understand"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                            I understand that {hasJobsToUnlist ? `${impact.jobsToUnlist} job${impact.jobsToUnlist > 1 ? 's' : ''} will be unlisted and ` : ''}
                            my plan limits will be reduced
                        </label>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={loading || !understood}
                        variant="destructive"
                    >
                        {loading ? "Processing..." : "Confirm Downgrade"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
