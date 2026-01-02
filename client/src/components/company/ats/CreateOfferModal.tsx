import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Upload, File as FileIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CreateOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidateName: string;
    jobTitle: string;
    onCreate: (data: OfferFormData) => void;
    offerToEdit?: OfferFormData & { id?: string };
}

interface OfferFormData {
    offerAmount: string;
    employmentType: string;
    joiningDate: string;
    validityDate: string;
    documentUrl?: string;
    documentFilename?: string;
    document?: File;
    notes?: string;
}

export const CreateOfferModal = ({
    isOpen,
    onClose,
    candidateName,
    jobTitle,
    onCreate,
    offerToEdit
}: CreateOfferModalProps) => {
    const isEditMode = !!offerToEdit;
    const [formData, setFormData] = useState<OfferFormData>({
        offerAmount: offerToEdit?.offerAmount || '',
        employmentType: offerToEdit?.employmentType || 'full-time',
        joiningDate: offerToEdit?.joiningDate || '',
        validityDate: offerToEdit?.validityDate || '',
        documentUrl: offerToEdit?.documentUrl,
        documentFilename: offerToEdit?.documentFilename,
        notes: offerToEdit?.notes || ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [existingDocumentUrl, setExistingDocumentUrl] = useState<string | undefined>(offerToEdit?.documentUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (offerToEdit) {
                setFormData({
                    offerAmount: offerToEdit.offerAmount || '',
                    employmentType: offerToEdit.employmentType || 'full-time',
                    joiningDate: offerToEdit.joiningDate || '',
                    validityDate: offerToEdit.validityDate || '',
                    documentUrl: offerToEdit.documentUrl,
                    documentFilename: offerToEdit.documentFilename,
                    notes: offerToEdit.notes || ''
                });
                setExistingDocumentUrl(offerToEdit.documentUrl);
            } else {
                setFormData({
                    offerAmount: '',
                    employmentType: 'full-time',
                    joiningDate: '',
                    validityDate: '',
                    documentUrl: undefined,
                    documentFilename: undefined,
                    notes: ''
                });
                setExistingDocumentUrl(undefined);
            }
            setSelectedFile(null);
        }
    }, [isOpen, offerToEdit]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload a PDF or DOC file');
                return;
            }
            
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                return;
            }
            setSelectedFile(file);
            
            const url = URL.createObjectURL(file);
            setFormData(prev => ({
                ...prev,
                documentUrl: url,
                documentFilename: file.name
            }));
        }
    };

    const removeFile = () => {
        if (formData.documentUrl && formData.documentUrl.startsWith('blob:')) {
            URL.revokeObjectURL(formData.documentUrl);
        }
        setSelectedFile(null);
        setFormData(prev => ({
            ...prev,
            documentUrl: undefined,
            documentFilename: undefined
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.offerAmount.trim() || !formData.joiningDate || !formData.validityDate) {
            return;
        }
        
        onCreate({
            ...formData,
            document: selectedFile || undefined
        });
        handleClose();
    };

    const handleClose = () => {
        if (formData.documentUrl && formData.documentUrl.startsWith('blob:')) {
            URL.revokeObjectURL(formData.documentUrl);
        }
        setSelectedFile(null);
        setFormData({
            offerAmount: '',
            employmentType: 'full-time',
            joiningDate: '',
            validityDate: '',
            documentUrl: undefined,
            documentFilename: undefined,
            notes: ''
        });
        setExistingDocumentUrl(undefined);
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
                    className="relative bg-card rounded-2xl border border-border shadow-elevated w-full max-w-2xl max-h-[90vh] overflow-hidden"
                >
                    {}
                    <div className="flex items-center justify-between p-5 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">
                                    {isEditMode ? 'Edit Offer' : 'Create Offer'}
                                </h2>
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
                        {}
                        <div className="space-y-2">
                            <Label className="text-foreground">Job Title</Label>
                            <Input
                                type="text"
                                value={jobTitle}
                                disabled
                                className="w-full bg-muted"
                            />
                        </div>

                        {}
                        <div className="space-y-2">
                            <Label htmlFor="offerAmount" className="text-foreground">
                                Salary / Offer Amount <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="offerAmount"
                                type="text"
                                placeholder="e.g., ₹9 LPA or ₹900000"
                                value={formData.offerAmount}
                                onChange={(e) => setFormData({ ...formData, offerAmount: e.target.value })}
                                className="w-full"
                                required
                            />
                        </div>

                        {}
                        <div className="space-y-2">
                            <Label htmlFor="employmentType" className="text-foreground">
                                Employment Type <span className="text-destructive">*</span>
                            </Label>
                            <select
                                id="employmentType"
                                value={formData.employmentType}
                                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                                required
                            >
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                                <option value="contract">Contract</option>
                                <option value="internship">Internship</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {}
                            <div className="space-y-2">
                                <Label htmlFor="joiningDate" className="text-foreground">
                                    Joining Date <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="joiningDate"
                                    type="date"
                                    value={formData.joiningDate}
                                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                                    className="w-full"
                                    required
                                />
                            </div>

                            {}
                            <div className="space-y-2">
                                <Label htmlFor="validityDate" className="text-foreground">
                                    Offer Validity Date <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="validityDate"
                                    type="date"
                                    value={formData.validityDate}
                                    onChange={(e) => setFormData({ ...formData, validityDate: e.target.value })}
                                    className="w-full"
                                    required
                                />
                            </div>
                        </div>

                        {}
                        <div className="space-y-2">
                            <Label className="text-foreground">Offer Letter (PDF, DOC - Max 10MB)</Label>
                            {existingDocumentUrl && !selectedFile && (
                                <div className="border border-border rounded-lg p-4 bg-muted/50 flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <FileIcon className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{formData.documentFilename || 'Current Document'}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setExistingDocumentUrl(undefined);
                                            setFormData(prev => ({
                                                ...prev,
                                                documentUrl: undefined,
                                                documentFilename: undefined
                                            }));
                                        }}
                                        className="text-destructive hover:text-destructive/80 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            {!selectedFile && !existingDocumentUrl ? (
                                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="offer-file-upload"
                                    />
                                    <label
                                        htmlFor="offer-file-upload"
                                        className="cursor-pointer flex flex-col items-center gap-2"
                                    >
                                        <Upload className="w-8 h-8 text-muted-foreground" />
                                        <span className="text-sm text-foreground">Click to upload or drag and drop</span>
                                        <span className="text-xs text-muted-foreground">PDF, DOC, DOCX (Max 10MB)</span>
                                    </label>
                                </div>
                            ) : (
                                selectedFile && (
                                    <div className="border border-border rounded-lg p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FileIcon className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                                                <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="text-destructive hover:text-destructive/80 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )
                            )}
                        </div>

                        {}
                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-foreground">Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                placeholder="Add any additional notes or instructions..."
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
                                disabled={!formData.offerAmount.trim() || !formData.joiningDate || !formData.validityDate}
                            >
                                {isEditMode ? 'Update Offer' : 'Create & Send Offer'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
