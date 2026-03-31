import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompensationUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidateName: string;
    currentProposal?: string;
    candidateExpected?: string;
    existingBenefits?: string[];
    existingExpectedJoining?: string;
    onUpdate: (data: CompensationUpdateData) => void;
}

interface CompensationUpdateData {
    companyProposed: string;
    expectedJoining?: string;
    benefits?: string[];
}

export const CompensationUpdateModal = ({
    isOpen,
    onClose,
    candidateName,
    currentProposal,
    candidateExpected,
    existingBenefits,
    existingExpectedJoining,
    onUpdate
}: CompensationUpdateModalProps) => {
    const [formData, setFormData] = useState<CompensationUpdateData>({
        companyProposed: currentProposal || '',
        expectedJoining: existingExpectedJoining ? new Date(existingExpectedJoining).toISOString().split('T')[0] : '',
        benefits: existingBenefits || []
    });
    const [benefitInput, setBenefitInput] = useState('');
    const [errors, setErrors] = useState<Partial<Record<keyof CompensationUpdateData, string>>>({});

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            setFormData({
                companyProposed: currentProposal || '',
                expectedJoining: existingExpectedJoining ? new Date(existingExpectedJoining).toISOString().split('T')[0] : '',
                benefits: existingBenefits || []
            });
            setBenefitInput('');
        }
    }, [isOpen, currentProposal, existingBenefits, existingExpectedJoining]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof CompensationUpdateData, string>> = {};
        let isValid = true;

        if (!formData.companyProposed.trim()) {
            newErrors.companyProposed = 'Company proposed salary is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleInputChange = (field: keyof CompensationUpdateData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleAddBenefit = () => {
        if (benefitInput.trim() && !formData.benefits?.includes(benefitInput.trim())) {
            setFormData({
                ...formData,
                benefits: [...(formData.benefits || []), benefitInput.trim()]
            });
            setBenefitInput('');
        }
    };

    const handleRemoveBenefit = (index: number) => {
        const newBenefits = [...(formData.benefits || [])];
        newBenefits.splice(index, 1);
        setFormData({ ...formData, benefits: newBenefits });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        onUpdate(formData);
        handleClose();
    };

    const handleClose = () => {
        setFormData({ companyProposed: '', expectedJoining: '', benefits: [] });
        setBenefitInput('');
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold">Update Compensation</DialogTitle>
                            <DialogDescription>
                                For <span className="font-medium text-foreground">{candidateName}</span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {candidateExpected && (
                        <div className="p-3 bg-muted/50 rounded-lg border border-border">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-wider">Candidate Expected</p>
                            <p className="text-sm font-semibold text-foreground">{candidateExpected}</p>
                        </div>
                    )}

                    {/* Company Proposed */}
                    <div className="space-y-1.5">
                        <Label htmlFor="companyProposed">
                            Company Proposed Salary <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="companyProposed"
                            placeholder="e.g., ₹8-9 LPA or ₹800000 - ₹900000"
                            value={formData.companyProposed}
                            onChange={(e) => handleInputChange('companyProposed', e.target.value)}
                            className={cn(errors.companyProposed && "border-destructive focus-visible:ring-destructive")}
                        />
                        {errors.companyProposed && <p className="text-xs text-destructive">{errors.companyProposed}</p>}
                    </div>

                    {/* Expected Joining Date */}
                    <div className="space-y-1.5">
                        <Label htmlFor="expectedJoining">Expected Joining Date (Optional)</Label>
                        <Input
                            id="expectedJoining"
                            type="date"
                            value={formData.expectedJoining}
                            onChange={(e) => handleInputChange('expectedJoining', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {/* Benefits */}
                    <div className="space-y-1.5">
                        <Label>Benefits (Optional)</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g., Health Insurance, Stock Options"
                                value={benefitInput}
                                onChange={(e) => setBenefitInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddBenefit();
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddBenefit}
                                className="shrink-0"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add
                            </Button>
                        </div>
                        {formData.benefits && formData.benefits.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.benefits.map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 px-2.5 py-1 bg-muted rounded-md text-sm border border-border transition-colors"
                                    >
                                        <span>{benefit}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveBenefit(index)}
                                            className="text-muted-foreground hover:text-destructive transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="pt-4 gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#4640DE] hover:bg-[#3730A3]"
                        >
                            Update Compensation
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
