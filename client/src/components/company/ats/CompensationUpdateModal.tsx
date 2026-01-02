import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CompensationUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidateName: string;
    currentProposal?: string;
    candidateExpected?: string;
    existingBenefits?: string[];
    existingExpectedJoining?: string;
    existingNotes?: string;
    onUpdate: (data: CompensationUpdateData) => void;
}

interface CompensationUpdateData {
    companyProposed: string;
    expectedJoining?: string;
    benefits?: string[];
    notes?: string;
}

export const CompensationUpdateModal = ({
    isOpen,
    onClose,
    candidateName,
    currentProposal,
    candidateExpected,
    existingBenefits,
    existingExpectedJoining,
    existingNotes,
    onUpdate
}: CompensationUpdateModalProps) => {
    const [formData, setFormData] = useState<CompensationUpdateData>({
        companyProposed: currentProposal || '',
        expectedJoining: existingExpectedJoining ? new Date(existingExpectedJoining).toISOString().split('T')[0] : '',
        benefits: existingBenefits || [],
        notes: existingNotes || ''
    });
    const [benefitInput, setBenefitInput] = useState('');

    useEffect(() => {
        if (isOpen) {
            setFormData({
                companyProposed: currentProposal || '',
                expectedJoining: existingExpectedJoining ? new Date(existingExpectedJoining).toISOString().split('T')[0] : '',
                benefits: existingBenefits || [],
                notes: existingNotes || ''
            });
            setBenefitInput('');
        }
    }, [isOpen, currentProposal, existingBenefits, existingExpectedJoining, existingNotes]);

    const handleAddBenefit = () => {
        if (benefitInput.trim()) {
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
        if (!formData.companyProposed.trim()) {
            return;
        }
        onUpdate(formData);
        setFormData({ companyProposed: '', expectedJoining: '', benefits: [], notes: '' });
        setBenefitInput('');
        onClose();
    };

    const handleClose = () => {
        setFormData({ companyProposed: '', expectedJoining: '', benefits: [], notes: '' });
        setBenefitInput('');
        onClose();
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
                                <TrendingUp className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">Update Compensation</h2>
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
                        {candidateExpected && (
                            <div className="p-3 bg-muted rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Candidate Expected</p>
                                <p className="text-sm font-medium text-foreground">{candidateExpected}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="companyProposed" className="text-foreground">
                                Company Proposed Salary <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="companyProposed"
                                type="text"
                                placeholder="e.g., ₹8-9 LPA or ₹800000 - ₹900000"
                                value={formData.companyProposed}
                                onChange={(e) => setFormData({ ...formData, companyProposed: e.target.value })}
                                className="w-full"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="expectedJoining" className="text-foreground">
                                Expected Joining Date (Optional)
                            </Label>
                            <Input
                                id="expectedJoining"
                                type="date"
                                value={formData.expectedJoining}
                                onChange={(e) => setFormData({ ...formData, expectedJoining: e.target.value })}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-foreground">Benefits (Optional)</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="e.g., Health Insurance, Stock Options"
                                    value={benefitInput}
                                    onChange={(e) => setBenefitInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddBenefit();
                                        }
                                    }}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddBenefit}
                                >
                                    Add
                                </Button>
                            </div>
                            {formData.benefits && formData.benefits.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.benefits.map((benefit, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-sm"
                                        >
                                            {benefit}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveBenefit(index)}
                                                className="hover:text-destructive"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-foreground">
                                Update Notes (Optional)
                            </Label>
                            <Textarea
                                id="notes"
                                placeholder="Add notes about this compensation update..."
                                value={formData.notes}
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
                                disabled={!formData.companyProposed.trim()}
                            >
                                Update Compensation
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
