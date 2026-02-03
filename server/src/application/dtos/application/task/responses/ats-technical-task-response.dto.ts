export interface ATSTechnicalTaskResponseDto {
  id: string;
  applicationId: string;
  title: string;
  description: string;
  deadline: Date;
  documentUrl?: string;
  documentFilename?: string;
  submissionUrl?: string;
  submissionFilename?: string;
  submissionLink?: string;
  submissionNote?: string;
  submittedAt?: Date;
  status: string;
  feedback?: string;
  score?: number;
  createdAt: Date;
  updatedAt: Date;
}
