import { SubmitTechnicalTaskDto } from '../../../../application/use-cases/seeker/submit-technical-task.use-case';

export interface ISubmitTechnicalTaskUseCase {
  execute(
    userId: string,
    applicationId: string,
    taskId: string,
    data: SubmitTechnicalTaskDto,
  ): Promise<{
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
    createdAt: Date;
    updatedAt: Date;
  }>;
}
