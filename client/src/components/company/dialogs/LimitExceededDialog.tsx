import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LimitExceededDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    limitExceededData: { currentLimit: number; used: number } | null;
    title?: string;
    description?: string;
    upgradeText?: string;
    cancelText?: string;
}

export function LimitExceededDialog({
    open,
    onOpenChange,
    limitExceededData,
    title = "Limit Exceeded",
    description = "You have reached your limit for your current subscription plan.",
    upgradeText = "Upgrade Plan",
    cancelText = "Cancel"
}: LimitExceededDialogProps) {
    const navigate = useNavigate();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700">
                            <strong>Current Usage:</strong> {limitExceededData?.used || 0} /{" "}
                            {limitExceededData?.currentLimit || -1}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            Upgrade your plan to unlock more features and higher limits.
                        </p>
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={() => {
                            onOpenChange(false);
                            navigate("/company/billing?tab=plans");
                        }}
                        className="bg-[#4640DE] hover:bg-[#3730b8]"
                    >
                        {upgradeText}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
