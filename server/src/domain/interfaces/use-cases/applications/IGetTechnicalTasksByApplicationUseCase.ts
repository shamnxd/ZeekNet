export interface TechnicalTaskForSeekerDto {
  id: string;
  applicationId: string;
  title: string;
  description: string;
  deadline: Date;
  documentFilename?: string;
  documentUrl?: string;
  submissionFilename?: string;
  submissionUrl?: string;
  submissionLink?: string;
  submissionNote?: string;
  submittedAt?: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetTechnicalTasksByApplicationUseCase {
  execute(userId: string, applicationId: string): Promise<TechnicalTaskForSeekerDto[]>;
}
