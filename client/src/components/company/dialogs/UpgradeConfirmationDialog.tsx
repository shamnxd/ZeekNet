import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, TrendingUp, Sparkles } from "lucide-react";
import type { PreviewPlanChangeResponse } from "@/interfaces/company/subscription/preview-plan-change.interface";

interface UpgradeConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    previewData: PreviewPlanChangeResponse | null;
    onConfirm: () => void;
    loading?: boolean;
}

export function UpgradeConfirmationDialog({
    open,
    onOpenChange,
    previewData,
    onConfirm,
    loading = false,
}: UpgradeConfirmationDialogProps) {
    if (!previewData) return null;

    const { impact, currentPlan, newPlan } = previewData;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Upgrade Your Plan</DialogTitle>
                            <DialogDescription>
                                Unlock more features and grow your business
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
                            <p className="font-semibold text-green-600">{newPlan.name}</p>
                            <p className="text-sm text-green-600">
                                ${newPlan.price}/{newPlan.billingCycle === 'yearly' ? 'year' : 'month'}
                            </p>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-green-600" />
                            <p className="font-medium">What you'll get:</p>
                        </div>

                        <div className="space-y-2">
                            {impact.jobPostLimitChange > 0 && (
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm">
                                            <span className="font-medium">+{impact.jobPostLimitChange}</span> more job postings
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {impact.newJobPostLimit === -1 ? 'Unlimited' : impact.newJobPostLimit} total job posts
                                        </p>
                                    </div>
                                </div>
                            )}

                            {impact.featuredJobLimitChange > 0 && (
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm">
                                            <span className="font-medium">+{impact.featuredJobLimitChange}</span> more featured jobs
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {impact.newFeaturedJobLimit === -1 ? 'Unlimited' : impact.newFeaturedJobLimit} total featured slots
                                        </p>
                                    </div>
                                </div>
                            )}

                            {impact.candidateViewsChange > 0 && (
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm">
                                            <span className="font-medium">+{impact.candidateViewsChange}</span> more candidate views
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {impact.newCandidateViewLimit === -1 ? 'Unlimited' : impact.newCandidateViewLimit} total views per month
                                        </p>
                                    </div>
                                </div>
                            )}

                            {impact.billingCycleChange && (
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm">
                                            Switched to <span className="font-medium">{newPlan.billingCycle}</span> billing
                                        </p>
                                        {newPlan.billingCycle === 'yearly' && (
                                            <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
                                                Save money with annual billing
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Immediate Effect Notice */}
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                            <strong>✓ Immediate upgrade:</strong> Your new limits will be available right away!
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {loading ? "Processing..." : "Upgrade Now"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
