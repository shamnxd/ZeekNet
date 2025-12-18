import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, FileText, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { jobApplicationApi } from '@/api';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { ScoreBadge } from '@/components/ui/score-badge';
import type { ApiError } from '@/types/api-error.type';

interface ResumeAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  onResumeVerified?: (file: File) => void;
}

export default function ResumeAnalyzerModal({ isOpen, onClose, jobId, onResumeVerified }: ResumeAnalyzerModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ score: number; reasoning: string; missingKeywords?: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(selectedFile.type)) {
        toast.error('Please upload a PDF or DOCX file.');
        return;
      }
      setFile(selectedFile);
      setResult(null); // Reset previous result
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobId) return;

    try {
      setAnalyzing(true);
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('job_id', jobId);

      const response = await jobApplicationApi.analyzeResume(formData);
      if (response.data.success) {
        setResult(response.data.data);
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleUseResume = () => {
    if (file && onResumeVerified) {
      onResumeVerified(file);
      onClose();
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            AI Resume Analyzer <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">Beta</Badge>
          </DialogTitle>
          <DialogDescription>
            Upload your resume to see how well it matches this job description.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {!result && (
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                {!file ? (
                  <Label
                    htmlFor="analyzer-resume"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                      <p className="text-xs text-gray-500">PDF or DOCX (MAX. 5MB)</p>
                    </div>
                    <Input id="analyzer-resume" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                  </Label>
                ) : (
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      Change
                    </Button>
                  </div>
                )}
              </div>

              <Button 
                onClick={handleAnalyze} 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={!file || analyzing}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  'Analyze Score'
                )}
              </Button>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="flex flex-col items-center justify-center space-y-2">
                <ScoreBadge score={result.score} />
                <p className="text-sm font-medium text-gray-500">Match Score</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    Analysis
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{result.reasoning}</p>
                </div>

                {result.missingKeywords && result.missingKeywords.length > 0 && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Missing Keywords
                    </h4>
                    <p className="text-xs text-amber-700 mb-3">Consider adding these skills to your resume if you have them:</p>
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords.map((keyword, i) => (
                        <Badge key={i} variant="outline" className="bg-white border-amber-200 text-amber-800 hover:bg-amber-50">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                 
                 {result.missingKeywords && result.missingKeywords.length === 0 && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-sm text-green-800 font-medium">Great job! Your resume covers all key requirements.</p>
                    </div>
                 )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {result ? (
            <div className="flex gap-2 w-full">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Scan Another
              </Button>
              {onResumeVerified && (
                <Button onClick={handleUseResume} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                  Use This Resume <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          ) : (
            <Button variant="outline" onClick={onClose} disabled={analyzing}>Cancel</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
