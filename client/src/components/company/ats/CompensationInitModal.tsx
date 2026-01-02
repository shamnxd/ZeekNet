import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
        notes?: string;
    };
}

interface CompensationInitData {
    candidateExpected: string;
    companyProposed?: string;
    benefits?: string[];
    expectedJoining?: string;
    notes?: string;
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
        expectedJoining: '',
        notes: ''
    });
    const [newBenefit, setNewBenefit] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (existingData) {
                
                setFormData({
                    candidateExpected: existingData.candidateExpected || '',
                    companyProposed: existingData.companyProposed || '',
                    benefits: existingData.benefits || [],
                    expectedJoining: existingData.expectedJoining || '',
                    notes: existingData.notes || ''
                });
            } else {
                
                setFormData({
                    candidateExpected: '',
                    companyProposed: '',
                    benefits: [],
                    expectedJoining: '',
                    notes: ''
                });
            }
            setNewBenefit('');
        }
    }, [isOpen, existingData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.candidateExpected.trim()) {
            return;
        }
        onInitiate(formData);
        setFormData({ candidateExpected: '', companyProposed: '', benefits: [], expectedJoining: '', notes: '' });
        setNewBenefit('');
        onClose();
    };

    const handleClose = () => {
        setFormData({ candidateExpected: '', companyProposed: '', benefits: [], expectedJoining: '', notes: '' });
        setNewBenefit('');
        onClose();
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

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
                <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={handleClose} />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-card rounded-2xl border border-border shadow-elevated w-full max-w-lg max-h-[90vh] overflow-hidden"
                >
                    {}
                    <div className="flex items-center justify-between p-5 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">{existingData ? 'Update Compensation' : 'Add Compensation'}</h2>
                                <p className="text-sm text-muted-foreground">For {candidateName}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    {}
                    <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                        <div className="space-y-2">
                            <Label htmlFor="candidateExpected" className="text-foreground">
                                Candidate Expected Salary (Annual CTC) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="candidateExpected"
                                type="text"
                                placeholder="e.g., ₹8-10 LPA or ₹800000 - ₹1000000"
                                value={formData.candidateExpected}
                                onChange={(e) => setFormData({ ...formData, candidateExpected: e.target.value })}
                                className="w-full"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Enter the salary range or amount the candidate expects
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="companyProposed" className="text-foreground">
                                Company Proposed Amount (Optional)
                            </Label>
                            <Input
                                id="companyProposed"
                                type="text"
                                placeholder="e.g., ₹8-9 LPA or ₹800000 - ₹900000"
                                value={formData.companyProposed || ''}
                                onChange={(e) => setFormData({ ...formData, companyProposed: e.target.value })}
                                className="w-full"
                            />
                            <p className="text-xs text-muted-foreground">
                                Enter the salary range or amount the company is proposing
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="benefits" className="text-foreground">
                                Benefits (Optional)
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    id="benefits"
                                    type="text"
                                    placeholder="e.g., Health Insurance, Stock Options"
                                    value={newBenefit}
                                    onChange={(e) => setNewBenefit(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddBenefit();
                                        }
                                    }}
                                    className="w-full"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddBenefit}
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add
                                </Button>
                            </div>
                            {formData.benefits && formData.benefits.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.benefits.map((benefit, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md text-sm"
                                        >
                                            <span>{benefit}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveBenefit(idx)}
                                                className="hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="expectedJoining" className="text-foreground">
                                Expected Joining Date (Optional)
                            </Label>
                            <Input
                                id="expectedJoining"
                                type="date"
                                value={formData.expectedJoining ? new Date(formData.expectedJoining).toISOString().split('T')[0] : ''}
                                onChange={(e) => setFormData({ ...formData, expectedJoining: e.target.value })}
                                className="w-full"
                            />
                            <p className="text-xs text-muted-foreground">
                                Select the expected joining date for the candidate
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-foreground">
                                {existingData ? 'Notes (Optional)' : 'Initial Notes (Optional)'}
                            </Label>
                            <Textarea
                                id="notes"
                                placeholder="Add context about the salary discussion (e.g., flexibility, notice period, benefits expectations)…"
                                value={formData.notes || ''}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={4}
                                className="w-full resize-none"
                            />
                        </div>

                        {}
                        <div className="flex justify-end gap-3 pt-4 border-t border-border">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="gradient-primary text-primary-foreground hover:opacity-90"
                                disabled={!formData.candidateExpected.trim()}
                            >
                                {existingData ? 'Update Compensation' : 'Save Compensation'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

