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
import { Calendar, DollarSign, RefreshCw } from "lucide-react";
import type { PreviewPlanChangeResponse } from "@/interfaces/company/subscription/preview-plan-change.interface";

interface LateralChangeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    previewData: PreviewPlanChangeResponse | null;
    onConfirm: () => void;
    loading?: boolean;
}

export function LateralChangeDialog({
    open,
    onOpenChange,
    previewData,
    onConfirm,
    loading = false,
}: LateralChangeDialogProps) {
    if (!previewData) return null;

    const { impact, currentPlan, newPlan } = previewData;
    const isBillingCycleChange = impact.billingCycleChange;
    const isYearly = newPlan.billingCycle === 'yearly';

    // Calculate savings for annual billing
    const monthlyCost = isYearly ? newPlan.price / 12 : newPlan.price;
    const yearlySavings = isYearly ? (monthlyCost * 12) - newPlan.price : 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <RefreshCw className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Update Billing Cycle</DialogTitle>
                            <DialogDescription>
                                Change how often you're billed
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Plan Comparison */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Current Billing</p>
                            <p className="font-semibold">{currentPlan.name}</p>
                            <p className="text-sm text-gray-600">
                                ${currentPlan.price}/{currentPlan.billingCycle === 'yearly' ? 'year' : 'month'}
                            </p>
                            <Badge variant="secondary" className="mt-2">
                                {currentPlan.billingCycle === 'yearly' ? 'Annual' : 'Monthly'}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">New Billing</p>
                            <p className="font-semibold text-blue-600">{newPlan.name}</p>
                            <p className="text-sm text-blue-600">
                                ${newPlan.price}/{newPlan.billingCycle === 'yearly' ? 'year' : 'month'}
                            </p>
                            <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-700">
                                {newPlan.billingCycle === 'yearly' ? 'Annual' : 'Monthly'}
                            </Badge>
                        </div>
                    </div>

                    {/* Benefits/Changes */}
                    <div className="space-y-3">
                        {isBillingCycleChange && (
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    <p className="font-medium text-blue-900">Billing Frequency</p>
                                </div>
                                <p className="text-sm text-blue-800">
                                    {isYearly
                                        ? "You'll be billed once per year instead of monthly"
                                        : "You'll be billed monthly instead of annually"}
                                </p>
                            </div>
                        )}

                        {isYearly && yearlySavings > 0 && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                    <p className="font-medium text-green-900">Annual Savings</p>
                                </div>
                                <p className="text-sm text-green-800">
                                    Save <span className="font-bold">${yearlySavings.toFixed(2)}</span> per year with annual billing!
                                </p>
                                <p className="text-xs text-green-700">
                                    That's ${monthlyCost.toFixed(2)}/month instead of paying monthly
                                </p>
                            </div>
                        )}

                        {!isYearly && (
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    <p className="font-medium text-blue-900">More Flexibility</p>
                                </div>
                                <p className="text-sm text-blue-800">
                                    Monthly billing gives you more flexibility to adjust your plan as needed
                                </p>
                            </div>
                        )}

                        {/* No Feature Changes */}
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                <strong>Note:</strong> Your plan features and limits will remain the same. Only the billing frequency will change.
                            </p>
                        </div>
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
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {loading ? "Processing..." : "Confirm Change"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
