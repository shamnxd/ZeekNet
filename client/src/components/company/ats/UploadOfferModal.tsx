import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UploadOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidateName: string;
    onUpload: (data: OfferFormData) => void;
}

interface OfferFormData {
    documentType: 'offer_letter' | 'contract' | 'other';
    fileName: string;
}

export const UploadOfferModal = ({
    isOpen,
    onClose,
    candidateName,
    onUpload
}: UploadOfferModalProps) => {
    const [formData, setFormData] = useState<OfferFormData>({
        documentType: 'offer_letter',
        fileName: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpload(formData);
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
                <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-card rounded-2xl border border-border shadow-elevated w-full max-w-lg"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-stage-offer/20 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-stage-offer" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">Upload Offer Letter</h2>
                                <p className="text-sm text-muted-foreground">For {candidateName}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-5 space-y-4">
                        {/* Document Type */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Document Type
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['offer_letter', 'contract', 'other'] as const).map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, documentType: type })}
                                        className={cn(
                                            "px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                                            formData.documentType === type
                                                ? "border-primary bg-accent text-primary"
                                                : "border-border hover:border-primary/50 text-muted-foreground"
                                        )}
                                    >
                                        {type === 'offer_letter' ? 'Offer Letter' : type === 'contract' ? 'Contract' : 'Other'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Upload Document
                            </label>
                            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                                <p className="text-sm font-medium text-foreground">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    PDF, DOC up to 10MB
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1 gradient-primary text-primary-foreground hover:opacity-90">
                                Upload & Send
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
