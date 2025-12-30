import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Upload, File as FileIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AssignTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidateName: string;
    onAssign: (data: TaskFormData) => void;
    taskToEdit?: TaskFormData & { id?: string }; // Task data for editing
}

interface TaskFormData {
    title: string;
    description: string;
    deadline: string;
    documentUrl?: string;
    documentFilename?: string;
    document?: File;
}

export const AssignTaskModal = ({
    isOpen,
    onClose,
    candidateName,
    onAssign,
    taskToEdit
}: AssignTaskModalProps) => {
    const isEditMode = !!taskToEdit;
    const [formData, setFormData] = useState<TaskFormData>({
        title: taskToEdit?.title || '',
        description: taskToEdit?.description || '',
        deadline: taskToEdit?.deadline || '',
        documentUrl: taskToEdit?.documentUrl,
        documentFilename: taskToEdit?.documentFilename
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [existingDocumentUrl, setExistingDocumentUrl] = useState<string | undefined>(taskToEdit?.documentUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Update form data when taskToEdit changes
    useEffect(() => {
        if (taskToEdit) {
            setFormData({
                title: taskToEdit.title || '',
                description: taskToEdit.description || '',
                deadline: taskToEdit.deadline || '',
                documentUrl: taskToEdit.documentUrl,
                documentFilename: taskToEdit.documentFilename
            });
            setExistingDocumentUrl(taskToEdit.documentUrl);
        } else {
            setFormData({
                title: '',
                description: '',
                deadline: '',
                documentUrl: undefined,
                documentFilename: undefined
            });
            setExistingDocumentUrl(undefined);
        }
        setSelectedFile(null);
    }, [taskToEdit]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ['application/pdf', 'application/zip', 'application/x-zip-compressed', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.some(type => file.type.includes(type.split('/')[1]) || file.type === type)) {
                alert('Please select a valid file (PDF, DOC, DOCX, or ZIP)');
                return;
            }
            // Validate file size (10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                return;
            }
            setSelectedFile(file);
            // Store file data - in real implementation, this would be uploaded first
            setFormData(prev => ({
                ...prev,
                documentFilename: file.name,
                documentUrl: URL.createObjectURL(file) // Temporary URL, should be replaced with actual upload
            }));
        }
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Pass the actual File object if a new file is selected
        onAssign({
            ...formData,
            document: selectedFile || undefined
        });
        // Reset form
        setFormData({
            title: '',
            description: '',
            deadline: '',
            documentUrl: undefined,
            documentFilename: undefined
        });
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose();
    };

    const handleClose = () => {
        if (!taskToEdit) {
            setFormData({
                title: '',
                description: '',
                deadline: '',
                documentUrl: undefined,
                documentFilename: undefined
            });
            setSelectedFile(null);
            setExistingDocumentUrl(undefined);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-stage-task/20 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-stage-task" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">{isEditMode ? 'Edit Technical Task' : 'Assign Technical Task'}</h2>
                                {!isEditMode && <p className="text-sm text-muted-foreground">For {candidateName}</p>}
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
                    <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Task Title
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., React Dashboard Component"
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Task Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the task requirements and expectations..."
                                rows={5}
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                required
                            />
                        </div>

                        {/* Deadline */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Deadline
                            </label>
                            <input
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                required
                            />
                        </div>

                        {/* Attachments */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Attach Documents (Optional)
                            </label>
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
                            {!selectedFile && !existingDocumentUrl && (
                                <div 
                                    className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.doc,.docx,.zip"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        PDF, DOC, DOCX, ZIP up to 10MB
                                    </p>
                                </div>
                            )}
                            {selectedFile && (
                                <div className="border border-border rounded-lg p-4 bg-muted/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileIcon className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="text-destructive hover:text-destructive/80 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1 gradient-primary text-primary-foreground hover:opacity-90">
                                {isEditMode ? 'Update Task' : 'Assign Task'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
