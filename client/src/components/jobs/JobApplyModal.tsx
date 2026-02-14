import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    ArrowRight,
    FileText,
    Upload,
    X,
    Sparkles,
    Loader2,
    AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { jobApplicationApi } from "@/api";
import type { ApiError } from "@/types/api-error.type";
import type { JobPostingResponse } from "@/interfaces/job/job-posting-response.interface";

interface JobApplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: JobPostingResponse | null;
    onSuccess: () => void;
}

const JobApplyModal = ({ isOpen, onClose, job, onSuccess }: JobApplyModalProps) => {
    const [coverLetter, setCoverLetter] = useState("");
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [resumeFileName, setResumeFileName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<{
        score: number;
        reasoning: string;
        missingKeywords?: string[];
    } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const allowedTypes = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ];
            if (!allowedTypes.includes(file.type)) {
                toast.error("Please upload a PDF, DOC, or DOCX file");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
            }
            setResumeFile(file);
            setResumeFileName(file.name);
        }
    };

    const handleRemoveResume = () => {
        setResumeFile(null);
        setResumeFileName("");
        setAnalysisResult(null);
    };

    const handleCheckAIScore = async () => {
        if (!resumeFile || !job?.id) return;

        try {
            setIsAnalyzing(true);
            const formData = new FormData();
            formData.append("resume", resumeFile);
            formData.append("job_id", job.id || job._id || "");

            const response = await jobApplicationApi.analyzeResume(formData);
            if (response.data.success) {
                setAnalysisResult(response.data.data);
                toast.success("Resume analyzed successfully!");
            }
        } catch (error: unknown) {
            const apiError = error as ApiError;
            toast.error(
                apiError.response?.data?.message || "Failed to analyze resume"
            );
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleApply = async () => {
        if (coverLetter.trim().length < 50) {
            toast.error("Cover letter must be at least 50 characters long");
            return;
        }

        if (!resumeFile) {
            toast.error("Please upload your resume");
            return;
        }

        if (!job?.id && !job?._id) {
            toast.error("Invalid job");
            return;
        }

        try {
            setIsSubmitting(true);

            const formData = new FormData();
            formData.append("job_id", job.id || job._id || "");
            formData.append("cover_letter", coverLetter.trim());
            formData.append("resume", resumeFile);

            await jobApplicationApi.createApplication(formData);

            toast.success("Application submitted successfully");
            onSuccess();
            handleClose();
        } catch (error: unknown) {
            const apiError = error as ApiError;
            const message =
                apiError?.response?.data?.message ||
                (Array.isArray((apiError?.response?.data as { errors?: { message: string }[] })?.errors) &&
                    (apiError.response?.data as { errors: { message: string }[] }).errors[0]?.message) ||
                "Failed to submit application";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting && !isAnalyzing) {
            setCoverLetter("");
            setResumeFile(null);
            setResumeFileName("");
            setAnalysisResult(null);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0 gap-0 border-none shadow-2xl">
                <div className="p-1 bg-white">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-xl mb-1 !font-bold !text-[#18191C]">
                            Apply for this position
                        </DialogTitle>
                        <DialogDescription className="text-sm !text-[#6B7280]">
                            Submit your details for <span className="text-[#18191C] !font-medium">{job?.title}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="coverLetter" className="text-sm font-semibold text-[#18191C]">
                                    Cover Letter <span className="text-red-500">*</span>
                                </Label>
                            </div>
                            <Textarea
                                id="coverLetter"
                                placeholder="What makes you a good fit for this role?"
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                className="min-h-[100px] text-sm resize-none focus-visible:ring-primary/20 border-gray-200"
                                disabled={isSubmitting}
                            />
                            <div className="flex justify-between items-center text-[11px]">
                                <p className={`${coverLetter.trim().length < 50 ? "text-gray-500" : "text-[#3570E2]"} font-medium`}>
                                    {coverLetter.trim().length} / 50 characters min
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="resume" className="text-sm !font-semibold !text-[#18191C]">
                                    Resume <span className="text-red-500">*</span>
                                </Label>
                                {resumeFile && !analysisResult && (
                                    <button
                                        type="button"
                                        disabled={isAnalyzing}
                                        className="text-[13px] text-[#4045DE] hover:text-primary font-bold flex items-center gap-1 disabled:opacity-50"
                                        onClick={handleCheckAIScore}
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-3 h-3" /> Check AI Score
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                            {!resumeFile ? (
                                <div className="relative">
                                    <Input
                                        id="resume"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        disabled={isSubmitting || isAnalyzing}
                                    />
                                    <Label
                                        htmlFor="resume"
                                        className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-100 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-gray-50 border-primary/20 transition-all group"
                                    >
                                        <Upload className="w-6 h-6 group-hover:text-gray-400 text-primary transition-colors mb-2" />
                                        <p className="text-xs font-semibold group-hover:text-gray-500 text-primary transition-colors">
                                            Upload PDF (Max 5MB)
                                        </p>
                                    </Label>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/10 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <FileText className="w-4 h-4 text-primary" />
                                            </div>
                                            <div className="max-w-[180px]">
                                                <p className="text-xs font-bold text-[#18191C] truncate">{resumeFileName}</p>
                                                <p className="text-[10px] text-gray-500">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleRemoveResume}
                                            disabled={isSubmitting || isAnalyzing}
                                            className="h-8 w-8 text-red-500 hover:bg-red-50 rounded-full"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    {analysisResult && (
                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${analysisResult.score >= 80 ? "bg-green-100 text-green-700" :
                                                        analysisResult.score >= 60 ? "bg-orange-100 text-orange-700" :
                                                            "bg-red-100 text-red-700"
                                                        }`}>
                                                        {analysisResult.score}%
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-bold text-[#18191C]">Match Score</p>
                                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">AI Analysis</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-gray-600 leading-relaxed italic">
                                                "{analysisResult.reasoning}"
                                            </p>
                                            {analysisResult.missingKeywords && analysisResult.missingKeywords.length > 0 && (
                                                <div className="space-y-1.5">
                                                    <p className="text-[10px] font-bold text-gray-500 flex items-center gap-1 uppercase tracking-wider">
                                                        <AlertTriangle className="w-3 h-3 text-amber-500" /> Improvement Areas
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {analysisResult.missingKeywords.map((kw, i) => (
                                                            <span key={i} className="text-[9px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-500">
                                                                + {kw}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting || isAnalyzing}
                            className="flex-1 h-11 border-gray-200 text-[#18191C] font-semibold rounded-full"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApply}
                            disabled={isSubmitting || isAnalyzing || coverLetter.trim().length < 50 || !resumeFile}
                            className="flex-[2] h-11 bg-primary hover:bg-primary/90 text-white font-bold rounded-full shadow-lg shadow-primary/20"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>Submit Application <ArrowRight className="ml-2 h-4 w-4" /></>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default JobApplyModal;
