export interface ResumeAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  onResumeVerified?: (file: File) => void;
}
