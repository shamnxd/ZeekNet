import { useState, useEffect, useRef } from 'react';
import { FileText, Upload, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
        documentFilename: offerToEdit?.documentFilename
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [existingDocumentUrl, setExistingDocumentUrl] = useState<string | undefined>(offerToEdit?.documentUrl);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{
        offerAmount?: string;
        joiningDate?: string;
        validityDate?: string;
    }>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setIsSubmitting(false);
            if (offerToEdit) {
                setFormData({
                    offerAmount: offerToEdit.offerAmount || '',
                    employmentType: offerToEdit.employmentType || 'full-time',
                    joiningDate: offerToEdit.joiningDate || '',
                    validityDate: offerToEdit.validityDate || '',
                    documentUrl: offerToEdit.documentUrl,
                    documentFilename: offerToEdit.documentFilename
                });
                setExistingDocumentUrl(offerToEdit.documentUrl);
            } else {
                setFormData({
                    offerAmount: '',
                    employmentType: 'full-time',
                    joiningDate: '',
                    validityDate: '',
                    documentUrl: undefined,
                    documentFilename: undefined
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        const newErrors: {
            offerAmount?: string;
            joiningDate?: string;
            validityDate?: string;
        } = {};

        // Validate required fields
        if (!formData.offerAmount.trim()) {
            newErrors.offerAmount = 'Offer amount is required';
        } else {
            // Validate offer amount is a positive number
            const amount = parseFloat(formData.offerAmount);
            if (isNaN(amount) || amount <= 0) {
                newErrors.offerAmount = 'Must be a valid amount greater than 0';
            }
        }

        if (!formData.joiningDate) {
            newErrors.joiningDate = 'Joining date is required';
        }

        if (!formData.validityDate) {
            newErrors.validityDate = 'Offer validity date is required';
        }

        // Validate dates if both are provided
        if (formData.joiningDate && formData.validityDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

            const joiningDate = new Date(formData.joiningDate);
            const validityDate = new Date(formData.validityDate);

            // Check if joining date is in the past
            if (joiningDate < today) {
                newErrors.joiningDate = 'Joining date cannot be in the past';
            }

            // Check if validity date is in the past
            if (validityDate < today) {
                newErrors.validityDate = 'Offer validity date cannot be in the past';
            }

            // Check if joining date is before or equal to validity date
            if (joiningDate <= validityDate && !newErrors.joiningDate && !newErrors.validityDate) {
                newErrors.joiningDate = 'Joining date must be after the offer validity date';
            }
        }

        // If there are errors, set them and return
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Clear errors if validation passes
        setErrors({});

        try {
            setIsSubmitting(true);
            await onCreate({
                ...formData,
                document: selectedFile || undefined
            });
            handleClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
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
            documentFilename: undefined
        });
        setExistingDocumentUrl(undefined);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <FileText className="w-5 h-5 text-primary" />
                        {isEditMode ? 'Edit Offer' : 'Create Offer'}
                    </DialogTitle>
                    <div className="text-sm text-muted-foreground">
                        For <span className="font-medium text-foreground">{candidateName}</span> • {jobTitle}
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Offer Amount */}
                    <div className="space-y-1.5">
                        <Label htmlFor="offerAmount" className="text-sm font-medium">
                            Salary / Offer Amount <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="offerAmount"
                            value={formData.offerAmount}
                            onChange={(e) => {
                                setFormData({ ...formData, offerAmount: e.target.value });
                                if (errors.offerAmount) setErrors(prev => ({ ...prev, offerAmount: undefined }));
                            }}
                            placeholder="e.g., ₹9 LPA or ₹900,000"
                            className={`h-10 ${errors.offerAmount ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        />
                        {errors.offerAmount && (
                            <p className="text-xs font-medium text-red-500">{errors.offerAmount}</p>
                        )}
                    </div>

                    {/* Employment Type */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium">
                            Employment Type <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.employmentType}
                            onValueChange={(val) => setFormData({ ...formData, employmentType: val })}
                        >
                            <SelectTrigger className="w-full h-10">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="full-time">Full-time</SelectItem>
                                <SelectItem value="part-time">Part-time</SelectItem>
                                <SelectItem value="contract">Contract</SelectItem>
                                <SelectItem value="internship">Internship</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="joiningDate" className="text-sm font-medium">
                                Joining Date <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="joiningDate"
                                type="date"
                                value={formData.joiningDate}
                                onChange={(e) => {
                                    setFormData({ ...formData, joiningDate: e.target.value });
                                    if (errors.joiningDate) setErrors(prev => ({ ...prev, joiningDate: undefined }));
                                }}
                                className={`h-10 ${errors.joiningDate ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                            />
                            {errors.joiningDate && (
                                <p className="text-xs font-medium text-red-500">{errors.joiningDate}</p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="validityDate" className="text-sm font-medium">
                                Offer Validity <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="validityDate"
                                type="date"
                                value={formData.validityDate}
                                onChange={(e) => {
                                    setFormData({ ...formData, validityDate: e.target.value });
                                    if (errors.validityDate) setErrors(prev => ({ ...prev, validityDate: undefined }));
                                }}
                                className={`h-10 ${errors.validityDate ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                            />
                            {errors.validityDate && (
                                <p className="text-xs font-medium text-red-500">{errors.validityDate}</p>
                            )}
                        </div>
                    </div>

                    {/* Document Upload */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Offer Letter (PDF, DOC - Max 10MB)</Label>

                        {(existingDocumentUrl || selectedFile) ? (
                            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/40">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                                        <FileText className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {selectedFile ? selectedFile.name : (formData.documentFilename || 'Offer Document')}
                                        </p>
                                        {selectedFile && (
                                            <p className="text-xs text-muted-foreground">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                                    onClick={selectedFile ? removeFile : () => {
                                        setExistingDocumentUrl(undefined);
                                        setFormData(prev => ({ ...prev, documentUrl: undefined, documentFilename: undefined }));
                                    }}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <div
                                className="border-2 border-dashed border-border rounded-xl p-8 hover:bg-muted/30 transition-all cursor-pointer text-center group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Upload className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">
                                            <span className="text-primary">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-muted-foreground px-4">
                                            PDF, DOC or DOCX format. Maximum file size 10MB.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2 pt-4 border-t mt-2">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="h-10"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-[#4640DE] hover:bg-[#3730A3] h-10 px-6"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
                            </div>
                        ) : (
                            isEditMode ? 'Update Offer' : 'Create Offer'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
