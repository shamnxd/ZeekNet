import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Upload, File as FileIcon, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TaskFormData } from '@/pages/company/CandidateProfileTypes';

interface AssignTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidateName: string;
    onAssign: (data: TaskFormData) => Promise<void>;
    taskToEdit?: TaskFormData & { id?: string };
    isLoading?: boolean;
}

export const AssignTaskModal = ({
    isOpen,
    onClose,
    candidateName,
    onAssign,
    taskToEdit,
    isLoading: externalIsLoading = false
}: AssignTaskModalProps) => {
    const isEditMode = !!taskToEdit;
    const [formData, setFormData] = useState<TaskFormData>({
        title: '',
        description: '',
        deadline: '',
        documentUrl: undefined,
        documentFilename: undefined
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isLoading = externalIsLoading || isSubmitting;

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            setIsSubmitting(false);
            if (taskToEdit) {
                setFormData({
                    title: taskToEdit.title || '',
                    description: taskToEdit.description || '',
                    deadline: taskToEdit.deadline ? new Date(taskToEdit.deadline).toISOString().split('T')[0] : '',
                    documentUrl: taskToEdit.documentUrl,
                    documentFilename: taskToEdit.documentFilename
                });
            } else {
                setFormData({
                    title: '',
                    description: '',
                    deadline: '',
                    documentUrl: undefined,
                    documentFilename: undefined
                });
            }
            setSelectedFile(null);
        }
    }, [taskToEdit, isOpen]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent | File) => {
        let file: File | undefined;

        if (e instanceof File) {
            file = e;
        } else if ('target' in e && (e.target as HTMLInputElement).files?.[0]) {
            file = (e.target as HTMLInputElement).files![0];
        } else if ('dataTransfer' in e && e.dataTransfer.files?.[0]) {
            file = e.dataTransfer.files[0];
        }

        if (file) {
            const validTypes = ['application/pdf', 'application/zip', 'application/x-zip-compressed', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            const fileExt = file.name.split('.').pop()?.toLowerCase();
            const allowedExts = ['pdf', 'doc', 'docx', 'zip'];

            if (!validTypes.some(type => file.type === type) && !allowedExts.includes(fileExt || '')) {
                setErrors(prev => ({ ...prev, document: 'Please select a valid file (PDF, DOC, DOCX, or ZIP)' }));
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, document: 'File size must be less than 10MB' }));
                return;
            }

            setErrors(prev => ({ ...prev, document: undefined }));
            setSelectedFile(file);
            setFormData(prev => ({
                ...prev,
                documentFilename: file!.name
            }));
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!isLoading) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (!isLoading) handleFileSelect(e);
    };

    const handleRemoveFile = () => {
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

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof TaskFormData, string>> = {};
        let isValid = true;

        if (!formData.title.trim()) {
            newErrors.title = 'Task title is required';
            isValid = false;
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Task description is required';
            isValid = false;
        }

        if (!formData.deadline) {
            newErrors.deadline = 'Deadline is required';
            isValid = false;
        } else {
            const selectedDate = new Date(formData.deadline);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                newErrors.deadline = 'Deadline cannot be in the past';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setIsSubmitting(true);
            await onAssign({
                ...formData,
                document: selectedFile || undefined
            });
            onClose();
        } catch (error) {
            console.error('Failed to assign task:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof TaskFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <FileText className="w-5 h-5 text-[#4640DE]" />
                        {isEditMode ? 'Edit Technical Task' : 'Assign Technical Task'}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        Assign a technical evaluation task for <span className="font-medium text-foreground">{candidateName}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="py-2 space-y-4">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <Label htmlFor="title" className="text-sm">
                            Task Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="e.g., React Dashboard Component"
                            className={cn("h-9", errors.title && "border-red-500 focus-visible:ring-red-500")}
                            disabled={isLoading}
                        />
                        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label htmlFor="description" className="text-sm">
                            Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Describe the task requirements and expectations..."
                            rows={4}
                            className={cn("resize-none", errors.description && "border-red-500 focus-visible:ring-red-500")}
                            disabled={isLoading}
                        />
                        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                    </div>

                    {/* Deadline */}
                    <div className="space-y-1.5">
                        <Label htmlFor="deadline" className="text-sm">
                            Deadline <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="deadline"
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => handleInputChange('deadline', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className={cn("h-9", errors.deadline && "border-red-500 focus-visible:ring-red-500")}
                            disabled={isLoading}
                        />
                        {errors.deadline && <p className="text-xs text-red-500">{errors.deadline}</p>}
                    </div>

                    {/* File Attachment */}
                    <div className="space-y-1.5">
                        <Label className="text-sm">Attachment (Optional)</Label>
                        {(formData.documentUrl || selectedFile) ? (
                            <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="p-2 bg-white rounded border">
                                        <FileIcon className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium truncate">
                                            {selectedFile ? selectedFile.name : formData.documentFilename}
                                        </p>
                                        {selectedFile && (
                                            <p className="text-[10px] text-muted-foreground">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={handleRemoveFile}
                                    disabled={isLoading}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <div
                                className={cn(
                                    "border-2 border-dashed rounded-md p-4 transition-colors cursor-pointer text-center",
                                    "hover:bg-muted/50 hover:border-primary/50",
                                    isDragging ? "border-primary bg-primary/5" : "border-muted",
                                    errors.document ? "border-red-500 bg-red-50/50" : ""
                                )}
                                onClick={() => !isLoading && fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx,.zip"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                                <div className="space-y-1">
                                    <p className="text-xs font-medium">Click to upload or drag and drop</p>
                                    <p className="text-[10px] text-muted-foreground">PDF, DOC, DOCX, ZIP (MAX. 10MB)</p>
                                </div>
                            </div>
                        )}
                        {errors.document && <p className="text-xs text-red-500">{errors.document}</p>}
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-2">
                    <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-[#4640DE] hover:bg-[#3730A3]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                {isEditMode ? 'Saving...' : 'Assigning...'}
                            </>
                        ) : (
                            isEditMode ? 'Update Task' : 'Assign Task'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
