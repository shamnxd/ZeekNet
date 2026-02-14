import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompensationInitModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidateName: string;
    onInitiate: (data: CompensationInitData) => void;
    existingData?: {
        candidateExpected?: string;
        companyProposed?: string;
        benefits?: string[];
        expectedJoining?: string;
    };
}

interface CompensationInitData {
    candidateExpected: string;
    companyProposed?: string;
    benefits?: string[];
    expectedJoining?: string;
}

export const CompensationInitModal = ({
    isOpen,
    onClose,
    candidateName,
    onInitiate,
    existingData
}: CompensationInitModalProps) => {
    const [formData, setFormData] = useState<CompensationInitData>({
        candidateExpected: '',
        companyProposed: '',
        benefits: [],
        expectedJoining: ''
    });
    const [newBenefit, setNewBenefit] = useState('');
    const [errors, setErrors] = useState<Partial<Record<keyof CompensationInitData, string>>>({});

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            if (existingData) {
                setFormData({
                    candidateExpected: existingData.candidateExpected || '',
                    companyProposed: existingData.companyProposed || '',
                    benefits: existingData.benefits || [],
                    expectedJoining: existingData.expectedJoining || ''
                });
            } else {
                setFormData({
                    candidateExpected: '',
                    companyProposed: '',
                    benefits: [],
                    expectedJoining: ''
                });
            }
            setNewBenefit('');
        }
    }, [isOpen, existingData]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof CompensationInitData, string>> = {};
        let isValid = true;

        if (!formData.candidateExpected.trim()) {
            newErrors.candidateExpected = 'Candidate expected salary is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        onInitiate(formData);
        handleClose();
    };

    const handleClose = () => {
        setFormData({ candidateExpected: '', companyProposed: '', benefits: [], expectedJoining: '' });
        setNewBenefit('');
        setErrors({});
        onClose();
    };

    const handleInputChange = (field: keyof CompensationInitData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleAddBenefit = () => {
        if (newBenefit.trim() && !formData.benefits?.includes(newBenefit.trim())) {
            setFormData({
                ...formData,
                benefits: [...(formData.benefits || []), newBenefit.trim()]
            });
            setNewBenefit('');
        }
    };

    const handleRemoveBenefit = (index: number) => {
        const updatedBenefits = formData.benefits?.filter((_, i) => i !== index) || [];
        setFormData({ ...formData, benefits: updatedBenefits });
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold">
                                {existingData ? 'Update Compensation' : 'Add Compensation'}
                            </DialogTitle>
                            <DialogDescription>
                                For <span className="font-medium text-foreground">{candidateName}</span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {/* Candidate Expected */}
                    <div className="space-y-1.5">
                        <Label htmlFor="candidateExpected">
                            Candidate Expected Salary (Annual CTC) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="candidateExpected"
                            placeholder="e.g., ₹8-10 LPA or ₹800000 - ₹1000000"
                            value={formData.candidateExpected}
                            onChange={(e) => handleInputChange('candidateExpected', e.target.value)}
                            className={cn(errors.candidateExpected && "border-destructive focus-visible:ring-destructive")}
                        />
                        {errors.candidateExpected ? (
                            <p className="text-xs text-destructive">{errors.candidateExpected}</p>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                Enter the salary range or amount the candidate expects
                            </p>
                        )}
                    </div>

                    {/* Company Proposed */}
                    <div className="space-y-1.5">
                        <Label htmlFor="companyProposed">
                            Company Proposed Amount (Optional)
                        </Label>
                        <Input
                            id="companyProposed"
                            placeholder="e.g., ₹8-9 LPA or ₹800000 - ₹900000"
                            value={formData.companyProposed || ''}
                            onChange={(e) => handleInputChange('companyProposed', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Enter the salary range or amount the company is proposing
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-1.5">
                        <Label htmlFor="benefits">Benefits (Optional)</Label>
                        <div className="flex gap-2">
                            <Input
                                id="benefits"
                                placeholder="e.g., Health Insurance, Stock Options"
                                value={newBenefit}
                                onChange={(e) => setNewBenefit(e.target.value)}
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
                                {formData.benefits.map((benefit, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md text-sm border border-border"
                                    >
                                        <span>{benefit}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveBenefit(idx)}
                                            className="text-muted-foreground hover:text-destructive transition-colors"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Expected Joining Date */}
                    <div className="space-y-1.5">
                        <Label htmlFor="expectedJoining">Expected Joining Date (Optional)</Label>
                        <Input
                            id="expectedJoining"
                            type="date"
                            value={formData.expectedJoining ? new Date(formData.expectedJoining).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleInputChange('expectedJoining', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                        <p className="text-xs text-muted-foreground">
                            Select the expected joining date for the candidate
                        </p>
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
                            {existingData ? 'Update Compensation' : 'Save Compensation'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

